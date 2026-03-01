// Market store — fetches NIP-15 stalls and products
import type { NostrEvent } from '../../../nostr/event';
import type { NostrFilter } from '../../../nostr/filter';
import { pool, profiles } from './nostr';

// ═══ Types ═══
export interface ShippingZone {
    id: string;
    name?: string;
    cost: number;
    regions: string[];
}

export interface Stall {
    id: string;
    pubkey: string;
    name: string;
    description: string;
    currency: string;
    shipping: ShippingZone[];
    event: NostrEvent;
}

export interface Product {
    id: string;
    stallId: string;
    pubkey: string;
    name: string;
    description: string;
    images: string[];
    currency: string;
    price: number;
    quantity: number | null;
    specs: [string, string][];
    shipping: { id: string; cost: number }[];
    categories: string[];
    event: NostrEvent;
}

export interface CartItem {
    product: Product;
    quantity: number;
}

// ═══ Parsers ═══
export function parseStallEvent(event: NostrEvent): Stall | null {
    try {
        const content = JSON.parse(event.content);
        return {
            id: content.id,
            pubkey: event.pubkey,
            name: content.name || 'Unnamed Stall',
            description: content.description || '',
            currency: content.currency || 'sat',
            shipping: content.shipping || [],
            event,
        };
    } catch {
        return null;
    }
}

export function parseProductEvent(event: NostrEvent): Product | null {
    try {
        const content = JSON.parse(event.content);
        const categories = event.tags
            .filter(t => t[0] === 't')
            .map(t => t[1]);
        return {
            id: content.id,
            stallId: content.stall_id,
            pubkey: event.pubkey,
            name: content.name || 'Unnamed Product',
            description: content.description || '',
            images: content.images || [],
            currency: content.currency || 'sat',
            price: content.price || 0,
            quantity: content.quantity ?? null,
            specs: content.specs || [],
            shipping: content.shipping || [],
            categories,
            event,
        };
    } catch {
        return null;
    }
}

// ═══ Store ═══
type Listener = () => void;

export class MarketStore {
    stalls = new Map<string, Stall>();
    products = new Map<string, Product>();
    cart: CartItem[] = [];
    loading = false;
    private listeners = new Set<Listener>();

    subscribe(fn: Listener): () => void {
        this.listeners.add(fn);
        return () => this.listeners.delete(fn);
    }

    private notify() {
        for (const fn of this.listeners) fn();
    }

    get stallList(): Stall[] {
        return Array.from(this.stalls.values());
    }

    getProductsByStall(stallId: string): Product[] {
        return Array.from(this.products.values()).filter(p => p.stallId === stallId);
    }

    get allProducts(): Product[] {
        return Array.from(this.products.values());
    }

    get cartTotal(): number {
        return this.cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    }

    get cartCurrency(): string {
        return this.cart[0]?.product.currency || 'sat';
    }

    loadMarketplace(merchantPubkeys?: string[]) {
        this.loading = true;
        this.notify();

        const stallFilter: NostrFilter = { kinds: [30017], limit: 100 };
        const productFilter: NostrFilter = { kinds: [30018], limit: 500 };

        if (merchantPubkeys && merchantPubkeys.length > 0) {
            stallFilter.authors = merchantPubkeys;
            productFilter.authors = merchantPubkeys;
        }

        pool.subscribe(
            [stallFilter],
            (event) => {
                const stall = parseStallEvent(event);
                if (stall) {
                    this.stalls.set(stall.id, stall);
                    profiles.fetch(event.pubkey);
                    this.notify();
                }
            },
            () => {
                pool.subscribe(
                    [productFilter],
                    (event) => {
                        const product = parseProductEvent(event);
                        if (product) {
                            this.products.set(product.id, product);
                            this.notify();
                        }
                    },
                    () => {
                        this.loading = false;
                        this.notify();
                    },
                );
            },
        );
    }

    addToCart(product: Product, qty = 1) {
        const existing = this.cart.find(i => i.product.id === product.id);
        if (existing) {
            existing.quantity += qty;
        } else {
            this.cart.push({ product, quantity: qty });
        }
        this.notify();
    }

    removeFromCart(productId: string) {
        this.cart = this.cart.filter(i => i.product.id !== productId);
        this.notify();
    }

    updateCartQuantity(productId: string, qty: number) {
        const item = this.cart.find(i => i.product.id === productId);
        if (item) {
            item.quantity = Math.max(1, qty);
            this.notify();
        }
    }

    clearCart() {
        this.cart = [];
        this.notify();
    }
}

export const marketStore = new MarketStore();

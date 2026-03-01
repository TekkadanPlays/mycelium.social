import { Component } from 'inferno';
import { createElement } from 'inferno-create-element';
import { marketStore, type Stall, type Product } from './market';
import { profiles } from './nostr';
import { icon } from './icons';

interface MarketplacePageState {
    stalls: Stall[];
    products: Product[];
    loading: boolean;
    searchQuery: string;
    selectedCategory: string;
    selectedCurrency: string;
    viewMode: 'stalls' | 'products';
    selectedProduct: Product | null;
    cartOpen: boolean;
}

export class MarketplacePage extends Component<{}, MarketplacePageState> {
    private unsubs: (() => void)[] = [];

    constructor(props: {}) {
        super(props);
        this.state = {
            stalls: [],
            products: [],
            loading: true,
            searchQuery: '',
            selectedCategory: '',
            selectedCurrency: '',
            viewMode: 'products',
            selectedProduct: null,
            cartOpen: false,
        };
    }

    componentDidMount() {
        this.unsubs.push(marketStore.subscribe(() => {
            this.setState({
                stalls: marketStore.stallList,
                products: marketStore.allProducts,
                loading: marketStore.loading,
            });
        }));
        this.unsubs.push(profiles.subscribe(() => this.forceUpdate()));

        marketStore.loadMarketplace();
    }

    componentWillUnmount() {
        for (const fn of this.unsubs) fn();
    }

    get categoriesByCurrency(): Map<string, { category: string; count: number }[]> {
        const map = new Map<string, Map<string, number>>();
        for (const p of this.state.products) {
            const cur = p.currency || 'sat';
            if (!map.has(cur)) map.set(cur, new Map());
            const catMap = map.get(cur)!;
            for (const c of p.categories) {
                catMap.set(c, (catMap.get(c) || 0) + 1);
            }
        }
        const result = new Map<string, { category: string; count: number }[]>();
        for (const [cur, catMap] of map) {
            result.set(cur, Array.from(catMap.entries())
                .map(([category, count]) => ({ category, count }))
                .sort((a, b) => b.count - a.count));
        }
        return result;
    }

    get filteredProducts(): Product[] {
        let products = this.state.products;
        const { searchQuery, selectedCategory, selectedCurrency } = this.state;

        if (selectedCurrency) {
            products = products.filter(p => (p.currency || 'sat') === selectedCurrency);
        }
        if (selectedCategory) {
            products = products.filter(p => p.categories.includes(selectedCategory));
        }
        if (searchQuery.trim()) {
            const q = searchQuery.toLowerCase();
            products = products.filter(p =>
                p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
            );
        }
        return products;
    }

    render() {
        const { stalls, loading, searchQuery, selectedCategory, selectedCurrency, viewMode, selectedProduct, cartOpen } = this.state;
        const products = this.filteredProducts;
        const categoriesByCurrency = this.categoriesByCurrency;
        const cartCount = marketStore.cart.length;

        return createElement('div', { className: 'flex gap-6' },
            // Left sidebar — currency filter toggles + categories
            createElement('aside', { className: 'hidden lg:block w-56 flex-shrink-0' },
                createElement('div', { className: 'sticky top-20 space-y-4' },
                    // Currency toggle filter
                    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5' },
                        icon('bolt', 'w-4 h-4'), 'Currency',
                    ),
                    createElement('div', { className: 'flex flex-wrap gap-1.5' },
                        ...Array.from(categoriesByCurrency.keys()).map((currency) => {
                            const isActive = selectedCurrency === currency;
                            const count = this.state.products.filter(p => (p.currency || 'sat') === currency).length;
                            return createElement('button', {
                                key: currency,
                                onClick: () => this.setState({
                                    selectedCurrency: isActive ? '' : currency,
                                    selectedCategory: isActive ? selectedCategory : '',
                                }),
                                className: `px-3 py-1.5 rounded-full text-xs font-medium transition-colors flex items-center gap-1.5 ${isActive
                                        ? 'bg-primary text-primary-foreground'
                                        : 'bg-secondary text-muted-foreground hover:text-foreground hover:bg-accent'
                                    }`,
                            },
                                currency.toUpperCase(),
                                createElement('span', { className: isActive ? 'opacity-80' : 'opacity-50' }, String(count)),
                            );
                        }),
                    ),
                    // Categories
                    createElement('h3', { className: 'text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5 mt-4' },
                        icon('tag', 'w-4 h-4'), 'Categories',
                    ),
                    createElement('button', {
                        onClick: () => this.setState({ selectedCategory: '', selectedCurrency: '' }),
                        className: `w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${!selectedCategory && !selectedCurrency
                                ? 'bg-primary/10 text-primary font-medium'
                                : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                            }`,
                    }, 'All Products'),
                    // Show categories for the selected currency, or all if none selected
                    ...((): any[] => {
                        const entries = selectedCurrency
                            ? [[selectedCurrency, categoriesByCurrency.get(selectedCurrency) || []]] as [string, { category: string; count: number }[]][]
                            : Array.from(categoriesByCurrency.entries());
                        return entries.flatMap(([currency, cats]) =>
                            cats.map(({ category, count }) => {
                                const isActive = selectedCategory === category;
                                return createElement('button', {
                                    key: `${currency}-${category}`,
                                    onClick: () => this.setState({
                                        selectedCategory: isActive ? '' : category,
                                        selectedCurrency: isActive ? selectedCurrency : currency,
                                    }),
                                    className: `w-full text-left px-3 py-1.5 rounded-md text-sm transition-colors flex items-center justify-between ${isActive
                                            ? 'bg-primary/10 text-primary font-medium'
                                            : 'text-muted-foreground hover:text-foreground hover:bg-secondary'
                                        }`,
                                },
                                    createElement('span', { className: 'truncate' }, category),
                                    createElement('span', { className: 'text-xs opacity-50' }, String(count)),
                                );
                            }),
                        );
                    })(),
                ),
            ),
            // Main content
            createElement('div', { className: 'flex-1 min-w-0' },
                // Header
                createElement('div', { className: 'flex items-center justify-between mb-6' },
                    createElement('div', null,
                        createElement('h2', { className: 'text-2xl font-bold flex items-center gap-2' },
                            icon('shopping-cart', 'w-6 h-6 text-primary'),
                            'Marketplace',
                        ),
                        createElement('p', { className: 'text-sm text-muted-foreground mt-1' }, 'Decentralized commerce on Nostr'),
                    ),
                    createElement('button', {
                        onClick: () => this.setState({ cartOpen: true }),
                        className: 'relative px-4 py-2 rounded-lg bg-secondary hover:bg-accent transition-colors text-sm flex items-center gap-1.5',
                    },
                        icon('shopping-cart', 'w-4 h-4'), 'Cart',
                        cartCount > 0 && createElement('span', {
                            className: 'absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-primary text-primary-foreground text-xs flex items-center justify-center font-bold',
                        }, String(cartCount)),
                    ),
                ),
                // Search bar
                createElement('div', { className: 'mb-4 relative' },
                    createElement('div', { className: 'absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground' },
                        icon('magnifying-glass', 'w-4 h-4'),
                    ),
                    createElement('input', {
                        type: 'text',
                        value: searchQuery,
                        onInput: (e: any) => this.setState({ searchQuery: e.target.value }),
                        placeholder: 'Search products...',
                        className: 'w-full bg-card border border-border rounded-lg pl-10 pr-4 py-2.5 text-sm outline-none focus:border-primary transition-colors',
                    }),
                ),
                // View toggle
                createElement('div', { className: 'flex gap-2 mb-4' },
                    createElement('button', {
                        onClick: () => this.setState({ viewMode: 'products' }),
                        className: `px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${viewMode === 'products' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`,
                    }, icon('tag', 'w-3.5 h-3.5'), 'Products'),
                    createElement('button', {
                        onClick: () => this.setState({ viewMode: 'stalls' }),
                        className: `px-3 py-1.5 rounded-md text-xs flex items-center gap-1.5 ${viewMode === 'stalls' ? 'bg-primary text-primary-foreground' : 'bg-secondary text-muted-foreground'}`,
                    }, icon('building-storefront', 'w-3.5 h-3.5'), 'Stalls'),
                ),
                // Loading
                loading && createElement('div', { className: 'text-center py-12 text-muted-foreground' },
                    createElement('div', { className: 'mb-4' }, icon('shopping-cart', 'w-12 h-12 mx-auto animate-pulse')),
                    createElement('p', null, 'Loading marketplace...'),
                ),
                // Products grid
                viewMode === 'products' && !loading && createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
                    ...products.map(product =>
                        createElement('div', {
                            key: product.id,
                            className: 'bg-card border border-border rounded-xl overflow-hidden hover:border-primary/30 transition-all duration-200 cursor-pointer',
                            onClick: () => this.setState({ selectedProduct: product }),
                        },
                            product.images.length > 0 && createElement('div', { className: 'aspect-video overflow-hidden bg-muted' },
                                createElement('img', {
                                    src: product.images[0],
                                    alt: product.name,
                                    className: 'w-full h-full object-cover hover:scale-105 transition-transform duration-300',
                                }),
                            ),
                            createElement('div', { className: 'p-4' },
                                createElement('h3', { className: 'font-semibold text-sm truncate' }, product.name),
                                createElement('p', { className: 'text-xs text-muted-foreground mt-1 line-clamp-2' }, product.description),
                                createElement('div', { className: 'flex items-center justify-between mt-3' },
                                    createElement('span', { className: 'text-lg font-bold text-primary' },
                                        `${product.price} ${product.currency}`
                                    ),
                                    product.quantity !== null && createElement('span', { className: 'text-xs text-muted-foreground' },
                                        `${product.quantity} left`
                                    ),
                                ),
                                createElement('button', {
                                    onClick: (e: Event) => { e.stopPropagation(); marketStore.addToCart(product); },
                                    className: 'w-full mt-3 px-3 py-2 rounded-lg bg-primary text-primary-foreground text-xs font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5',
                                }, icon('shopping-cart', 'w-3.5 h-3.5'), 'Add to Cart'),
                            ),
                        ),
                    ),
                    !loading && products.length === 0 && createElement('div', { className: 'col-span-full text-center py-12 text-muted-foreground' },
                        createElement('div', { className: 'mb-4' }, icon('building-storefront', 'w-12 h-12 mx-auto')),
                        createElement('p', null, 'No products found'),
                        createElement('p', { className: 'text-sm mt-2' }, 'Try different search terms or categories'),
                    ),
                ),
                // Stalls grid
                viewMode === 'stalls' && !loading && createElement('div', { className: 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4' },
                    ...stalls.map(stall => {
                        const profile = profiles.get(stall.pubkey);
                        const productCount = marketStore.getProductsByStall(stall.id).length;
                        return createElement('div', {
                            key: stall.id,
                            className: 'bg-card border border-border rounded-xl p-4 hover:border-primary/30 transition-all duration-200',
                        },
                            createElement('div', { className: 'flex items-center gap-3 mb-3' },
                                createElement('div', { className: 'w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center overflow-hidden' },
                                    profile?.picture
                                        ? createElement('img', { src: profile.picture, className: 'w-full h-full object-cover', alt: '' })
                                        : icon('building-storefront', 'w-5 h-5 text-muted-foreground'),
                                ),
                                createElement('div', null,
                                    createElement('h3', { className: 'font-semibold text-sm' }, stall.name),
                                    createElement('p', { className: 'text-xs text-muted-foreground' },
                                        profile?.displayName || profile?.name || 'Unknown merchant'
                                    ),
                                ),
                            ),
                            createElement('p', { className: 'text-xs text-muted-foreground line-clamp-2' }, stall.description),
                            createElement('div', { className: 'flex items-center justify-between mt-3' },
                                createElement('span', { className: 'text-xs text-primary' }, `${productCount} products`),
                                createElement('span', { className: 'text-xs text-muted-foreground' }, stall.currency),
                            ),
                        );
                    }),
                    stalls.length === 0 && createElement('div', { className: 'col-span-full text-center py-12 text-muted-foreground' },
                        createElement('div', { className: 'mb-4' }, icon('signal', 'w-12 h-12 mx-auto')),
                        createElement('p', null, 'No stalls found'),
                    ),
                ),
                // Product detail modal
                selectedProduct && createElement('div', {
                    className: 'fixed inset-0 z-50 flex items-center justify-center bg-black/60',
                    onClick: () => this.setState({ selectedProduct: null }),
                },
                    createElement('div', {
                        className: 'bg-card border border-border rounded-xl w-full max-w-lg max-h-[80vh] overflow-y-auto',
                        onClick: (e: Event) => e.stopPropagation(),
                    },
                        selectedProduct.images.length > 0 && createElement('div', { className: 'aspect-video overflow-hidden' },
                            createElement('img', {
                                src: selectedProduct.images[0],
                                alt: selectedProduct.name,
                                className: 'w-full h-full object-cover',
                            }),
                        ),
                        createElement('div', { className: 'p-6' },
                            createElement('h3', { className: 'text-xl font-bold' }, selectedProduct.name),
                            createElement('p', { className: 'text-2xl font-bold text-primary mt-2' },
                                `${selectedProduct.price} ${selectedProduct.currency}`
                            ),
                            createElement('p', { className: 'text-sm text-muted-foreground mt-3 leading-relaxed' }, selectedProduct.description),
                            selectedProduct.specs.length > 0 && createElement('div', { className: 'mt-4 space-y-1' },
                                createElement('h4', { className: 'text-xs text-muted-foreground font-medium uppercase mb-2' }, 'Specifications'),
                                ...selectedProduct.specs.map(([key, val]) =>
                                    createElement('div', { className: 'flex justify-between text-sm py-1 border-b border-border/30' },
                                        createElement('span', { className: 'text-muted-foreground' }, key),
                                        createElement('span', null, val),
                                    )
                                ),
                            ),
                            createElement('button', {
                                onClick: () => { marketStore.addToCart(selectedProduct); this.setState({ selectedProduct: null }); },
                                className: 'w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2',
                            }, icon('shopping-cart', 'w-5 h-5'), 'Add to Cart'),
                        ),
                    ),
                ),
                // Cart Sheet
                cartOpen && this.renderCart(),
            ),
        );
    }

    renderCart() {
        const { cart, cartTotal, cartCurrency } = marketStore;

        return createElement('div', {
            className: 'fixed inset-0 z-50 flex justify-end',
            onClick: () => this.setState({ cartOpen: false }),
        },
            createElement('div', { className: 'fixed inset-0 bg-black/60' }),
            createElement('div', {
                className: 'relative w-full max-w-sm bg-card border-l border-border h-full overflow-y-auto',
                onClick: (e: Event) => e.stopPropagation(),
            },
                createElement('div', { className: 'p-6' },
                    createElement('div', { className: 'flex items-center justify-between mb-6' },
                        createElement('h3', { className: 'text-lg font-bold flex items-center gap-2' },
                            icon('shopping-cart', 'w-5 h-5'), 'Cart',
                        ),
                        createElement('button', {
                            onClick: () => this.setState({ cartOpen: false }),
                            className: 'text-muted-foreground hover:text-foreground',
                        }, icon('x-mark', 'w-5 h-5')),
                    ),
                    cart.length === 0
                        ? createElement('div', { className: 'text-center py-12 text-muted-foreground' },
                            createElement('div', { className: 'mb-4' }, icon('shopping-cart', 'w-12 h-12 mx-auto')),
                            createElement('p', null, 'Your cart is empty'),
                        )
                        : createElement('div', { className: 'space-y-3' },
                            ...cart.map(item =>
                                createElement('div', { key: item.product.id, className: 'bg-secondary/30 rounded-lg p-3 flex items-center gap-3' },
                                    item.product.images.length > 0 && createElement('img', {
                                        src: item.product.images[0],
                                        className: 'w-12 h-12 rounded object-cover',
                                        alt: '',
                                    }),
                                    createElement('div', { className: 'flex-1 min-w-0' },
                                        createElement('p', { className: 'text-sm font-medium truncate' }, item.product.name),
                                        createElement('p', { className: 'text-xs text-primary' }, `${item.product.price} ${item.product.currency}`),
                                    ),
                                    createElement('div', { className: 'flex items-center gap-2' },
                                        createElement('button', {
                                            onClick: () => marketStore.updateCartQuantity(item.product.id, item.quantity - 1),
                                            className: 'w-6 h-6 rounded bg-secondary text-xs flex items-center justify-center',
                                        }, '\u2212'),
                                        createElement('span', { className: 'text-sm w-6 text-center' }, String(item.quantity)),
                                        createElement('button', {
                                            onClick: () => marketStore.updateCartQuantity(item.product.id, item.quantity + 1),
                                            className: 'w-6 h-6 rounded bg-secondary text-xs flex items-center justify-center',
                                        }, '+'),
                                    ),
                                    createElement('button', {
                                        onClick: () => marketStore.removeFromCart(item.product.id),
                                        className: 'text-destructive',
                                    }, icon('x-mark', 'w-4 h-4')),
                                ),
                            ),
                            createElement('div', { className: 'border-t border-border pt-3 mt-3' },
                                createElement('div', { className: 'flex justify-between items-center' },
                                    createElement('span', { className: 'text-sm text-muted-foreground' }, 'Total'),
                                    createElement('span', { className: 'text-lg font-bold text-primary' }, `${cartTotal} ${cartCurrency}`),
                                ),
                                createElement('button', {
                                    className: 'w-full mt-4 px-4 py-3 rounded-lg bg-primary text-primary-foreground font-medium hover:opacity-90 transition-opacity flex items-center justify-center gap-2',
                                }, icon('bolt', 'w-5 h-5'), 'Place Order'),
                            ),
                        ),
                ),
            ),
        );
    }
}

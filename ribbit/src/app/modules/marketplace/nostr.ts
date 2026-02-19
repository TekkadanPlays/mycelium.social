// Nostr state for the marketplace module
// Uses ribbit's local nostr implementation and a dedicated RelayPool
import { RelayPool } from '../../../nostr/pool';
import type { NostrFilter } from '../../../nostr/filter';
import type { NostrEvent } from '../../../nostr/event';
import {
    fetchProfile as ribbitFetchProfile,
    getProfile,
    subscribeProfiles,
    type Profile,
} from '../../store/profiles';

const DEFAULT_RELAYS = [
    'wss://relay.damus.io',
    'wss://nos.lol',
    'wss://relay.nostr.band',
];

export let pool: RelayPool;

// Thin wrapper around ribbit's profile store so marketplace components
// can call profiles.get / profiles.fetch / profiles.subscribe uniformly
export const profiles = {
    get(pubkey: string): Profile | undefined {
        return getProfile(pubkey);
    },
    fetch(pubkey: string) {
        ribbitFetchProfile(pubkey);
    },
    subscribe(fn: () => void): () => void {
        return subscribeProfiles(fn);
    },
};

let _initialized = false;

export function initNostr() {
    if (_initialized) return;
    _initialized = true;
    pool = new RelayPool();
    for (const url of DEFAULT_RELAYS) {
        pool.addRelay(url);
    }
    pool.connectAll().catch(console.error);
}

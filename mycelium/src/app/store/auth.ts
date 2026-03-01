import { hasNip07, getNip07PublicKey } from '../../nostr/nip07';
import { isAndroid, requestPublicKey as nip55RequestPubkey, parseNip55Callback, clearNip55Callback } from '../../nostr/nip55';
import { flushAndResetIngest } from '../api/cache';
import { resetProfiles } from './profiles';
import { resetContacts } from './contacts';
import { resetFeed } from './feed';
import { resetNotifications } from './notifications';
import { resetBootstrap } from './bootstrap';
import { resetRelayList } from './relaylist';
import { cleanupCrawler } from './relay-crawler';
import { getPool } from './relay';

export interface AuthState {
  pubkey: string | null;
  isLoading: boolean;
  error: string | null;
}

type Listener = () => void;

let state: AuthState = {
  pubkey: null,
  isLoading: false,
  error: null,
};

const listeners: Set<Listener> = new Set();

function notify() {
  for (const fn of listeners) fn();
}

export function getAuthState(): AuthState {
  return state;
}

export function subscribeAuth(listener: Listener): () => void {
  listeners.add(listener);
  return () => listeners.delete(listener);
}

export async function login(): Promise<void> {
  // Try NIP-07 first (desktop browser extensions)
  if (hasNip07()) {
    state = { ...state, isLoading: true, error: null };
    notify();
    try {
      const pubkey = await getNip07PublicKey();
      state = { pubkey, isLoading: false, error: null };
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem('ribbit_pubkey', pubkey);
      }
    } catch (err) {
      state = { ...state, isLoading: false, error: String(err) };
    }
    notify();
    return;
  }

  // Try NIP-55 on Android (Amber / external signer via intent)
  if (isAndroid()) {
    // Navigate to nostrsigner: URI — the signer app will handle it
    // and redirect back with the pubkey via the callback URL.
    // We set isLoading so the UI shows a loading state before navigation.
    state = { ...state, isLoading: true, error: null };
    notify();
    nip55RequestPubkey();
    return;
  }

  // No signing method available
  state = { ...state, error: 'No Nostr signer found. Install a NIP-07 extension (desktop) or Amber (Android).' };
  notify();
}

/**
 * Reset all per-user stores. Called on sign-out and before account switch.
 * Flushes pending cache writes, cancels subscriptions, clears in-memory state.
 */
export function resetAllStores(): void {
  // Flush pending write-through events before clearing
  flushAndResetIngest();
  // Cancel active subscriptions and clear per-user state
  resetFeed();
  resetNotifications();
  resetContacts();
  resetProfiles();
  resetBootstrap();
  resetRelayList();
  cleanupCrawler();
  // Clear pool dedup set so stale IDs don't suppress events for the new account
  getPool().clearSeenEvents();
}

export function logout() {
  resetAllStores();
  state = { pubkey: null, isLoading: false, error: null };
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ribbit_pubkey');
  }
  notify();
}

// Restore session from localStorage, then check for NIP-55 callback
export function restoreSession() {
  if (typeof localStorage === 'undefined') return;

  // Check for NIP-55 callback result first (Android signer redirect)
  const nip55 = parseNip55Callback();
  if (nip55 && nip55.action === 'get_public_key' && nip55.result) {
    const pubkey = nip55.result;
    localStorage.setItem('ribbit_pubkey', pubkey);
    state = { pubkey, isLoading: false, error: null };
    clearNip55Callback();
    notify();
    return;
  }

  // Normal session restore from localStorage
  const saved = localStorage.getItem('ribbit_pubkey');
  if (saved) {
    state = { pubkey: saved, isLoading: false, error: null };
    notify();
  }
}

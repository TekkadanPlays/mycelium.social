import { hasNip07, getNip07PublicKey } from '../../nostr/nip07';

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
  if (!hasNip07()) {
    state = { ...state, error: 'No Nostr extension found. Install Alby or nos2x.' };
    notify();
    return;
  }

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
}

export function logout() {
  state = { pubkey: null, isLoading: false, error: null };
  if (typeof localStorage !== 'undefined') {
    localStorage.removeItem('ribbit_pubkey');
  }
  notify();
}

// Restore session from localStorage
export function restoreSession() {
  if (typeof localStorage !== 'undefined') {
    const saved = localStorage.getItem('ribbit_pubkey');
    if (saved) {
      state = { pubkey: saved, isLoading: false, error: null };
      notify();
    }
  }
}

import type { UnsignedEvent } from './event';
import { computeEventId } from './event';

// NIP-55: Android Signer Application
// For web applications, uses the nostrsigner: URI scheme with callback URLs.
// Amber and other NIP-55 signers register this scheme on Android.
//
// Per the NIP-55 spec, the callbackUrl ends with `?event=` and the signer
// appends the result directly after the `=`. We encode the action type in
// the URL path fragment so we can distinguish get_public_key vs sign_event
// on return.

// ---------------------------------------------------------------------------
// Detection
// ---------------------------------------------------------------------------

export function isAndroid(): boolean {
  if (typeof navigator === 'undefined') return false;
  return /android/i.test(navigator.userAgent);
}

// ---------------------------------------------------------------------------
// Callback URL helpers
// ---------------------------------------------------------------------------

function getCallbackUrl(action: string): string {
  // Per NIP-55 spec, the callbackUrl ends with `?event=` and the signer
  // appends the result directly after the `=`.
  // We embed the action in a custom param so we can distinguish on return.
  const base = window.location.origin + window.location.pathname;
  return `${base}?nip55_action=${action}&event=`;
}

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

export function requestPublicKey(): void {
  // NIP-55 spec: callbackUrl is passed UN-encoded as the last parameter
  const callbackUrl = getCallbackUrl('get_public_key');
  window.location.href = `nostrsigner:?compressionType=none&returnType=signature&type=get_public_key&callbackUrl=${callbackUrl}`;
}

export function requestSignEvent(event: UnsignedEvent): void {
  const id = computeEventId(event);
  const eventWithId = { ...event, id };
  const encodedJson = encodeURIComponent(JSON.stringify(eventWithId));
  const callbackUrl = getCallbackUrl('sign_event');
  window.location.href = `nostrsigner:${encodedJson}?compressionType=none&returnType=signature&type=sign_event&callbackUrl=${callbackUrl}`;
}

// ---------------------------------------------------------------------------
// Callback result parsing
// ---------------------------------------------------------------------------

export interface Nip55CallbackResult {
  action: string;
  result: string;
}

/**
 * Parse the NIP-55 callback from the current URL.
 *
 * After Amber processes the request, it redirects back to:
 *   https://ribbit.network/?nip55_action=get_public_key&event=<hex_pubkey>
 *
 * The `event` param contains the result (pubkey for get_public_key,
 * signature for sign_event).
 */
export function parseNip55Callback(): Nip55CallbackResult | null {
  if (typeof window === 'undefined') return null;

  const params = new URLSearchParams(window.location.search);
  const action = params.get('nip55_action');
  const result = params.get('event');
  if (!action || !result) return null;
  return { action, result };
}

export function clearNip55Callback(): void {
  if (typeof window === 'undefined') return;

  const url = new URL(window.location.href);
  url.searchParams.delete('nip55_action');
  url.searchParams.delete('event');
  const cleanUrl = url.pathname + (url.search || '');
  window.history.replaceState({}, '', cleanUrl);
}

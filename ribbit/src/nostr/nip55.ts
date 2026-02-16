import type { UnsignedEvent } from './event';
import { computeEventId } from './event';

// NIP-55: Android Signer Application
// For web applications, uses the nostrsigner: URI scheme with callback URLs.
// Amber and other NIP-55 signers register this scheme on Android.

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
  const base = window.location.origin + window.location.pathname;
  // Use a clean callback — signer appends the result as a query param
  return encodeURIComponent(`${base}?nip55_action=${action}&nip55_result=`);
}

// ---------------------------------------------------------------------------
// Methods
// ---------------------------------------------------------------------------

export function requestPublicKey(): void {
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

export function parseNip55Callback(): Nip55CallbackResult | null {
  if (typeof window === 'undefined') return null;
  const params = new URLSearchParams(window.location.search);
  const action = params.get('nip55_action');
  const result = params.get('nip55_result');
  if (!action || !result) return null;
  return { action, result };
}

export function clearNip55Callback(): void {
  if (typeof window === 'undefined') return;
  // Remove the NIP-55 query params from the URL without reloading
  const url = new URL(window.location.href);
  url.searchParams.delete('nip55_action');
  url.searchParams.delete('nip55_result');
  window.history.replaceState({}, '', url.pathname + url.search);
}

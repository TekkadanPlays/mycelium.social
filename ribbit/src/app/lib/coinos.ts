import { api } from "./api";

// ─── Types ──────────────────────────────────────────────────────────────────

export interface CoinosStatus {
  enabled: boolean;
  healthy: boolean;
  error?: string;
}

export interface CoinosPayment {
  id: string;
  amount: number;
  fee?: number;
  ourfee?: number;
  tip?: number;
  memo?: string;
  hash?: string;
  type: string;
  created: number;
  ref?: string;
  confirmed?: boolean;
  rate?: number;
  currency?: string;
  with?: CoinosUserPublic;
}

export interface CoinosPaymentsResponse {
  count: number;
  payments: CoinosPayment[];
  incoming: Record<string, { sats: number; fiat: string; tips: number; fiatTips: string }>;
  outgoing: Record<string, { sats: number; fiat: string; tips: number; fiatTips: string }>;
}

export interface CoinosUser {
  id: string;
  username: string;
  pubkey?: string;
  npub?: string;
  balance: number;
  locked?: number;
  currency: string;
  display?: string;
  picture?: string;
  banner?: string;
  about?: string;
  email?: string;
  verified?: boolean;
  twofa?: boolean;
  haspin?: boolean;
  tip?: number;
  fiat?: boolean;
  nip5?: boolean;
  language?: string;
  currencies?: string[];
  prompt?: boolean;
  threshold?: number;
  destination?: string;
  autowithdraw?: boolean;
  reserve?: number;
  notify?: boolean;
  admin?: boolean;
  fresh?: boolean;
}

export interface CoinosUserPublic {
  id: string;
  username: string;
  picture?: string;
  pubkey?: string;
  npub?: string;
}

export interface CoinosInvoice {
  id: string;
  hash: string;
  amount: number;
  memo?: string;
  bolt11?: string;
  text?: string;
  tip?: number;
  type?: string;
  rate?: number;
  currency?: string;
  received?: number;
  created?: number;
  uid?: string;
  user?: CoinosUserPublic;
  items?: any[];
}

export interface CoinosAccount {
  id: string;
  name: string;
  type?: string;
  uid: string;
  balance?: number;
}

export interface CoinosContact extends CoinosUserPublic {
  pinned?: boolean;
  trusted?: boolean;
}

export interface CoinosApp {
  pubkey: string;
  name?: string;
  secret?: string;
  nwc?: string;
  max_amount?: number;
  max_fee?: number;
  budget_renewal?: string;
  notify?: boolean;
  spent?: number;
  created?: number;
  uid?: string;
  payments?: CoinosPayment[];
}

export interface CoinosCredits {
  bitcoin: number;
  lightning: number;
  liquid: number;
}

export interface NodeInfo {
  alias?: string;
  block_height?: number;
  pubkey?: string;
  network?: string;
  id?: string;
}

export interface ParsedInvoice {
  alias?: string;
  amount?: number;
  ourfee?: number;
}

// ─── Session helpers ────────────────────────────────────────────────────────

/** Get the CoinOS JWT for the given pubkey (or the stored active pubkey). */
export function getCoinosToken(pubkey?: string): string | null {
  const pk = pubkey || localStorage.getItem("coinos_pubkey");
  if (!pk) return null;
  return localStorage.getItem(`coinos_token:${pk}`);
}

/** Store a CoinOS JWT keyed to a specific pubkey. */
export function setCoinosToken(pubkey: string, token: string) {
  localStorage.setItem(`coinos_token:${pubkey}`, token);
  localStorage.setItem("coinos_pubkey", pubkey);
}

/** Clear the CoinOS wallet session for the active pubkey. */
export function clearWalletSession() {
  const pk = localStorage.getItem("coinos_pubkey");
  if (pk) localStorage.removeItem(`coinos_token:${pk}`);
  localStorage.removeItem("coinos_pubkey");
  localStorage.removeItem("coinos_token");
}

/** Get the currently active NIP-07 pubkey, or null. */
export async function getActivePubkey(): Promise<string | null> {
  try {
    return (window as any).nostr?.getPublicKey() ?? null;
  } catch {
    return null;
  }
}

// ─── Request helper ─────────────────────────────────────────────────────────

async function coinosRequest<T>(path: string, options?: RequestInit): Promise<T> {
  const token = localStorage.getItem("token");
  const coinosToken = getCoinosToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(coinosToken ? { "x-coinos-token": coinosToken } : {}),
  };

  const res = await fetch(`/api/coinos${path}`, { ...options, headers });

  if (!res.ok) {
    const body = await res.json().catch(() => ({ error: "Unknown error" }));
    throw new Error(body.error || `HTTP ${res.status}`);
  }

  return res.json();
}

function post<T>(path: string, body: any): Promise<T> {
  return coinosRequest<T>(path, { method: "POST", body: JSON.stringify(body) });
}

// ─── API client ─────────────────────────────────────────────────────────────

export const coinos = {
  // Health & rates
  status: () => coinosRequest<CoinosStatus>("/status"),
  rates: () => coinosRequest<Record<string, number>>("/rates"),

  // Auth
  challenge: () => coinosRequest<{ challenge: string }>("/challenge"),
  nostrAuth: (body: { challenge: string; event: any }) =>
    post<{ user: CoinosUser; token: string }>("/nostrAuth", body),
  register: (body: { username: string; password: string }) =>
    post<{ user: CoinosUser; token: string }>("/register", body),
  login: (body: { username: string; password: string }) =>
    post<{ user: CoinosUser; token: string }>("/login", body),
  logout: () => { clearWalletSession(); },

  // User
  me: () => coinosRequest<CoinosUser>("/me"),
  updateUser: (body: Partial<CoinosUser> & Record<string, any>) =>
    post<{ user: CoinosUser }>("/user", body),
  lookupUser: (key: string) => coinosRequest<CoinosUserPublic>(`/users/${encodeURIComponent(key)}`),
  credits: () => coinosRequest<CoinosCredits>("/credits"),

  // Payments
  payments: (limit = 10, offset = 0, aid?: string) => {
    const params = new URLSearchParams({ limit: String(limit), offset: String(offset) });
    if (aid) params.set("aid", aid);
    return coinosRequest<CoinosPaymentsResponse>(`/payments?${params}`);
  },
  paymentsLegacy: () => coinosRequest<CoinosPayment[]>("/payments"),
  getPayment: (hash: string) => coinosRequest<CoinosPayment>(`/payments/${encodeURIComponent(hash)}`),
  sendPayment: (body: { amount?: number; hash?: string; payreq?: string; fee?: number; memo?: string }) =>
    post<CoinosPayment>("/payments", body),
  parseInvoice: (payreq: string) => post<ParsedInvoice>("/parse", { payreq }),
  sendInternal: (body: { username: string; amount: number; memo?: string }) =>
    post<CoinosPayment>("/send", body),
  sendToLnAddress: (lnaddress: string, amount: number, fee?: number) =>
    post<CoinosPayment>(`/send/${encodeURIComponent(lnaddress)}/${amount}`, { fee }),

  // Invoices
  createInvoice: (body: { amount: number; memo?: string; type?: string; prompt?: boolean }) =>
    post<CoinosInvoice>("/invoice", { invoice: body }),
  getInvoice: (id: string) => coinosRequest<CoinosInvoice>(`/invoice/${encodeURIComponent(id)}`),
  listInvoices: () => coinosRequest<CoinosInvoice[]>("/invoices"),

  // Accounts (sub-wallets)
  listAccounts: () => coinosRequest<CoinosAccount[]>("/accounts"),
  createAccount: (body: { name: string; type?: string }) =>
    post<CoinosAccount>("/accounts", body),
  getAccount: (id: string) => coinosRequest<CoinosAccount>(`/account/${id}`),
  updateAccount: (id: string, body: { name: string }) =>
    post<CoinosAccount>(`/account/${id}`, body),
  deleteAccount: (id: string) => post<{ ok: boolean }>("/account/delete", { id }),

  // Contacts
  listContacts: (limit?: number) =>
    coinosRequest<CoinosContact[]>(limit ? `/contacts/${limit}` : "/contacts"),
  pinContact: (id: string) => post<{}>("/pins", { id }),
  unpinContact: (id: string) => post<{}>("/pins/delete", { id }),
  listTrusted: () => coinosRequest<string[]>("/trust"),
  trustContact: (id: string) => post<{}>("/trust", { id }),
  untrustContact: (id: string) => post<{}>("/trust/delete", { id }),

  // NWC Apps
  listApps: () => coinosRequest<CoinosApp[]>("/apps"),
  getApp: (pubkey: string) => coinosRequest<CoinosApp>(`/app/${pubkey}`),
  updateApp: (body: Partial<CoinosApp>) => post<{}>("/app", body),
  deleteApp: (pubkey: string) => post<{}>("/apps/delete", { pubkey }),

  // Ecash (Cashu)
  claimEcash: (token: string) => post<{ ok: boolean }>("/claim", { token }),
  mintEcash: (amount: number) => post<{ id: string; token: string }>("/mint", { amount }),
  saveEcash: (token: string) => post<{ id: string }>("/cash", { token }),
  getEcash: (id: string, version = "0") =>
    coinosRequest<{ token: string; status: any }>(`/cash/${id}/${version}`),

  // Node info
  info: () => coinosRequest<NodeInfo>("/info"),

  // Funds (shared wallets)
  getFund: (id: string) => coinosRequest<{ amount: number; authorization?: any; payments: CoinosPayment[] }>(`/fund/${id}`),
  getFundManagers: (name: string) => coinosRequest<CoinosUserPublic[]>(`/fund/${name}/managers`),
  addFundManager: (body: { id: string; username: string }) => post<CoinosUserPublic[]>("/fund/managers", body),
  removeFundManager: (name: string, id: string) => post<CoinosUserPublic[]>(`/fund/${name}/managers/delete`, { id }),
  authorizeFund: (body: { id: string; fiat: number; currency: string; amount: number }) => post<{}>("/authorize", body),
  takeFromFund: (body: { id: string; amount: number; invoice?: string }) => post<CoinosPayment>("/take", body),
};

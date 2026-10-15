/**
 * A stand-in for the JVA backend while the site is tested on demo data.
 *
 * Each call waits a moment (like a network round trip), then reads or writes a
 * small database kept in the browser's localStorage, so new requests,
 * registrations and edits survive a reload. The functions in lib/api/* mirror
 * the real endpoints and response shapes, so reconnecting the backend later
 * means replacing those files and nothing else.
 */
import { seedRequests } from "@/lib/data/demo";
import type { PartnerRequest } from "@/types";

const DB_KEY = "jva-demo-db";

export interface ContactSubmission {
  id: string;
  fullName: string;
  emailAddress: string;
  phoneNumber: string;
  consultationType: string;
  subject: string;
  message: string;
  createdAt: string;
}

export interface Db {
  requests: PartnerRequest[];
  contacts: ContactSubmission[];
  /** Demo requests the member deleted, so they aren't added back on the next load. */
  deletedRequestIds?: string[];
}

/** Thrown for anything the "server" refuses — wrong password, missing record, bad input. */
export class ApiError extends Error {}

/** Turns anything thrown by an API call into a sentence for the user. */
export function errorMessage(caught: unknown, fallback: string): string {
  return caught instanceof ApiError ? caught.message : fallback;
}

function freshDb(): Db {
  return structuredClone({ requests: seedRequests, contacts: [] });
}

function loadDb(): Db {
  if (typeof window === "undefined") return freshDb();
  try {
    const raw = window.localStorage.getItem(DB_KEY);
    if (!raw) return freshDb();
    const db = JSON.parse(raw) as Db;
    // Add demo requests introduced since this browser first saved, unless the member deleted them.
    const known = new Set([...db.requests.map((request) => request._id), ...(db.deletedRequestIds ?? [])]);
    db.requests.push(...structuredClone(seedRequests.filter((request) => !known.has(request._id))));
    // Copy JV premium / negotiable answers onto sample requests saved before those fields existed.
    for (const request of db.requests) {
      const seed = seedRequests.find((candidate) => candidate._id === request._id);
      if (seed?.sharingFormula && request.sharingNegotiable === undefined && request.premium === undefined) {
        request.sharingNegotiable = seed.sharingNegotiable;
        request.premium = seed.premium;
      }
    }
    return db;
  } catch {
    return freshDb();
  }
}

function saveDb(db: Db): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(DB_KEY, JSON.stringify(db));
  } catch {
    // Storage full or blocked: the change lasts until the page reloads.
  }
}

export function wait(min = 350, spread = 450): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, min + Math.random() * spread));
}

/** Waits like a network call, runs `work` against the database and saves any changes. */
export async function simulate<T>(work: (db: Db) => T): Promise<T> {
  await wait();
  const db = loadDb();
  const result = work(db);
  saveDb(db);
  return structuredClone(result);
}

/** Puts every demo record back the way it started. */
export function resetDemoData(): void {
  window.localStorage.removeItem(DB_KEY);
}

export function newId(prefix: string): string {
  return `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;
}

// --- Tokens ----------------------------------------------------------------
// A JWT-shaped string, so the existing expiry check (utils/decodeToken) keeps
// working. It is not signed — it only identifies the demo user to these mocks.

const TOKEN_LIFETIME_S = 7 * 24 * 60 * 60;

function base64Url(value: object): string {
  return btoa(JSON.stringify(value)).replace(/=+$/, "").replace(/\+/g, "-").replace(/\//g, "_");
}

export function issueToken(userId: string, email: string): string {
  const exp = Math.floor(Date.now() / 1000) + TOKEN_LIFETIME_S;
  return `${base64Url({ alg: "none", typ: "JWT" })}.${base64Url({ sub: userId, email, exp })}.demo`;
}

/** The user id inside a token, or an "unauthorised" error like the real API. */
export function userIdFrom(token: string | null | undefined): string {
  try {
    const payload = token!.split(".")[1]!.replace(/-/g, "+").replace(/_/g, "/");
    return (JSON.parse(atob(payload)) as { sub: string }).sub;
  } catch {
    throw new ApiError("Your session has expired. Please log in again.");
  }
}

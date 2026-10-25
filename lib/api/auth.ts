import { API_TIMEOUT_MS, fetchFailure, reportUnauthorized } from "@/lib/api/session";
import type { AuthUser } from "@/types";
import type { ProfileDocuments } from "@/lib/inbox/types";

export interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

export interface ProfileUpdate {
  phoneNumber?: string;
  profile?: Record<string, string>;
  documents?: ProfileDocuments;
}

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function call<T>(path: string, init?: RequestInit, token?: string): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });

  reportUnauthorized(response, Boolean(token));

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong. Please try again.");
  return body as T;
}

/** POST /auth/register */
export function register(input: {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  category: string;
}): Promise<AuthResponse> {
  return call("/auth/register", { method: "POST", body: JSON.stringify(input) });
}

/** POST /auth/login */
export function login(email: string, password: string): Promise<AuthResponse> {
  return call("/auth/login", { method: "POST", body: JSON.stringify({ email, password }) });
}

/** Google login — passes googleEmail to the backend */
export function loginWithGoogle(googleEmail: string): Promise<AuthResponse> {
  return call("/auth/login", { method: "POST", body: JSON.stringify({ googleEmail }) });
}

/** PATCH /user/complete-profile — requires auth token */
export function updateProfile(token: string, changes: ProfileUpdate): Promise<{ status: boolean; message: string }> {
  return call("/user/complete-profile", { method: "PATCH", body: JSON.stringify(changes) }, token);
}

/** POST /auth/forgot-password */
export function sendResetCode(email: string): Promise<{ message: string }> {
  return call("/auth/forgot-password", { method: "POST", body: JSON.stringify({ email }) });
}

/** POST /auth/resend-reset-otp — deletes the old OTP and issues a fresh one */
export function resendResetCode(email: string): Promise<{ message: string }> {
  return call("/auth/resend-reset-otp", { method: "POST", body: JSON.stringify({ email }) });
}

/** POST /auth/verify-reset-otp */
export function verifyResetCode(email: string, otp: string): Promise<{ message: string }> {
  return call("/auth/verify-reset-otp", { method: "POST", body: JSON.stringify({ email, otp }) });
}

/** POST /auth/reset-password */
export function resetPassword(email: string, newPassword: string): Promise<{ message: string }> {
  return call("/auth/reset-password", { method: "POST", body: JSON.stringify({ email, newPassword }) });
}

/** POST /upload — uploads a file to Supabase Storage, returns the public URL */
export async function uploadFile(file: File, token: string): Promise<string> {
  const form = new FormData();
  form.append("file", file);

  const response = await fetch(`${BASE}/upload`, {
    method: "POST",
    headers: { Authorization: `Bearer ${token}` },
    body: form,
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });

  reportUnauthorized(response, Boolean(token));

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Upload failed.");
  return (body as { url: string }).url;
}

const ACCOUNT_STATUSES: ReadonlyArray<MemberAccount["status"]> = ["pending", "active", "suspended"];

/**
 * The server's account status is "pending", "active" or "suspended". Anything
 * else (or nothing) is treated as "pending", so an unexpected value can never
 * show a member as approved. Matches toAccountStatus in the admin dashboard.
 */
function toAccountStatus(status: unknown): MemberAccount["status"] {
  return ACCOUNT_STATUSES.find((known) => known === status) ?? "pending";
}

/**
 * GET /user/me — requires auth token stored in Redux.
 * The server wraps its replies: { "status": true, "user": { ...account } }. That outer
 * "status" only means the request succeeded; the account's own status is inside.
 */
export async function getMyAccount(_userId: string, token?: string): Promise<MemberAccount> {
  const body = await call<Record<string, unknown>>("/user/me", undefined, token);
  const inner = [body.user, body.account, body.data].find((value) => value && typeof value === "object");
  const account = (inner ?? body) as MemberAccount;
  // profileCompleted is a true/false boolean on the server; only a real true counts.
  return { ...account, status: toAccountStatus(account.status), profileCompleted: account.profileCompleted === true };
}

type MemberAccount = import("@/lib/inbox/types").MemberAccount;

/** GET /requests/stats/my */
export function getUserStats(_userId: string, token?: string | null): Promise<{ totalRequest: number; matched: number; availableMatches: number }> {
  return call("/requests/stats/my", undefined, token ?? undefined);
}

export const ROLES = ["Landowner", "Investor", "Buyer"] as const;
export type MemberRole = (typeof ROLES)[number];

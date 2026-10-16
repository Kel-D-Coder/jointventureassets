import { DEMO_OTP } from "@/lib/data/demo";
import { ApiError, issueToken, simulate, wait } from "@/lib/api/mock";
import type { MemberAccount, MemberRole, ProfileDocuments } from "@/lib/inbox/types";
import type { AuthUser } from "@/types";

/**
 * Accounts live in the demo inbox on this site's server (app/api/demo-auth and
 * app/api/demo-inbox), so the admin dashboard sees every sign-up and can
 * approve or suspend it. Request stats below still come from the in-browser mock.
 */

interface AuthResponse {
  message: string;
  user: AuthUser;
  token: string;
}

async function call<T>(url: string, init?: RequestInit): Promise<T> {
  await wait(250, 300);
  const response = await fetch(url, { ...init, headers: { "Content-Type": "application/json" } }).catch(() => {
    throw new ApiError("Couldn't reach the server. Check your connection and try again.");
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new ApiError((body as { message?: string }).message ?? "Something went wrong. Please try again.");
  return body as T;
}

const auth = <T>(body: object) => call<T>("/api/demo-auth", { method: "POST", body: JSON.stringify(body) });

function session(account: MemberAccount, message: string): AuthResponse {
  const { id, fullName, email, role, category } = account;
  return { message, user: { id, fullName, email, role, category }, token: issueToken(id, email) };
}

/** POST /auth/login */
export async function login(email: string, password: string): Promise<AuthResponse> {
  return session(await auth<MemberAccount>({ action: "login", email, password }), "Login successful");
}

/** Stands in for "Continue with Google" + the backend's googleEmail login. */
export async function loginWithGoogle(): Promise<AuthResponse> {
  return session(await auth<MemberAccount>({ action: "google" }), "Login successful");
}

/** POST /auth/register */
export async function register(input: {
  fullName: string;
  email: string;
  phoneNumber: string;
  password: string;
  role: string;
  category: string;
}): Promise<AuthResponse> {
  return session(await auth<MemberAccount>({ action: "register", ...input }), "Registration successful");
}

/** GET /users/{id}: the member's full account, including their profile answers and documents. */
export function getMyAccount(userId: string): Promise<MemberAccount> {
  return call(`/api/demo-inbox/${encodeURIComponent(userId)}`);
}

export interface ProfileUpdate {
  fullName?: string;
  phoneNumber?: string;
  profile?: Record<string, string>;
  documents?: ProfileDocuments;
}

/** PUT /users/profile/{id}: used by "Complete your profile" and the dashboard's profile page. */
export function updateProfile(userId: string, changes: ProfileUpdate): Promise<MemberAccount> {
  return call(`/api/demo-inbox/${encodeURIComponent(userId)}`, {
    method: "PATCH",
    body: JSON.stringify({ ...changes, profileCompleted: true }),
  });
}

/** POST /auth/password/otp */
export async function sendResetCode(email: string): Promise<{ message: string }> {
  await auth({ action: "account-exists", email });
  return { message: `Code sent. In demo mode the code is always ${DEMO_OTP}.` };
}

/** POST /auth/password/otp/verify */
export async function verifyResetCode(_email: string, otp: string): Promise<{ message: string }> {
  await wait();
  if (otp !== DEMO_OTP) throw new ApiError(`That code is wrong. In demo mode it is ${DEMO_OTP}.`);
  return { message: "Code verified" };
}

/** PUT /auth/password/reset */
export function resetPassword(email: string, newPassword: string): Promise<{ message: string }> {
  return auth({ action: "reset-password", email, password: newPassword });
}

/** GET /users/{id} stats: the numbers on the member dashboard. */
export function getUserStats(userId: string): Promise<{ totalRequest: number; matched: number; availableMatches: number }> {
  return simulate((db) => {
    const mine = db.requests.filter((request) => request.userId === userId);
    return {
      totalRequest: mine.length,
      matched: mine.filter((request) => request.status === "accepted").length,
      availableMatches: db.requests.filter((request) => request.userId !== userId && request.status === "accepted").length,
    };
  });
}

export const ROLES: MemberRole[] = ["Landowner", "Investor", "Buyer"];

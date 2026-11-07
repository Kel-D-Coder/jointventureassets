import { API_TIMEOUT_MS, fetchFailure, reportUnauthorized } from "@/lib/api/session";
const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

export interface ContactInput {
  fullName: string;
  emailAddress: string;
  phoneNumber?: string;
  consultationType?: string;
  subject: string;
  message: string;
}

/** POST /contact — no auth required; token attached if available to link the message to a member. */
export async function sendContactMessage(
  input: ContactInput,
  token?: string | null,
): Promise<{ message: string }> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;

  const response = await fetch(`${BASE}/contact`, {
    method: "POST",
    headers,
    body: JSON.stringify(input),
    signal: AbortSignal.timeout(API_TIMEOUT_MS),
  }).catch((caught: unknown) => {
    throw fetchFailure(caught);
  });

  reportUnauthorized(response, Boolean(token));

  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong. Please try again.");
  return body as { message: string };
}

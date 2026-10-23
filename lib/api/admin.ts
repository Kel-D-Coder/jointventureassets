import { API_TIMEOUT_MS, fetchFailure, reportUnauthorized } from "@/lib/api/session";
import type { ListingSubmission, SubmissionStatus } from "@/lib/inbox/types";

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
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong.");
  return body as T;
}

export async function getAdminSubmissions(
  token: string,
  statusFilter?: string,
): Promise<ListingSubmission[]> {
  const qs = statusFilter ? `?status=${statusFilter}` : "";
  const data = await call<{ submissions: ListingSubmission[] }>(`/admin/listings${qs}`, {}, token);
  return data.submissions;
}

export async function updateSubmissionStatus(
  token: string,
  id: string,
  status: SubmissionStatus,
  reviewNote?: string,
): Promise<ListingSubmission> {
  const data = await call<{ submission: ListingSubmission }>(
    `/admin/listings/${id}/status`,
    { method: "PATCH", body: JSON.stringify({ status, reviewNote }) },
    token,
  );
  return data.submission;
}

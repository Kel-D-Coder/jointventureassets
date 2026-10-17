import { uploadFile } from "@/lib/api/auth";
import type { PartnerRequest, RequestType } from "@/types";

export type NewRequest = Omit<PartnerRequest, "_id" | "userId" | "status" | "createdAt" | "updatedAt" | "documents"> & {
  files: File[];
};

const BASE = process.env.NEXT_PUBLIC_SERVER_URL ?? "";

async function call<T>(path: string, init?: RequestInit, token?: string | null): Promise<T> {
  const headers: Record<string, string> = { "Content-Type": "application/json" };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  const response = await fetch(`${BASE}${path}`, {
    ...init,
    headers,
    signal: AbortSignal.timeout(15000),
  }).catch(() => {
    throw new Error("Couldn't reach the server. Check your connection and try again.");
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error((body as { message?: string }).message ?? "Something went wrong.");
  return body as T;
}

/** POST /requests — uploads files first, then submits the request. */
export async function createRequest(token: string | null, input: NewRequest): Promise<PartnerRequest> {
  const { files, ...fields } = input;

  const documents: string[] = [];
  for (const file of files) {
    if (token) {
      const url = await uploadFile(file, token);
      documents.push(url);
    }
  }

  const data = await call<{ request: PartnerRequest }>("/requests", {
    method: "POST",
    body: JSON.stringify({ ...fields, documents }),
  }, token);
  return data.request;
}

/** GET /requests/my */
export async function getMyRequests(token: string | null): Promise<PartnerRequest[]> {
  const data = await call<{ requests: PartnerRequest[] }>("/requests/my", undefined, token);
  return data.requests;
}

/** GET /requests/{id} */
export async function getRequest(token: string | null, id: string): Promise<PartnerRequest> {
  const data = await call<{ request: PartnerRequest }>(`/requests/${id}`, undefined, token);
  return data.request;
}

/** DELETE /requests/{id} */
export async function deleteRequest(token: string | null, id: string): Promise<{ message: string }> {
  return call(`/requests/${id}`, { method: "DELETE" }, token);
}

/** GET /requests/search?requestType= — accepted requests, excluding the current user's own */
export async function searchRequests(token: string | null, requestType?: RequestType): Promise<PartnerRequest[]> {
  const qs = requestType ? `?requestType=${encodeURIComponent(requestType)}` : "";
  const data = await call<{ requests: PartnerRequest[] }>(`/requests/search${qs}`, undefined, token);
  return data.requests;
}

/** GET /requests/accepted?requestType= — all accepted requests including the current user's own */
export async function getAcceptedRequests(token: string | null, requestType?: RequestType): Promise<PartnerRequest[]> {
  const qs = requestType ? `?requestType=${encodeURIComponent(requestType)}` : "";
  const data = await call<{ requests: PartnerRequest[] }>(`/requests/accepted${qs}`, undefined, token);
  return data.requests;
}

export type RequestUpdate = Partial<Omit<PartnerRequest, "_id" | "userId" | "status" | "createdAt" | "updatedAt" | "documents">> & {
  documents?: string[];
  newFiles?: File[];
};

/** PUT /requests/{id} — uploads any new files first, then saves all changed fields. */
export async function updateRequest(
  token: string | null,
  id: string,
  changes: RequestUpdate,
): Promise<PartnerRequest> {
  const { newFiles = [], ...fields } = changes;

  const uploadedUrls: string[] = [];
  for (const file of newFiles) {
    if (token) {
      const url = await uploadFile(file, token);
      uploadedUrls.push(url);
    }
  }

  const payload = {
    ...fields,
    ...(uploadedUrls.length > 0 ? { documents: [...(fields.documents ?? []), ...uploadedUrls] } : {}),
  };

  const data = await call<{ request: PartnerRequest }>(`/requests/${id}`, {
    method: "PUT",
    body: JSON.stringify(payload),
  }, token);
  return data.request;
}

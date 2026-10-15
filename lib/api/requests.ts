import { ApiError, newId, simulate, userIdFrom, type Db } from "@/lib/api/mock";
import type { PartnerRequest, RequestType } from "@/types";

export type NewRequest = Omit<PartnerRequest, "_id" | "userId" | "status" | "createdAt" | "updatedAt" | "documents"> & {
  files: File[];
};

function findOwn(db: Db, token: string | null, id: string): PartnerRequest {
  const userId = userIdFrom(token);
  const request = db.requests.find((candidate) => candidate._id === id);
  if (!request) throw new ApiError("This request no longer exists.");
  if (request.userId !== userId) throw new ApiError("You can only manage your own requests.");
  return request;
}

const byNewest = (a: PartnerRequest, b: PartnerRequest) => b.createdAt.localeCompare(a.createdAt);

/** GET /request/getUserRequests */
export function getMyRequests(token: string | null): Promise<PartnerRequest[]> {
  return simulate((db) => {
    const userId = userIdFrom(token);
    return db.requests.filter((request) => request.userId === userId).sort(byNewest);
  });
}

/** GET /request/user/{id} */
export function getRequest(token: string | null, id: string): Promise<PartnerRequest> {
  return simulate((db) => findOwn(db, token, id));
}

/**
 * POST /request/create. Uploaded files can't be stored in demo mode, so each
 * one is swapped for a sample photo — the request still shows "documents".
 */
export function createRequest(token: string | null, input: NewRequest): Promise<PartnerRequest> {
  const { files, ...fields } = input;
  const samples = ["/placeholders/estate-01.jpg", "/placeholders/tower-02.jpg", "/placeholders/estate-02.jpg"];
  return simulate((db) => {
    const now = new Date().toISOString();
    const request: PartnerRequest = {
      ...fields,
      _id: newId("req"),
      userId: userIdFrom(token),
      status: "pending",
      documents: files.map((_, index) => samples[index % samples.length]!),
      createdAt: now,
      updatedAt: now,
    };
    db.requests.push(request);
    return request;
  });
}

/** PUT /request/update */
export function updateRequest(
  token: string | null,
  id: string,
  changes: Pick<PartnerRequest, "title" | "description">,
): Promise<PartnerRequest> {
  return simulate((db) => {
    const request = findOwn(db, token, id);
    Object.assign(request, changes, { updatedAt: new Date().toISOString() });
    return request;
  });
}

/** DELETE /request/delete */
export function deleteRequest(token: string | null, id: string): Promise<{ message: string }> {
  return simulate((db) => {
    findOwn(db, token, id);
    db.requests = db.requests.filter((request) => request._id !== id);
    db.deletedRequestIds = [...(db.deletedRequestIds ?? []), id];
    return { message: "Request deleted" };
  });
}

/** GET /request/search?requestType= — accepted requests from other members. */
export function searchRequests(token: string | null, requestType?: RequestType): Promise<PartnerRequest[]> {
  return simulate((db) => {
    userIdFrom(token);
    return db.requests
      .filter((request) => request.status === "accepted" && (!requestType || request.requestType === requestType))
      .sort(byNewest);
  });
}

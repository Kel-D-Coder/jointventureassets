/** Thrown for anything the server refuses: wrong password, missing record, bad input. */
export class ApiError extends Error {}

/** Turns anything thrown by an API call into a sentence for the user. */
export function errorMessage(caught: unknown, fallback: string): string {
  return caught instanceof Error ? caught.message : fallback;
}

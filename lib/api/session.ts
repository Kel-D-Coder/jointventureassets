/**
 * Shared by every call to the JVA server: how long to wait, and what to do
 * when the server says the member's token is no longer valid.
 */

/** Render's free tier sleeps when idle and can take most of a minute to wake up. */
export const API_TIMEOUT_MS = 60_000;

export const TIMEOUT_MESSAGE = "The server is taking a while to respond. It may be waking up; please try again in a moment.";

/** Fired on window when a signed-in request comes back 401; SessionWatcher signs the member out. */
export const SESSION_EXPIRED_EVENT = "jva:session-expired";

/** Fired on window when the server says the member's account is suspended; SessionWatcher signs them out. */
export const ACCOUNT_SUSPENDED_EVENT = "jva:account-suspended";

/**
 * Call with every response to a request that sent a token. A 401 means the session ended; a 403
 * with accountStatus "suspended" means an admin suspended the account while the member was signed in.
 */
export function reportUnauthorized(response: Response, sentToken: boolean): void {
  if (!sentToken || typeof window === "undefined") return;
  if (response.status === 401) {
    window.dispatchEvent(new Event(SESSION_EXPIRED_EVENT));
  } else if (response.status === 403) {
    // Read a copy, so the caller can still read the body for its own error message.
    response
      .clone()
      .json()
      .then((body: { accountStatus?: string }) => {
        if (body?.accountStatus === "suspended") window.dispatchEvent(new Event(ACCOUNT_SUSPENDED_EVENT));
      })
      .catch(() => {});
  }
}

/** The error to show when fetch itself fails: timed out, or the server couldn't be reached. */
export function fetchFailure(caught: unknown): Error {
  return caught instanceof DOMException && caught.name === "TimeoutError"
    ? new Error(TIMEOUT_MESSAGE)
    : new Error("Couldn't reach the server. Check your connection and try again.");
}

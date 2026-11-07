import { jwtDecode } from "jwt-decode";

interface DecodedToken {
  exp?: number;
  iat?: number;
}

/** When the token expires, in epoch milliseconds; null if it has no expiry or can't be read. */
export const tokenExpiresAt = (token: string): number | null => {
  try {
    const { exp } = jwtDecode<DecodedToken>(token);
    return typeof exp === "number" ? exp * 1000 : null;
  } catch {
    return null;
  }
};

/**
 * True once the token's expiry time has passed. A token without an expiry is
 * treated as valid; if the server rejects it, SessionWatcher signs the member out.
 */
export const isTokenExpired = (token: string) => {
  const expiresAt = tokenExpiresAt(token);
  return expiresAt !== null && Date.now() >= expiresAt;
};

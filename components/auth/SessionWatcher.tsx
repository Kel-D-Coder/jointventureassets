"use client";

import { useCallback, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAppDispatch, useAppSelector } from "@/hooks/hooks";
import { logout } from "@/store/authSlice";
import { SESSION_EXPIRED_EVENT } from "@/lib/api/session";
import { tokenExpiresAt } from "@/utils/decodeToken";

/**
 * Signs the member out and sends them to the login page when their session ends:
 * when the token's expiry time passes (even mid-visit), or when the server
 * rejects the token. After logging in again they return to the page they were on.
 */
export function SessionWatcher() {
  const token = useAppSelector((state) => state.auth.token);
  const dispatch = useAppDispatch();
  const router = useRouter();
  const pathname = usePathname();

  const expire = useCallback(() => {
    dispatch(logout());
    const back = pathname && pathname !== "/login" ? `&next=${encodeURIComponent(pathname)}` : "";
    router.replace(`/login?expired=1${back}`);
  }, [dispatch, router, pathname]);

  // The token's own expiry time: now, or as soon as it passes.
  useEffect(() => {
    if (!token) return;
    const expiresAt = tokenExpiresAt(token);
    if (expiresAt === null) return;
    const check = () => {
      if (Date.now() >= expiresAt) expire();
    };
    check();
    // Timers longer than ~24 days overflow; the focus check below covers those.
    const timer = window.setTimeout(check, Math.min(Math.max(expiresAt - Date.now(), 0), 2_147_000_000));
    // A sleeping laptop or background tab can delay timers, so check again on return.
    window.addEventListener("focus", check);
    document.addEventListener("visibilitychange", check);
    return () => {
      window.clearTimeout(timer);
      window.removeEventListener("focus", check);
      document.removeEventListener("visibilitychange", check);
    };
  }, [token, expire]);

  // The server said the token is no longer valid.
  useEffect(() => {
    if (!token) return;
    window.addEventListener(SESSION_EXPIRED_EVENT, expire);
    return () => window.removeEventListener(SESSION_EXPIRED_EVENT, expire);
  }, [token, expire]);

  return null;
}

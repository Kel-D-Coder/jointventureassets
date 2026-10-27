"use client";

import { useEffect } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { recordListingView } from "@/lib/api/listings";

/**
 * Counts a visit to a listing page (the login is restored before this renders):
 *  - a signed-in member counts once per listing, ever: opening it again, in any tab, adds nothing;
 *  - a visitor who isn't signed in counts once per listing per browser tab session.
 * Remembered in this browser only, so the same member on another device or after clearing site
 * data counts again; the server can enforce "once per member" across devices.
 */
export function RecordListingView({ listingId }: { listingId: string }) {
  const { token, user } = useAppSelector((state) => state.auth);
  const userId = token ? user?.id : undefined;

  useEffect(() => {
    try {
      const storage = userId ? localStorage : sessionStorage;
      const key = userId ? `jva-viewed:${userId}:${listingId}` : `jva-viewed-${listingId}`;
      if (storage.getItem(key)) return;
      storage.setItem(key, "1");
    } catch {
      // Storage blocked: count the visit anyway.
    }
    void recordListingView(listingId, token);
    // Once per page visit; the login doesn't change while the page is open.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [listingId]);

  return null;
}

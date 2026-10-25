"use client";

import { useCallback, useEffect, useState } from "react";
import { useAppSelector } from "@/hooks/hooks";
import { getMyAccount } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import type { MemberAccount } from "@/lib/inbox/types";

/** The signed-in member's account from GET /user/me, for checking approval before letting them post. */
export function useMyAccount() {
  const { user, token } = useAppSelector((state) => state.auth);
  const [account, setAccount] = useState<MemberAccount | null>(null);
  const [loading, setLoading] = useState(Boolean(token));
  const [error, setError] = useState("");

  const load = useCallback(() => {
    if (!user || !token) {
      setAccount(null);
      setLoading(false);
      return;
    }
    setLoading(true);
    setError("");
    getMyAccount(user.id, token)
      .then((loaded) => {
        // TEMP: shows what the approval check sees and what it decides.
        console.log("[approval check] GET /user/me account:", loaded);
        console.log("[approval check] status:", loaded.status, "| profileCompleted:", loaded.profileCompleted);
        console.log(
          "[approval check] decision:",
          loaded.status === "active"
            ? "APPROVED: the form is shown"
            : loaded.status === "suspended"
              ? "BLOCKED: account suspended"
              : !loaded.profileCompleted
                ? "BLOCKED: pending, profile not finished"
                : "BLOCKED: pending, awaiting approval",
        );
        setAccount(loaded);
      })
      .catch((caught) => {
        console.log("[approval check] failed:", caught);
        setError(errorMessage(caught, "Couldn't check your account. Please try again."));
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  useEffect(load, [load]);

  return { account, loading, error, reload: load, approved: account?.status === "active" };
}

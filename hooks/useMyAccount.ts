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
        setAccount(loaded);
      })
      .catch((caught) => {
        setError(errorMessage(caught, "Couldn't check your account. Please try again."));
      })
      .finally(() => setLoading(false));
  }, [user, token]);

  useEffect(load, [load]);

  return { account, loading, error, reload: load, approved: account?.status === "active" };
}

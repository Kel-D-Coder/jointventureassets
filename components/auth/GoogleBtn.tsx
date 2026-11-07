"use client";

import { useState } from "react";
import Image from "next/image";
import toast from "react-hot-toast";
import googleLogo from "@/assets/google.svg";
import { errorMessage } from "@/lib/api/errors";
import { startGoogleSignIn } from "@/lib/supabase";

/**
 * "Continue with Google", through Supabase Auth. The person goes to Google and comes back to
 * /auth/callback, which finishes signing in. On the sign-up page the chosen role and category
 * travel along so the server can create the account.
 */
export function GoogleButton({ role, category, redirectTo }: { role?: string; category?: string; redirectTo?: string }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    setLoading(true);
    try {
      await startGoogleSignIn({ role, category, next: redirectTo });
      // The browser is now leaving for Google; keep the button busy.
    } catch (caught) {
      toast.error(errorMessage(caught, "Couldn't open Google sign-in. Please try again."));
      setLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-gray-400 disabled:opacity-60"
    >
      <Image src={googleLogo} alt="" className="h-5 w-5" />
      {loading ? "Opening Google…" : "Continue with Google"}
    </button>
  );
}

"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/form";
import { continueWithGoogle } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { finishGoogleSignIn } from "@/lib/supabase";
import { setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

/** Finishes "Continue with Google": Supabase's code → Supabase token → JVA session. */
export default function GoogleCallback() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  // The one-time code can only be used once, so don't run twice (React dev mode runs effects twice).
  const started = useRef(false);

  const role = params.get("role") ?? undefined;
  const category = params.get("category") ?? undefined;
  const next = params.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";

  useEffect(() => {
    if (started.current) return;
    started.current = true;

    const code = params.get("code");
    if (!code) {
      // Cancelled on Google's page, or Supabase sent back an error.
      setError(params.get("error_description") ?? "Google sign-in was cancelled.");
      return;
    }

    (async () => {
      try {
        const accessToken = await finishGoogleSignIn(code);
        const response = await continueWithGoogle({ accessToken, role, category });
        dispatch(setCredentials({ user: response.user, token: response.token }));
        if (response.isNewUser) {
          const r = response.user.role || role || "";
          const c = response.user.category || category || "";
          router.replace(`/complete-profile?role=${encodeURIComponent(r)}&category=${encodeURIComponent(c)}`);
        } else {
          router.replace(destination);
        }
      } catch (caught) {
        setError(errorMessage(caught, "Couldn't sign in with Google. Please try again."));
      }
    })();
    // Runs once, on arrival from Google.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <AuthShell eyebrow="Google sign-in" title={error ? "Couldn't sign you in" : "Signing you in…"} hideBack>
      {error ? (
        <div className="space-y-4">
          <Alert tone="error">{error}</Alert>
          <div className="flex flex-col gap-2 text-center text-sm">
            <Link href={role ? `/register?role=${encodeURIComponent(role)}` : "/login"} className="font-semibold text-gold-deep hover:underline">
              {role ? "Back to sign-up" : "Back to log in"}
            </Link>
            {!role ? (
              <Link href="/register" className="text-muted hover:text-ink">
                New here? Create an account
              </Link>
            ) : null}
          </div>
        </div>
      ) : (
        <p className="text-center text-sm text-muted">One moment while we finish signing you in with Google.</p>
      )}
    </AuthShell>
  );
}

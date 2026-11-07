"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert } from "@/components/ui/form";
import { loginWithGoogle, register, type AuthResponse } from "@/lib/api/auth";
import { ApiError, errorMessage } from "@/lib/api/errors";
import { finishGoogleSignIn } from "@/lib/supabase";
import { setCredentials } from "@/store/authSlice";
import type { AppDispatch } from "@/store/store";

/**
 * A long random password for accounts made with Google: the server's sign-up needs one, but the
 * person never uses it. They sign in with Google (or can set a password with "Forgot password").
 */
function randomPassword(): string {
  const bytes = crypto.getRandomValues(new Uint8Array(24));
  return `Gg1!${Array.from(bytes, (byte) => byte.toString(36).padStart(2, "0")).join("")}`;
}

/**
 * Signs in with the Google email (POST /auth/login, googleEmail). No account yet: on the sign-up
 * page (role chosen) one is created first; on the login page they're asked to sign up.
 */
async function signInOrSignUp(account: { email: string; fullName: string }, role?: string, category?: string): Promise<{ response: AuthResponse; isNew: boolean }> {
  try {
    return { response: await loginWithGoogle(account.email), isNew: false };
  } catch (caught) {
    if (!(caught instanceof ApiError && caught.status === 404)) throw caught;
    if (!role) throw new Error(`There's no account for ${account.email} yet. Create an account first, then you can continue with Google.`);
    const password = randomPassword();
    await register({ fullName: account.fullName, email: account.email, password, confirmPassword: password, role, category: category ?? "" });
    // Sign in the same way as every later visit, so the session is a Google one.
    return { response: await loginWithGoogle(account.email), isNew: true };
  }
}

/** Finishes "Continue with Google": Supabase's code → the Google email → JVA session. */
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
        const account = await finishGoogleSignIn(code);
        const { response, isNew } = await signInOrSignUp(account, role, category);
        dispatch(setCredentials({ user: response.user, token: response.token }));
        if (isNew) {
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

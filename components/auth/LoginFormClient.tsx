"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useDispatch } from "react-redux";
import { FiArrowRight } from "react-icons/fi";
import { login } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { setCredentials } from "@/store/authSlice";
import { AppDispatch } from "@/store/store";
import { AuthShell } from "@/components/auth/AuthShell";
import { GoogleButton } from "@/components/auth/GoogleBtn";
import { Alert, Field, PasswordInput, SubmitButton, inputClass } from "@/components/ui/form";
import { CONTACT_EMAIL } from "@/lib/site";

export default function LoginFormClient() {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const params = useSearchParams();
  const expired = params.get("expired") === "1";
  // Signed out because an admin suspended the account.
  const suspended = params.get("suspended") === "1";
  // Back to the page they were on when the session ended; only paths on this site.
  const next = params.get("next");
  const destination = next && next.startsWith("/") && !next.startsWith("//") ? next : "/dashboard";
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      const response = await login(formData.email, formData.password);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      router.push(destination);
    } catch (error: unknown) {
      setError(errorMessage(error, "Something went wrong. Please try again."));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell
      eyebrow="Welcome back"
      title="Log in to your account"
      intro="Manage your requests, track matches and pick up where you left off."
      footer={
        <>
          New to Joint Venture Assets?{" "}
          <Link href="/register" className="font-semibold text-gold-deep hover:underline">
            Create an account
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email address" htmlFor="email">
          <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} className={inputClass} required />
        </Field>

        <Field
          label={
            <span className="flex items-center justify-between">
              Password
              <Link href="/forgot-password" className="text-xs font-semibold text-gold-deep hover:underline">
                Forgot password?
              </Link>
            </span>
          }
          htmlFor="password"
        >
          <PasswordInput id="password" name="password" autoComplete="current-password" value={formData.password} onChange={handleChange} required />
        </Field>

        {suspended && !error ? (
          <Alert tone="error">
            Your account has been suspended, so you&apos;ve been signed out. Please contact{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="font-semibold underline">
              {CONTACT_EMAIL}
            </a>{" "}
            to resolve it.
          </Alert>
        ) : null}
        {expired && !suspended && !error ? <Alert tone="info">Your session has expired. Please log in again.</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        <SubmitButton loading={loading} loadingText="Logging in…">
          Log in <FiArrowRight aria-hidden="true" />
        </SubmitButton>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs font-semibold tracking-wider text-muted uppercase">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleButton />
    </AuthShell>
  );
}

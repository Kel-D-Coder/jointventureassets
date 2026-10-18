"use client";

import React, { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight, FiCheckCircle } from "react-icons/fi";
import { resetPassword } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, Field, PasswordInput, SubmitButton } from "@/components/ui/form";

const MIN_PASSWORD = 8;

function ResetPasswordContent() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < MIN_PASSWORD) {
      setError(`Your password needs at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (password !== confirmPassword) {
      setError("The two passwords don't match.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await resetPassword(email, password);
      setSuccess(true);
      setTimeout(() => router.push("/login"), 3000);
    } catch (error: unknown) {
      setError(errorMessage(error, "Failed to reset password. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <AuthShell eyebrow="All done" title="Password updated" intro="You can now log in with your new password. Taking you there now…">
        <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
          <FiCheckCircle aria-hidden="true" className="mx-auto h-10 w-10 text-green-700" />
          <Link href="/login" className="mt-4 inline-flex items-center gap-2 font-semibold text-ink hover:underline">
            Go to log in <FiArrowRight aria-hidden="true" />
          </Link>
        </div>
      </AuthShell>
    );
  }

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Choose a new password"
      intro={email ? <>For <strong className="text-ink">{email}</strong></> : undefined}
      back={{ href: "/login", label: "Back to log in" }}
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="New password" htmlFor="password" required hint={`At least ${MIN_PASSWORD} characters.`}>
          <PasswordInput id="password" autoComplete="new-password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </Field>
        <Field
          label="Confirm new password"
          htmlFor="confirmPassword"
          required
          error={confirmPassword && password !== confirmPassword ? "The passwords don't match yet." : undefined}
        >
          <PasswordInput id="confirmPassword" autoComplete="new-password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} required />
        </Field>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <SubmitButton loading={loading} loadingText="Saving…">
          Update password <FiArrowRight aria-hidden="true" />
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export default function ResetPassword() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-ivory" />}>
      <ResetPasswordContent />
    </Suspense>
  );
}

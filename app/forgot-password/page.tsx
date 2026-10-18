"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { FiArrowRight, FiMail } from "react-icons/fi";
import { sendResetCode } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form";

export default function ForgotPassword() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      setError(null);
      await sendResetCode(email);
      router.push(`/forgot-password/verify-otp?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      setError(errorMessage(error, "Something went wrong. Please try again."));
      setLoading(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Forgotten your password?"
      intro="Enter the email you registered with and we'll send you a 6-digit code to reset it."
      back={{ href: "/login", label: "Back to log in" }}
      footer={
        <>
          Remembered it?{" "}
          <Link href="/login" className="font-semibold text-gold-deep hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label="Email address" htmlFor="email">
          <div className="relative">
            <FiMail aria-hidden="true" className="pointer-events-none absolute top-1/2 left-4 -translate-y-1/2 text-muted" />
            <input
              id="email"
              type="email"
              autoComplete="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`${inputClass} pl-11`}
              placeholder="you@example.com"
            />
          </div>
        </Field>
        {error ? <Alert tone="error">{error}</Alert> : null}
        <SubmitButton loading={loading} loadingText="Sending code…">
          Send reset code <FiArrowRight aria-hidden="true" />
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

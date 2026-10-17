"use client";

import React, { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { FiArrowRight } from "react-icons/fi";
import { resendResetCode, verifyResetCode } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/mock";
import { AuthShell } from "@/components/auth/AuthShell";
import { Alert, SubmitButton } from "@/components/ui/form";

const LENGTH = 6;
const RESEND_COOLDOWN = 60;

function VerifyOtpContent() {
  const router = useRouter();
  const email = useSearchParams().get("email") || "";
  const [otp, setOtp] = useState<string[]>(Array(LENGTH).fill(""));
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [cooldown, setCooldown] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const inputs = useRef<Array<HTMLInputElement | null>>([]);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const startCooldown = () => {
    setCooldown(RESEND_COOLDOWN);
    timerRef.current = setInterval(() => {
      setCooldown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const code = otp.join("");

  const handleChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, "").slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    if (digit && index < LENGTH - 1) inputs.current[index + 1]?.focus();
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) inputs.current[index - 1]?.focus();
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const pasted = e.clipboardData.getData("text/plain").replace(/\D/g, "").slice(0, LENGTH);
    if (!pasted) return;
    e.preventDefault();
    setOtp(Array.from({ length: LENGTH }, (_, i) => pasted[i] ?? ""));
    inputs.current[Math.min(pasted.length, LENGTH - 1)]?.focus();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (code.length !== LENGTH) {
      setError("Enter all 6 digits of the code.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      await verifyResetCode(email, code);
      router.push(`/reset-password?email=${encodeURIComponent(email)}`);
    } catch (err: unknown) {
      setError(errorMessage(err, "Something went wrong. Please try again."));
      setLoading(false);
    }
  };

  const resend = async () => {
    try {
      setResending(true);
      setError(null);
      setInfo(null);
      const response = await resendResetCode(email);
      setInfo(response.message);
      setOtp(Array(LENGTH).fill(""));
      inputs.current[0]?.focus();
      startCooldown();
    } catch (err: unknown) {
      setError(errorMessage(err, "Couldn't resend the code. Please try again."));
    } finally {
      setResending(false);
    }
  };

  return (
    <AuthShell
      eyebrow="Reset password"
      title="Enter your code"
      intro={
        <>
          We sent a 6-digit code to <strong className="text-ink">{email || "your email"}</strong>.
        </>
      }
      back={{ href: "/forgot-password", label: "Use a different email" }}
      footer={
        <>
          Didn&apos;t get it?{" "}
          {cooldown > 0 ? (
            <span className="text-muted">Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={resend}
              disabled={resending || !email}
              className="font-semibold text-gold-deep hover:underline disabled:opacity-50"
            >
              {resending ? "Sending…" : "Send a new code"}
            </button>
          )}
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <fieldset>
          <legend className="sr-only">6-digit code</legend>
          <div className="flex justify-between gap-2 sm:gap-3">
            {otp.map((digit, index) => (
              <input
                key={index}
                ref={(element) => { inputs.current[index] = element; }}
                type="text"
                inputMode="numeric"
                autoComplete={index === 0 ? "one-time-code" : "off"}
                maxLength={1}
                value={digit}
                aria-label={`Digit ${index + 1}`}
                onChange={(e) => handleChange(index, e.target.value)}
                onKeyDown={(e) => handleKeyDown(index, e)}
                onPaste={handlePaste}
                autoFocus={index === 0}
                disabled={loading}
                className="h-14 w-full rounded-xl border border-line bg-white text-center font-display text-2xl text-ink focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none sm:h-16"
              />
            ))}
          </div>
        </fieldset>

        {info ? <Alert tone="success">{info}</Alert> : null}
        {error ? <Alert tone="error">{error}</Alert> : null}

        <SubmitButton loading={loading} loadingText="Checking…" disabled={code.length !== LENGTH}>
          Verify code <FiArrowRight aria-hidden="true" />
        </SubmitButton>
      </form>
    </AuthShell>
  );
}

export default function VerifyOtp() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-ivory" />}>
      <VerifyOtpContent />
    </Suspense>
  );
}

"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import { FiArrowRight } from "react-icons/fi";
import { register } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/mock";
import { AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/authSlice";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSteps } from "@/components/auth/SignupSteps";
import { GoogleButton } from "@/components/auth/GoogleBtn";
import { Alert, Field, PasswordInput, SubmitButton, inputClass } from "@/components/ui/form";

interface RegisterFormProps {
  role?: string;
  category?: string;
}

const MIN_PASSWORD = 8;

export default function RegisterForm({ role = "Buyer", category = "" }: RegisterFormProps) {
  const router = useRouter();
  const dispatch = useDispatch<AppDispatch>();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phoneNumber: "",
    password: "",
    confirmPassword: "",
    role,
    category,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const passwordsMismatch = Boolean(formData.confirmPassword) && formData.password !== formData.confirmPassword;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password.length < MIN_PASSWORD) {
      setError(`Your password needs at least ${MIN_PASSWORD} characters.`);
      return;
    }
    if (passwordsMismatch) {
      setError("The two passwords don't match.");
      return;
    }
    try {
      setLoading(true);
      setError(null);
      const response = await register(formData);
      dispatch(setCredentials({ user: response.user, token: response.token }));
      // Next: complete the profile for this role and category.
      router.push(`/complete-profile?role=${encodeURIComponent(formData.role)}&category=${encodeURIComponent(formData.category)}`);
    } catch (error: unknown) {
      setError(errorMessage(error, "Something went wrong. Please try again later."));
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <AuthShell
      eyebrow={`${role}${category ? ` · ${category}` : ""}`}
      title="Create your account"
      intro="Takes two minutes. Your details are only shared with partners you choose to work with."
      back={{ href: `/register?role=${encodeURIComponent(role)}`, label: "Change category" }}
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gold-deep hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupSteps current={2} />
      <form onSubmit={handleSubmit} className="space-y-5">
        <Field label={category && category !== "Individual" ? "Contact person's full name" : "Full name"} htmlFor="fullName" required>
          <input type="text" id="fullName" name="fullName" autoComplete="name" value={formData.fullName} onChange={handleChange} className={inputClass} required />
        </Field>
        <Field label="Email address" htmlFor="email" required>
          <input type="email" id="email" name="email" autoComplete="email" value={formData.email} onChange={handleChange} className={inputClass} required />
        </Field>
        <Field label="Phone number" htmlFor="phoneNumber" required hint="We'll call you about matches.">
          <input type="tel" id="phoneNumber" name="phoneNumber" autoComplete="tel" value={formData.phoneNumber} onChange={handleChange} className={inputClass} placeholder="+234" required />
        </Field>
        <Field label="Password" htmlFor="password" required hint={`At least ${MIN_PASSWORD} characters.`}>
          <PasswordInput id="password" name="password" autoComplete="new-password" value={formData.password} onChange={handleChange} required />
        </Field>
        <Field label="Confirm password" htmlFor="confirmPassword" required error={passwordsMismatch ? "The passwords don't match yet." : undefined}>
          <PasswordInput id="confirmPassword" name="confirmPassword" autoComplete="new-password" value={formData.confirmPassword} onChange={handleChange} required />
        </Field>

        {error ? <Alert tone="error">{error}</Alert> : null}

        <SubmitButton loading={loading} loadingText="Creating your account…">
          Create account <FiArrowRight aria-hidden="true" />
        </SubmitButton>
        <p className="text-center text-xs text-muted">
          By creating an account you agree to be contacted by Joint Venture Assets about your requests.
        </p>
      </form>

      <div className="my-6 flex items-center gap-4 text-xs font-semibold tracking-wider text-muted uppercase">
        <span className="h-px flex-1 bg-line" /> or <span className="h-px flex-1 bg-line" />
      </div>
      <GoogleButton />
    </AuthShell>
  );
}

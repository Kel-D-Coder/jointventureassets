"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiBriefcase, FiKey, FiMapPin } from "react-icons/fi";
import RoleCategory from "@/components/auth/RoleCategory";
import RegisterForm from "@/components/auth/RegisterForm";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSteps } from "@/components/auth/SignupSteps";

const roles = [
  {
    id: "Landowner",
    title: "Landowner",
    description: "I have land and want to partner with individual or group investors, or sell it outright.",
    icon: FiMapPin,
  },
  {
    id: "Investor",
    title: "Investor or developer",
    description: "I have capital and want to find land, buy property, or form and join investor groups.",
    icon: FiBriefcase,
  },
  {
    id: "Buyer",
    title: "Buyer",
    description: "I want to buy land or a building outright, to live in, use or hold as an investment.",
    icon: FiKey,
  },
];

function RoleSelectorContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role");
  const step = searchParams.get("step");
  const category = searchParams.get("category");

  if (role && step === "register") {
    const selectedRole = roles.find((r) => r.id.toLowerCase() === role.toLowerCase());
    return <RegisterForm role={selectedRole?.id || "Investor"} category={category || ""} />;
  }

  if (role) {
    return <RoleCategory />;
  }

  return (
    <AuthShell
      wide
      eyebrow="Create an account"
      title="How will you use Joint Venture Assets?"
      intro="Choose the option that best describes you. You can talk to our team at any time if you're not sure."
      footer={
        <>
          Already have an account?{" "}
          <Link href="/login" className="font-semibold text-gold-deep hover:underline">
            Log in
          </Link>
        </>
      }
    >
      <SignupSteps current={0} />
      <ul className="grid gap-4 sm:grid-cols-3">
        {roles.map(({ id, title, description, icon: Icon }) => (
          <li key={id}>
            <Link
              href={`/register?role=${id}`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_18px_40px_-24px_rgb(14_17_22/0.4)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-ink text-gold">
                <Icon aria-hidden="true" className="h-5 w-5" />
              </span>
              <span className="mt-5 font-display text-xl text-ink">{title}</span>
              <span className="mt-2 flex-1 text-sm leading-relaxed text-muted">{description}</span>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-gold-deep">
                Continue <FiArrowRight aria-hidden="true" className="transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          </li>
        ))}
      </ul>
    </AuthShell>
  );
}

export default function RoleSelector() {
  return (
    <Suspense fallback={<div className="min-h-svh bg-ivory" />}>
      <RoleSelectorContent />
    </Suspense>
  );
}

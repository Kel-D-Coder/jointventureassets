"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { FiArrowRight, FiHome, FiUser, FiUsers } from "react-icons/fi";
import { AuthShell } from "@/components/auth/AuthShell";
import { SignupSteps } from "@/components/auth/SignupSteps";

const categories = [
  { title: "Individual", description: "A private individual or small business owner.", icon: FiUser },
  { title: "Cooperative", description: "A cooperative society, association or group of investors.", icon: FiUsers },
  { title: "Government", description: "A government agency, ministry or public institution.", icon: FiHome },
];

const RoleCategory = () => {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") ?? "";

  return (
    <AuthShell
      wide
      eyebrow={`Joining as ${role === "Investor" ? "an investor" : `a ${role.toLowerCase()}`}`}
      title="Which describes you best?"
      intro="This decides which details we ask for when you complete your profile."
      back={{ href: "/register", label: "Change role" }}
    >
      <SignupSteps current={1} />
      <ul className="grid gap-4 sm:grid-cols-3">
        {categories.map(({ title, description, icon: Icon }) => (
          <li key={title}>
            <Link
              href={`/register?role=${encodeURIComponent(role)}&category=${title}&step=register`}
              className="group flex h-full flex-col rounded-2xl border border-line bg-white p-6 transition hover:-translate-y-0.5 hover:border-gold hover:shadow-[0_18px_40px_-24px_rgb(14_17_22/0.4)]"
            >
              <span className="grid h-12 w-12 place-items-center rounded-xl bg-gold-soft text-gold-deep">
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
};

export default RoleCategory;

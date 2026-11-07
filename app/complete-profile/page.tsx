"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/components/auth/CompleteProfileForm";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Investor";
  const category = searchParams.get("category") || "Cooperative";

  return <CompleteProfileForm role={role} category={category} />;
}

export default function CompleteProfilePage() {
  return (
    <Suspense
       fallback={<div className="min-h-svh bg-ivory" />}
    >
      <CompleteProfileContent />
    </Suspense>
  );
}

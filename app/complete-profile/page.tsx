"use client";

import { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import CompleteProfileForm from "@/components/CompleteProfileForm";

function CompleteProfileContent() {
  const searchParams = useSearchParams();
  const role = searchParams.get("role") || "Investor/Developer";
  const category = searchParams.get("category") || "Cooperative";

  return <CompleteProfileForm role={role} category={category} />;
}

export default function CompleteProfilePage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-yellow-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </div>
      }
    >
      <CompleteProfileContent />
    </Suspense>
  );
}

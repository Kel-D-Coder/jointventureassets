import { Suspense } from "react";
import type { Metadata } from "next";
import GoogleCallback from "@/components/auth/GoogleCallback";

export const metadata: Metadata = {
  title: "Signing you in | Joint Venture Assets",
  robots: { index: false, follow: false },
};

/** Where Google (through Supabase) sends people back after "Continue with Google". */
export default function AuthCallbackPage() {
  return (
    <Suspense>
      <GoogleCallback />
    </Suspense>
  );
}

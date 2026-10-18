"use client";

import Image from "next/image";
import toast from "react-hot-toast";
import googleLogo from "@/assets/google.svg";

/**
 * The server signs people in with their Google email (POST /auth/login with googleEmail),
 * but the Google sign-in pop-up that provides that email isn't set up yet.
 * TODO: add Google OAuth, then call loginWithGoogle(email) from @/lib/api/auth.
 */
export function GoogleButton() {
  const loading = false;
  const handleClick = () => {
    toast("Google sign-in is coming soon. Please use your email and password for now.");
  };

  return (
    <button
      type="button"
      onClick={handleClick}
      disabled={loading}
      className="flex w-full items-center justify-center gap-3 rounded-xl border border-line bg-white px-6 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-gray-400 disabled:opacity-60"
    >
      <Image src={googleLogo} alt="" className="h-5 w-5" />
      {loading ? "Signing in…" : "Continue with Google"}
    </button>
  );
}

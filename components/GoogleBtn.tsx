"use client";

import { useSignIn } from "@clerk/nextjs";

import googleLogo from "@/assets/google.svg"
import { motion } from "framer-motion";
import Image from "next/image";

export function GoogleButton() {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  async function login() {
    await signIn?.authenticateWithRedirect?.({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/dashboard",
    });
  }

  return (
    <button
      onClick={login}
      className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer mt-5"
    >
      <Image
        src={googleLogo}
        alt="Google"
        className="w-5 h-5"
      />
      <span className="text-gray-700 font-medium">
        Continue with Google
      </span>
    </button>
  );
}

"use client";

import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import toast from "react-hot-toast";
import googleLogo from "@/assets/google.svg";
import { AppDispatch } from "@/store/store";
import { setCredentials } from "@/store/authSlice";
import { loginWithGoogle } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/mock";

/** Demo mode: signs in as a sample Google account instead of opening Google. */
export function GoogleButton() {
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const router = useRouter();

  const handleClick = async () => {
    try {
      setLoading(true);
      const response = await loginWithGoogle();
      dispatch(setCredentials({ user: response.user, token: response.token }));
      router.push("/dashboard");
    } catch (error) {
      toast.error(errorMessage(error, "Google sign-in failed. Please try again."));
      setLoading(false);
    }
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

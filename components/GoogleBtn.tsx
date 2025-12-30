"use client";


import googleLogo from "@/assets/google.svg"
import Image from "next/image";

import { signIn } from "next-auth/react"
import { useState } from "react";

export function GoogleButton() {

  const [ loading, setLoading ] = useState(false);

  return (
    <button
      onClick={() => {signIn("google", { redirectTo: "/"} ), setLoading(true)}}
      className={`w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer mt-5 ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
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

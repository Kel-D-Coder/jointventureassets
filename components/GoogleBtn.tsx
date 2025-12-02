"use client";

import { useSignIn } from "@clerk/nextjs";

import googleLogo from "@/assets/google.svg"
import { motion } from "framer-motion";
import Image from "next/image";

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring" as const,
      stiffness: 100,
      damping: 12,
    },
  },
} as const;

export function GoogleButton() {
  const { signIn, isLoaded } = useSignIn();

  if (!isLoaded) return null;

  async function login() {
    await signIn?.authenticateWithRedirect?.({
      strategy: "oauth_google",
      redirectUrl: "/sso-callback",
      redirectUrlComplete: "/",
    });
  }

  return (
    <motion.div
            variants={itemVariants}
            className="mt-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.75 }}
          >
            <motion.button
              onClick={login}
              className="w-full flex items-center justify-center gap-3 py-3 px-6 border border-gray-300 bg-white rounded-lg shadow-sm hover:bg-gray-50 transition-all cursor-pointer"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              <Image
                src={googleLogo}
                alt="Google"
                className="w-5 h-5"
              />
              <span className="text-gray-700 font-medium">
                Continue with Google
              </span>
            </motion.button>
          </motion.div>
  );
}

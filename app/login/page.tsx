import React from "react";
import LoginFormClient from "@/components/LoginFormClient";
import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Login to Joint Venture Assets - Secure Access to Your Account",
  description: "Sign in to your Joint Venture Assets account to manage investments, connect with landowners, and explore joint venture opportunities in real estate.",
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      "max-snippet": -1,
    }
  }
};


export default function Login() {
  return (
    <LoginFormClient />
  );
}

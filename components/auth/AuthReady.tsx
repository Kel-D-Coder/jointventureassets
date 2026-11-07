"use client";

import type { ReactNode } from "react";
import { useAuthReady } from "@/hooks/hooks";

/**
 * Shows its children only once the saved sign-in has loaded, so signed-in parts of the site
 * don't flash a "log in" state or send members to the login page by mistake.
 */
export function AuthReady({ children, fallback = null }: { children: ReactNode; fallback?: ReactNode }) {
  return useAuthReady() ? children : fallback;
}

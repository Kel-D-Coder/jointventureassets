"use client";

import { useEffect } from "react";

/** TEMP debugging: prints data from a server component in the browser console. Renders nothing. */
export function ConsoleLog({ label, data }: { label: string; data: unknown }) {
  useEffect(() => {
    console.log(label, data);
  }, [label, data]);
  return null;
}

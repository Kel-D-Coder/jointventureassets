import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Create an Account | Joint Venture Assets",
  description:
    "Join Joint Venture Assets as a landowner, investor, developer or buyer. Find verified joint-venture partners, land and property across Nigeria.",
  alternates: { canonical: "/register" },
};

export default function RegisterLayout({ children }: { children: React.ReactNode }) {
  return children;
}

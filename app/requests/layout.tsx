import { AuthReady } from "@/components/auth/AuthReady";

/** Members-only pages: wait for the saved sign-in before rendering. */
export default function MembersLayout({ children }: { children: React.ReactNode }) {
  return <AuthReady>{children}</AuthReady>;
}

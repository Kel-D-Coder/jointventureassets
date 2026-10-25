import Link from "next/link";
import { FiClock, FiSlash, FiUser } from "react-icons/fi";
import type { MemberAccount } from "@/lib/inbox/types";

/**
 * Shown instead of a form that only approved members can use (post a request,
 * list a property): what's holding the account up, and what to do next.
 */
export function AccountNotApproved({ account, action }: { account: MemberAccount; action: string }) {
  const suspended = account.status === "suspended";
  const unfinished = !suspended && !account.profileCompleted;
  const Icon = suspended ? FiSlash : unfinished ? FiUser : FiClock;
  const completeProfile = `/complete-profile?role=${encodeURIComponent(account.role)}&category=${encodeURIComponent(account.category)}`;

  return (
    <div className="rounded-2xl border border-line bg-ivory p-8 text-center sm:p-10">
      <span
        className={
          suspended
            ? "mx-auto grid h-14 w-14 place-items-center rounded-full bg-red-50 text-red-700"
            : "mx-auto grid h-14 w-14 place-items-center rounded-full bg-amber-50 text-amber-700"
        }
      >
        <Icon aria-hidden="true" className="h-6 w-6" />
      </span>
      <h2 className="mt-5 font-display text-2xl text-ink">
        {suspended ? "Your account is suspended" : unfinished ? "Finish your profile first" : "Your account is awaiting approval"}
      </h2>
      <p className="mx-auto mt-2 max-w-md text-muted">
        {suspended
          ? `You can't ${action} while your account is suspended. Please contact info@jointventureassets.com.`
          : unfinished
            ? `Our team approves accounts once the profile is complete. You'll be able to ${action} after that.`
            : `You'll be able to ${action} once our team has approved your account, usually within 48 hours.`}
      </p>
      <div className="mt-6 flex flex-col justify-center gap-3 sm:flex-row">
        {unfinished ? (
          <Link href={completeProfile} className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
            Complete my profile
          </Link>
        ) : (
          <Link href="/dashboard" className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
            Go to my dashboard
          </Link>
        )}
        <Link href="/listings" className="rounded-full border border-line bg-white px-6 py-3 text-sm font-bold text-ink hover:border-ink">
          Browse listings
        </Link>
      </div>
    </div>
  );
}

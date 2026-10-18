"use client";

import Link from "next/link";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiArrowLeft, FiCheckCircle, FiClock, FiSlash } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { getMyAccount, updateProfile } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { ProfileFields, profileFieldsFor } from "@/components/auth/ProfileFields";
import { InvestorDocuments } from "@/components/auth/InvestorDocuments";
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form";
import { cx } from "@/lib/format";
import type { AccountStatus, MemberAccount, ProfileDocuments } from "@/lib/inbox/types";

const statusInfo: Record<AccountStatus, { label: string; note: string; className: string; icon: typeof FiClock }> = {
  pending: {
    label: "Awaiting approval",
    note: "Our team reviews new profiles, usually within 48 hours. You can use the site in the meantime.",
    className: "border-amber-200 bg-amber-50 text-amber-900",
    icon: FiClock,
  },
  active: { label: "Approved", note: "Your account is approved.", className: "border-green-200 bg-green-50 text-green-900", icon: FiCheckCircle },
  suspended: { label: "Suspended", note: "Please contact info@jointventureassets.com.", className: "border-red-200 bg-red-50 text-red-900", icon: FiSlash },
};

export default function ProfilePage() {
  const router = useRouter();
  const { user, isAuthenticated, token } = useAppSelector((state) => state.auth);
  const [account, setAccount] = useState<MemberAccount | null>(null);
  const [fullName, setFullName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [profile, setProfile] = useState<Record<string, string>>({});
  const [documents, setDocuments] = useState<ProfileDocuments>({});
  const [loadError, setLoadError] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [notice, setNotice] = useState<{ tone: "success" | "error"; text: string } | null>(null);

  useEffect(() => {
    if (!isAuthenticated || !user) {
      router.push("/login");
      return;
    }
    setLoading(true);
    setLoadError("");
    getMyAccount(user.id, token ?? undefined)
      .then((loaded) => {
        setAccount(loaded);
        setFullName(loaded.fullName);
        setPhoneNumber(loaded.phoneNumber);
        setProfile(loaded.profile);
        setDocuments(loaded.documents ?? {});
      })
      .catch((caught) => setLoadError(errorMessage(caught, "Couldn't load your profile.")))
      .finally(() => setLoading(false));
  }, [isAuthenticated, user, router, token]);

  const fields = useMemo(() => (account ? profileFieldsFor(account.role, account.category) : []), [account]);

  if (!isAuthenticated || !user) return null;

  const isInvestor = account?.role === "Investor";

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInvestor && !documents.companyProfile) {
      setNotice({ tone: "error", text: "Investors need a company profile on file." });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await updateProfile(token ?? "", { phoneNumber, profile, ...(isInvestor ? { documents } : {}) });
      const updated = await getMyAccount(user.id, token ?? undefined);
      setAccount(updated);
      setNotice({ tone: "success", text: "Profile saved. Our team sees your changes straight away." });
    } catch (caught) {
      setNotice({ tone: "error", text: errorMessage(caught, "Couldn't save your profile.") });
    } finally {
      setSaving(false);
    }
  };

  const status = account ? statusInfo[account.status] : null;

  return (
    <main className="bg-ivory px-4 py-12 sm:px-6">
      <div className="mx-auto max-w-3xl">
        <Link href="/dashboard" className="inline-flex items-center gap-2 text-sm font-semibold text-muted hover:text-ink">
          <FiArrowLeft aria-hidden="true" /> My dashboard
        </Link>

        <div className="mt-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="eyebrow text-gold-deep">{account ? `${account.role} · ${account.category}` : "My profile"}</p>
            <h1 className="mt-2 font-display text-4xl text-ink">My profile</h1>
          </div>
        </div>

        {loadError ? <Alert tone="error" className="mt-6">{loadError}</Alert> : null}

        {status ? (
          <div className={cx("mt-6 flex gap-3 rounded-2xl border p-4 text-sm", status.className)}>
            <status.icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
            <p>
              <strong>{status.label}.</strong> {status.note}
            </p>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 space-y-4" aria-busy="true">
            <div className="h-12 animate-pulse rounded-2xl bg-white" />
            <div className="h-96 animate-pulse rounded-3xl bg-white" />
          </div>
        ) : !account && !loadError ? (
          <div className="mt-6 h-96 animate-pulse rounded-3xl bg-white" aria-busy="true" />
        ) : account ? (
          <form onSubmit={save} className="mt-6 space-y-6">
            <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">Account</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <Field label={account.category !== "Individual" ? "Contact person's full name" : "Full name"} htmlFor="fullName" required>
                  <input id="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className={inputClass} required />
                </Field>
                <Field label="Email" htmlFor="email" hint="Contact us to change your email.">
                  <input id="email" value={account.email} disabled className={inputClass} />
                </Field>
                <Field label="Phone number" htmlFor="phoneNumber" required>
                  <input id="phoneNumber" type="tel" value={phoneNumber} onChange={(e) => setPhoneNumber(e.target.value)} className={inputClass} required />
                </Field>
              </div>
            </section>

            <section className="rounded-3xl border border-line bg-white p-6 sm:p-8">
              <h2 className="font-display text-2xl text-ink">{account.role} details</h2>
              <div className="mt-5 grid gap-5 sm:grid-cols-2">
                <ProfileFields fields={fields} values={profile} onChange={(name, value) => setProfile((current) => ({ ...current, [name]: value }))} />
                {isInvestor ? <InvestorDocuments value={documents} onChange={setDocuments} token={token ?? undefined} /> : null}
              </div>
            </section>

            {notice ? <Alert tone={notice.tone}>{notice.text}</Alert> : null}

            <div className="sm:w-60">
              <SubmitButton loading={saving} loadingText="Saving…">
                Save profile
              </SubmitButton>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}

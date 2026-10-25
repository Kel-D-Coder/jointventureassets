"use client";

import { useEffect, useMemo, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { FiCheckCircle, FiClock, FiMail, FiSlash } from "react-icons/fi";
import { useAppSelector } from "@/hooks/hooks";
import { getMyAccount, updateProfile } from "@/lib/api/auth";
import { errorMessage } from "@/lib/api/errors";
import { ProfileFields, profileFieldsFor } from "@/components/auth/ProfileFields";
import { InvestorDocuments } from "@/components/auth/InvestorDocuments";
import { BuyerDocuments } from "@/components/auth/BuyerDocuments";
import { Alert, Field, SubmitButton, inputClass } from "@/components/ui/form";
import { cx } from "@/lib/format";
import { HeroChip, HeroPanel } from "@/components/ui/HeroPanel";
import { Panel } from "@/components/ui/Panel";
import type { AccountStatus, MemberAccount, ProfileDocuments } from "@/lib/inbox/types";

const statusInfo: Record<AccountStatus, { label: string; note: string; className: string; chip: string; icon: typeof FiClock }> = {
  pending: {
    label: "Awaiting approval",
    note: "Our team reviews new profiles, usually within 48 hours. You can use the site in the meantime.",
    className: "border-gold/40 bg-linear-to-r from-gold-soft/60 via-gold-soft/25 to-white text-ink",
    chip: "bg-gold/15 text-gold-soft ring-gold/40",
    icon: FiClock,
  },
  active: {
    label: "Approved",
    note: "Your account is approved.",
    className: "border-green-200 bg-green-50/70 text-green-900",
    chip: "bg-emerald-400/15 text-emerald-200 ring-emerald-300/30",
    icon: FiCheckCircle,
  },
  suspended: {
    label: "Suspended",
    note: "Please contact info@jointventureassets.com.",
    className: "border-red-200 bg-red-50/70 text-red-900",
    chip: "bg-red-400/15 text-red-200 ring-red-300/30",
    icon: FiSlash,
  },
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
        // TEMP: see exactly what GET /user/me returns, and the status the approval banner reads.
        console.log("[profile] GET /user/me response:", loaded);
        console.log("[profile] account status used for approval (after mapping):", loaded?.status);
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
  const isBuyer = account?.role === "Buyer";

  const save = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (isInvestor && !documents.companyProfile) {
      setNotice({ tone: "error", text: "Investors need a company profile on file." });
      return;
    }
    setSaving(true);
    setNotice(null);
    try {
      await updateProfile(token ?? "", { phoneNumber, profile, ...(isInvestor || isBuyer ? { documents } : {}) });
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
    <main className="bg-white pb-24">
      <HeroPanel
        width="max-w-4xl"
        back={{ label: "My dashboard", href: "/dashboard" }}
        eyebrow={account ? `${account.role} · ${account.category}` : "My account"}
        title="My profile"
        intro="Keep your details up to date. Our team uses them to review your account and match you with the right partners."
        meta={
          account ? (
            <>
              {status ? (
                <span className={cx("inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 ring-1", status.chip)}>
                  <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />
                  {status.label}
                </span>
              ) : null}
              <HeroChip>
                <FiMail aria-hidden="true" /> {account.email}
              </HeroChip>
            </>
          ) : null
        }
      />

      <div className="mx-auto max-w-4xl px-4 pt-8 sm:px-6 lg:px-8">
        {loadError ? <Alert tone="error">{loadError}</Alert> : null}

        {status && account?.status !== "active" ? (
          <div className={cx("relative flex items-start gap-4 overflow-hidden rounded-2xl border p-5", status.className)}>
            <span aria-hidden="true" className={cx("absolute inset-y-0 left-0 w-1", account?.status === "suspended" ? "bg-red-400" : "bg-gold")} />
            <span
              className={cx(
                "grid h-10 w-10 shrink-0 place-items-center rounded-xl",
                account?.status === "suspended" ? "bg-red-100 text-red-700" : "bg-ink text-gold",
              )}
            >
              <status.icon aria-hidden="true" />
            </span>
            <p className="text-sm">
              <strong className="block font-semibold">{status.label}</strong>
              <span className="text-muted">{status.note}</span>
            </p>
          </div>
        ) : null}

        {loading ? (
          <div className="mt-6 space-y-6" aria-busy="true">
            <div className="h-64 animate-pulse rounded-3xl border border-line bg-ivory/70" />
            <div className="h-96 animate-pulse rounded-3xl border border-line bg-ivory/70" />
          </div>
        ) : !account && !loadError ? (
          <div className="mt-6 h-96 animate-pulse rounded-3xl border border-line bg-ivory/70" aria-busy="true" />
        ) : account ? (
          <form onSubmit={save} className="mt-6 space-y-6">
            <Panel title="Account" subtitle="How our team reaches you.">
              <div className="grid gap-5 sm:grid-cols-2">
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
            </Panel>

            <Panel title={`${account.role} details`} subtitle="What you're looking for, so we can match you well.">
              <div className="grid gap-5 sm:grid-cols-2">
                <ProfileFields fields={fields} values={profile} onChange={(name, value) => setProfile((current) => ({ ...current, [name]: value }))} />
                {isInvestor ? <InvestorDocuments value={documents} onChange={setDocuments} token={token ?? undefined} /> : null}
                {isBuyer ? <BuyerDocuments value={documents} onChange={setDocuments} token={token ?? undefined} /> : null}
              </div>
            </Panel>

            {notice ? <Alert tone={notice.tone}>{notice.text}</Alert> : null}

            <div className="flex flex-wrap items-center gap-4">
              <div className="w-full sm:w-60">
                <SubmitButton loading={saving} loadingText="Saving…">
                  Save profile
                </SubmitButton>
              </div>
              <p className="text-sm text-muted">Changes reach our team straight away.</p>
            </div>
          </form>
        ) : null}
      </div>
    </main>
  );
}

"use client";

import { useState, type FormEvent } from "react";
import { FiCheckCircle } from "react-icons/fi";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useAppSelector } from "@/hooks/hooks";
import { sendEnquiry } from "@/lib/api/inbox";
import { errorMessage } from "@/lib/api/errors";
import { cx, formatNaira } from "@/lib/format";
import { SALE_FEE_RATE } from "@/lib/fees";
import { Alert, SubmitButton, inputClass } from "@/components/ui/form";
import { DocumentUpload } from "@/components/ui/DocumentUpload";
import type { InboxEnquiry, SubmittedDocument } from "@/lib/inbox/types";
import { optionName, priceNegotiableLabel, type EstateKind } from "@/components/listings/labels";
import type { PlotOption } from "@/types";

/**
 * Asks about a listing or a member's request. Every enquiry lands in the
 * dashboard's Enquiries page, labelled with what it's about. Joint-venture
 * listings also ask about the LOI and require the facilitation fee terms.
 *
 * Who pays the facilitation fee: on a plain sale and on an estate's houses / apartments the buyer
 * pays 5% on top; on an estate's plots of land only the owner pays, so buyers see no fee terms.
 */
export function EnquiryForm({
  target,
  eyebrow,
  defaultMessage,
  submitLabel,
  jointVenture = false,
  salePrice,
  plotOptions,
  estateKind,
  feeRate = SALE_FEE_RATE,
}: {
  target: InboxEnquiry["target"];
  eyebrow: string;
  defaultMessage: string;
  submitLabel: string;
  jointVenture?: boolean;
  /** Sale listings: the asking price, for the 5% facilitation fee terms. */
  salePrice?: number;
  /** Estates: the plot sizes to choose from; the chosen plot's price is used for the fee terms. */
  plotOptions?: PlotOption[];
  /** Estates: plots of land or houses / apartments. */
  estateKind?: EstateKind;
  /** The listing's own facilitation fee rate from the server (0.05 = 5%); the standard rate when missing. */
  feeRate?: number;
}) {
  const { user, token } = useAppSelector((state) => state.auth);
  const pathname = usePathname();
  const [form, setForm] = useState({
    fullName: user?.fullName ?? "",
    email: user?.email ?? "",
    phoneNumber: "",
    message: defaultMessage,
  });
  const [generateLoi, setGenerateLoi] = useState<"" | "yes" | "no">("");
  const [letterhead, setLetterhead] = useState<SubmittedDocument>();
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [plotIndex, setPlotIndex] = useState<number | null>(null);
  const plot = plotOptions && plotIndex !== null ? plotOptions[plotIndex] : undefined;
  // Houses / apartments are named by unit type; plots by size.
  const units = estateKind ? estateKind === "units" : Boolean(plotOptions?.some((option) => option.label));
  // Estate plots: only the owner pays the fee. Estate houses / apartments: the buyer pays the standard 5%.
  const ownerPaysOnly = Boolean(plotOptions) && !units;
  const buyerRate = plotOptions ? SALE_FEE_RATE : feeRate;
  // An estate's fee terms use the chosen plot's price; the amounts show once a plot is chosen.
  const askingPrice = plotOptions ? plot?.price : salePrice;
  const hasPrice = askingPrice !== undefined && askingPrice > 0;
  const feePercent = Math.round(buyerRate * 10000) / 100;
  const fee = (price: number) => Math.round(price * buyerRate);
  // Sales and estates both ask the buyer to accept the fee terms; an estate before any plot is chosen too.
  const isSale = !jointVenture && !ownerPaysOnly && (Boolean(plotOptions?.length) || hasPrice);
  const [jvErrors, setJvErrors] = useState<{ generateLoi?: string; letterhead?: string }>({});
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof typeof form) => (event: { target: { value: string } }) =>
    setForm((current) => ({ ...current, [key]: event.target.value }));

  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    if (jointVenture) {
      const problems = {
        generateLoi: generateLoi ? undefined : "Choose yes or no.",
        letterhead: generateLoi === "yes" && !letterhead ? "Upload your company letterhead so we can prepare your LOI on it." : undefined,
      };
      setJvErrors(problems);
      if (problems.generateLoi || problems.letterhead || !acceptedTerms) return;
    }
    if (plotOptions && !plot) {
      setError(units ? "Choose the unit type you're interested in." : "Choose the plot size you're interested in.");
      return;
    }
    if (isSale && !acceptedTerms) {
      setError("Please agree to the facilitation fee terms to send your enquiry.");
      return;
    }
    setSending(true);
    try {
      await sendEnquiry(
        {
          ...form,
          target,
          jv: jointVenture
            ? { generateLoi: generateLoi === "yes", letterhead: generateLoi === "yes" ? letterhead : undefined, acceptedFeeTerms: true }
            : undefined,
          sale: isSale && hasPrice ? { acceptedFeeTerms: true, feeRate: buyerRate, askingPrice: askingPrice! } : undefined,
        },
        token,
      );
      setSent(true);
    } catch (caught) {
      setError(errorMessage(caught, "Couldn't send your enquiry. Please try again."));
    } finally {
      setSending(false);
    }
  };

  if (!token) {
    return (
      <div className="space-y-3 text-center">
        <p className="eyebrow text-gold-deep">{eyebrow}</p>
        <p className="font-semibold text-ink">Log in to send an enquiry</p>
        <p className="text-sm text-muted">You need a JVA account so our team can follow up and you can track your enquiry.</p>
        <div className="flex flex-col gap-2 pt-1">
          <Link href={`/login?next=${encodeURIComponent(pathname ?? "/")}`} className="rounded-full bg-ink px-6 py-3 text-sm font-bold text-white hover:bg-ink/85">
            Log in
          </Link>
          <Link href="/register" className="rounded-full border border-line px-6 py-3 text-sm font-bold text-ink hover:border-ink">
            Create an account
          </Link>
        </div>
      </div>
    );
  }

  if (sent) {
    return (
      <div className="rounded-2xl border border-green-200 bg-green-50 p-6 text-center">
        <FiCheckCircle aria-hidden="true" className="mx-auto h-8 w-8 text-green-700" />
        <p className="mt-3 font-semibold text-ink">Enquiry sent</p>
        <p className="mt-1 text-sm text-muted">
          Thanks. The JVA team will contact you within one working day.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <p className="eyebrow text-gold-deep">{eyebrow}</p>
      <label className="block">
        <span className="sr-only">Full name</span>
        <input required value={form.fullName} onChange={set("fullName")} placeholder="Full name" autoComplete="name" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Email</span>
        <input required type="email" value={form.email} onChange={set("email")} placeholder="Email" autoComplete="email" className={inputClass} />
      </label>
      <label className="block">
        <span className="sr-only">Phone number</span>
        <input required type="tel" value={form.phoneNumber} onChange={set("phoneNumber")} placeholder="Phone number" autoComplete="tel" className={inputClass} />
      </label>
      {plotOptions ? (
        <label className="block">
          <span className="mb-1.5 block text-sm font-semibold text-ink">
            {units ? "Which unit?" : "Which plot size?"}<span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
          </span>
          <select
            required
            value={plotIndex ?? ""}
            onChange={(event) => {
              const index = event.target.value === "" ? null : Number(event.target.value);
              setPlotIndex(index);
              setError("");
              // Name the plot in the message, so the team sees which one the enquiry is about.
              if (index !== null) {
                const chosen = plotOptions[index]!;
                setForm((current) => ({
                  ...current,
                  message: `I'm interested in a ${optionName(chosen)} (${formatNaira(chosen.price)}). ${defaultMessage.replace(/^I'm interested in buying "[^"]*"\.\s*/, "")}`.trim(),
                }));
              }
            }}
            className={cx(inputClass, "pr-10", plotIndex === null && "text-gray-400")}
          >
            <option value="">{units ? "Choose a unit type" : "Choose a plot size"}</option>
            {plotOptions.map((option, index) => (
              <option key={index} value={index}>
                {optionName(option)}: {formatNaira(option.price)}
                {option.priceNegotiable ? ` (${priceNegotiableLabel[option.priceNegotiable].toLowerCase()})` : ""}
              </option>
            ))}
          </select>
        </label>
      ) : null}
      <label className="block">
        <span className="sr-only">Message</span>
        <textarea required rows={4} value={form.message} onChange={set("message")} className={inputClass} />
      </label>
      {jointVenture ? (
        <>
          <fieldset className="rounded-xl border border-line bg-ivory/60 p-4">
            <legend className="px-1 text-sm font-semibold text-ink">
              Do you want us to generate your Letter of Intent (LOI) when you move forward?
              <span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
            </legend>
            <div className="mt-1 grid gap-2">
              {([
                ["yes", "Yes, prepare it for me"],
                ["no", "No, I'll provide my own"],
              ] as const).map(([value, label]) => (
                <label
                  key={value}
                  className={cx(
                    "flex cursor-pointer items-center gap-3 rounded-lg border bg-white px-3 py-2.5 text-sm has-checked:border-gold has-checked:bg-gold-soft/40",
                    jvErrors.generateLoi ? "border-red-300" : "border-line",
                  )}
                >
                  <input
                    type="radio"
                    name="generateLoi"
                    checked={generateLoi === value}
                    onChange={() => {
                      setGenerateLoi(value);
                      setJvErrors({});
                    }}
                    className="accent-[#c9a24a]"
                  />
                  {label}
                </label>
              ))}
            </div>
            {jvErrors.generateLoi ? <p className="mt-1.5 text-xs font-medium text-red-700">{jvErrors.generateLoi}</p> : null}
            {generateLoi === "yes" ? (
              <div className="mt-4">
                <DocumentUpload
                  id="enquiryLetterhead"
                  label="Company letterhead"
                  description="We print your LOI on it. Upload the top of your letterhead as an image."
                  required
                  imagesOnly
                  value={letterhead}
                  onChange={(doc) => {
                    setLetterhead(doc);
                    setJvErrors({});
                  }}
                  error={jvErrors.letterhead}
                />
              </div>
            ) : null}
          </fieldset>

          <div className="rounded-xl border border-line p-4">
            <p className="text-sm font-semibold text-ink">Terms and conditions</p>
            <p className="mt-1 text-xs leading-relaxed text-muted">
              The Facilitation Fee Agreement is prepared by Joint Venture Assets. The facilitation fee is <strong className="text-ink">10% of the land value</strong>{" "}
              and is <strong className="text-ink">non-negotiable</strong>.
            </p>
            <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-ink">
              <input
                type="checkbox"
                required
                checked={acceptedTerms}
                onChange={(event) => setAcceptedTerms(event.target.checked)}
                className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a24a]"
              />
              I agree to the facilitation fee terms.
            </label>
          </div>
        </>
      ) : null}
      {error ? <Alert tone="error">{error}</Alert> : null}
      {isSale ? (
        <div className="rounded-xl border border-line p-4">
          <p className="text-sm font-semibold text-ink">Facilitation fee</p>
          <p className="mt-1 text-xs leading-relaxed text-muted">
            When you buy through Joint Venture Assets, a facilitation fee of <strong className="text-ink">{feePercent}% of the agreed price</strong> is paid{" "}
            <strong className="text-ink">on top of</strong> the price.
          </p>
          {hasPrice ? (
          <>
          <dl className="mt-3 space-y-1.5 rounded-lg bg-ivory p-3 text-sm">
            <div className="flex justify-between gap-3">
              <dt className="text-muted">{plot ? optionName(plot) : "Asking price"}</dt>
              <dd className="font-semibold text-ink tabular-nums">{formatNaira(askingPrice!)}</dd>
            </div>
            <div className="flex justify-between gap-3">
              <dt className="text-muted">Facilitation fee ({feePercent}%)</dt>
              <dd className="font-semibold text-ink tabular-nums">+ {formatNaira(fee(askingPrice!))}</dd>
            </div>
            <div className="flex justify-between gap-3 border-t border-line pt-1.5">
              <dt className="font-semibold text-ink">Total you&apos;d pay</dt>
              <dd className="font-bold text-ink tabular-nums">{formatNaira(askingPrice! + fee(askingPrice!))}</dd>
            </div>
          </dl>
          <p className="mt-2 text-[0.6875rem] text-muted">Worked out on the asking price. The fee is {feePercent}% of the final agreed price.</p>
          </>
          ) : (
            <p className="mt-3 rounded-lg bg-ivory p-3 text-xs text-muted">{units ? "Choose a unit type above to see the fee and the total for that unit." : "Choose a plot size above to see the fee and the total for that plot."}</p>
          )}
          <label className="mt-3 flex cursor-pointer items-start gap-2.5 text-sm text-ink">
            <input
              type="checkbox"
              required
              checked={acceptedTerms}
              onChange={(event) => setAcceptedTerms(event.target.checked)}
              className="mt-0.5 h-4 w-4 shrink-0 accent-[#c9a24a]"
            />
            I agree to pay the {feePercent}% facilitation fee on top of the agreed price.
          </label>
        </div>
      ) : null}
      <SubmitButton loading={sending} loadingText="Sending…" disabled={(jointVenture || isSale) && !acceptedTerms}>
        {submitLabel}
      </SubmitButton>
      <p className="text-center text-xs text-muted">The JVA team replies within one working day.</p>
    </form>
  );
}

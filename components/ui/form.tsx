"use client";

import { useState, type ComponentProps, type ReactNode } from "react";
import { FiAlertCircle, FiCheckCircle, FiEye, FiEyeOff, FiInfo } from "react-icons/fi";
import { cx, withCommas } from "@/lib/format";

/** Shared styling for every text input, select and textarea on the site. */
export const inputClass =
  "w-full rounded-xl border border-line bg-white px-4 py-3 text-sm text-ink placeholder:text-gray-400 transition focus:border-gold focus:ring-2 focus:ring-gold/20 focus:outline-none disabled:bg-ivory disabled:opacity-70";

/** Label + control + hint or error. Pass `htmlFor` matching the control's id. */
export function Field({
  label,
  htmlFor,
  required,
  hint,
  error,
  children,
  className,
}: {
  label: ReactNode;
  htmlFor?: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="mb-1.5 block text-sm font-semibold text-ink">
        {label}
        {required ? <span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span> : null}
      </label>
      {children}
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </div>
  );
}

/** A `<select>` with the shared styling and a placeholder option. */
export function Select({
  options,
  placeholder,
  className,
  ...props
}: ComponentProps<"select"> & { options: Array<string | { value: string; label: string }>; placeholder?: string }) {
  return (
    <select {...props} className={cx(inputClass, "pr-10", className)}>
      {placeholder ? <option value="">{placeholder}</option> : null}
      {options.map((option) => {
        const { value, label } = typeof option === "string" ? { value: option, label: option } : option;
        return (
          <option key={value} value={value}>
            {label}
          </option>
        );
      })}
    </select>
  );
}

/** Password input with a show/hide toggle. */
export function PasswordInput({ className, ...props }: Omit<ComponentProps<"input">, "type">) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? "text" : "password"} className={cx(inputClass, "pr-12", className)} />
      <button
        type="button"
        onClick={() => setVisible(!visible)}
        aria-label={visible ? "Hide password" : "Show password"}
        className="absolute top-1/2 right-3 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-lg text-muted hover:bg-ivory hover:text-ink"
      >
        {visible ? <FiEyeOff aria-hidden="true" /> : <FiEye aria-hidden="true" />}
      </button>
    </div>
  );
}

const alertStyles = {
  error: { box: "border-red-200 bg-red-50 text-red-800", icon: FiAlertCircle },
  success: { box: "border-green-200 bg-green-50 text-green-800", icon: FiCheckCircle },
  info: { box: "border-gold/40 bg-gold-soft/50 text-ink", icon: FiInfo },
} as const;

export function Alert({ tone, children, className }: { tone: keyof typeof alertStyles; children: ReactNode; className?: string }) {
  const { box, icon: Icon } = alertStyles[tone];
  return (
    <div role={tone === "error" ? "alert" : "status"} className={cx("flex gap-3 rounded-xl border px-4 py-3 text-sm", box, className)}>
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

/** Full-width primary button with a built-in loading state. */
export function SubmitButton({
  loading,
  loadingText = "Please wait…",
  children,
  disabled,
  tone = "ink",
}: {
  loading?: boolean;
  loadingText?: string;
  children: ReactNode;
  disabled?: boolean;
  tone?: "ink" | "gold";
}) {
  return (
    <button
      type="submit"
      disabled={loading || disabled}
      className={cx(
        "inline-flex w-full items-center justify-center gap-2 rounded-xl px-6 py-3.5 text-sm font-bold transition-colors disabled:cursor-not-allowed disabled:opacity-60",
        tone === "ink" ? "bg-ink text-white hover:bg-ink/85" : "bg-gold text-ink hover:bg-gold/85",
      )}
    >
      {loading ? (
        <>
          <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" aria-hidden="true" />
          {loadingText}
        </>
      ) : (
        children
      )}
    </button>
  );
}

/** A naira amount: shows commas as you type (1,000,000) and hands back digits only. */
export function MoneyInput({
  value,
  onChange,
  className,
  ...props
}: Omit<ComponentProps<"input">, "value" | "onChange" | "inputMode"> & { value: string; onChange: (digits: string) => void }) {
  return (
    <input
      {...props}
      inputMode="numeric"
      value={withCommas(value)}
      onChange={(event) => onChange(event.target.value.replace(/[^\d]/g, ""))}
      className={cx(inputClass, className)}
    />
  );
}

export type YesNoValue = "" | "yes" | "no";

/** A required yes/no question as two radio cards. */
export function YesNo({
  name,
  legend,
  value,
  onChange,
  yes,
  no,
  hint,
  error,
  className,
}: {
  name: string;
  legend: ReactNode;
  value: YesNoValue;
  onChange: (value: "yes" | "no") => void;
  yes: string;
  no: string;
  hint?: ReactNode;
  error?: string;
  className?: string;
}) {
  return (
    <fieldset className={className}>
      <legend className="mb-1.5 text-sm font-semibold text-ink">
        {legend}
        <span className="ml-0.5 text-gold-deep" aria-hidden="true">*</span>
      </legend>
      <div className="grid grid-cols-2 gap-2">
        {([
          ["yes", yes],
          ["no", no],
        ] as const).map(([option, label]) => (
          <label
            key={option}
            className={cx(
              "flex cursor-pointer items-center gap-2.5 rounded-xl border bg-white px-4 py-3 text-sm text-ink has-checked:border-gold has-checked:bg-gold-soft/40",
              error ? "border-red-300" : "border-line",
            )}
          >
            <input type="radio" name={name} checked={value === option} onChange={() => onChange(option)} className="accent-[#c9a24a]" />
            {label}
          </label>
        ))}
      </div>
      {error ? (
        <p className="mt-1.5 text-xs font-medium text-red-700">{error}</p>
      ) : hint ? (
        <p className="mt-1.5 text-xs text-muted">{hint}</p>
      ) : null}
    </fieldset>
  );
}

/** "" until answered; otherwise whether a premium was given. */
export const premiumAnswer = (premium?: number): YesNoValue => (premium === undefined ? "" : premium > 0 ? "yes" : "no");
export const booleanAnswer = (value?: boolean): YesNoValue => (value === undefined ? "" : value ? "yes" : "no");

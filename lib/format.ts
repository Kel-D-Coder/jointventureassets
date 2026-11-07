const nairaFormatter = new Intl.NumberFormat("en-NG", {
  style: "currency",
  currency: "NGN",
  maximumFractionDigits: 0,
});

/** 12000 -> "₦12,000" */
export function formatNaira(amount: number): string {
  return nairaFormatter.format(amount);
}

function trim(value: number): string {
  return value.toFixed(2).replace(/\.?0+$/, "");
}

/** 1_450_000_000 -> "₦1.45bn", 65_000_000 -> "₦65m" */
export function formatNairaShort(amount: number): string {
  if (amount >= 1_000_000_000) return `₦${trim(amount / 1_000_000_000)}bn`;
  if (amount >= 1_000_000) return `₦${trim(amount / 1_000_000)}m`;
  return formatNaira(amount);
}

/** 50000 -> "5 ha", 2400 -> "2,400 sqm" */
export function formatSize(sqm: number): string {
  if (sqm >= 10_000) return `${trim(sqm / 10_000)} ha`;
  return `${sqm.toLocaleString("en-NG")} sqm`;
}

/** Joins class names, dropping anything falsy. */
export function cx(...values: Array<string | false | null | undefined>): string {
  return values.filter(Boolean).join(" ");
}

/** "1000000" -> "1,000,000", for showing an amount while it's being typed. */
export function withCommas(digits: string): string {
  return digits.replace(/^0+(?=\d)/, "").replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

/** How a JV premium reads on the website: "₦25,000,000", "No premium", or undefined when not stated. */
export function premiumText(premium?: number): string | undefined {
  if (premium === undefined) return undefined;
  return premium > 0 ? formatNaira(premium) : "No premium";
}

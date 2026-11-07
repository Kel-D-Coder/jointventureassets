/**
 * JVA's facilitation fee on a sale: 5% of the agreed price from each side.
 * The buyer pays it on top of the price; the seller pays it out of the proceeds.
 */
export const SALE_FEE_RATE = 0.05;

export function saleFee(price: number): number {
  return Math.round(price * SALE_FEE_RATE);
}

/** An estate sets its own facilitation fee to JVA, as a percentage of each plot's sale price, at least this. */
export const MIN_ESTATE_FEE_PERCENT = 5;

/** What's wrong with an estate's fee percentage, if anything. */
export function estateFeeProblem(percent: string): string | undefined {
  const value = Number(percent);
  if (!percent.trim() || Number.isNaN(value)) return "Enter the facilitation fee for JVA, as a percentage.";
  if (value < MIN_ESTATE_FEE_PERCENT) return `The facilitation fee can't be less than ${MIN_ESTATE_FEE_PERCENT}%.`;
  if (value >= 100) return "Enter a percentage below 100.";
  return undefined;
}

/** Digits and one decimal point, for a percentage field: "7.5". */
export const percentDigits = (raw: string) => raw.replace(/[^\d.]/g, "").replace(/(\..*)\./g, "$1");


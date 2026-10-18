/**
 * JVA's facilitation fee on a sale: 5% of the agreed price from each side.
 * The buyer pays it on top of the price; the seller pays it out of the proceeds.
 */
export const SALE_FEE_RATE = 0.05;

export function saleFee(price: number): number {
  return Math.round(price * SALE_FEE_RATE);
}

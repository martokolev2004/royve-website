export interface PromoCode {
  discount: number; // percentage, e.g. 50 = 50%
}

export const PROMO_CODES: Record<string, PromoCode> = {
  MartinKolev04: { discount: 50 },
};

export function applyPromo(total: number, code: string): { discountedTotal: number; discountAmount: number } | null {
  const promo = PROMO_CODES[code];
  if (!promo) return null;
  const discountAmount = Math.round(total * promo.discount) / 100;
  const discountedTotal = Math.round((total - discountAmount) * 100) / 100;
  return { discountedTotal, discountAmount };
}

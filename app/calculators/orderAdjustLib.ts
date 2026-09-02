// ─── Constants ────────────────────────────────────────────────────────────────

export const FREE_SHIPPING_THRESHOLD = 200_00; // cents
export const STANDARD_SHIPPING = 14_99;         // cents

// ─── Money helpers ────────────────────────────────────────────────────────────

/** Parse a user input string to integer cents. Returns null if invalid. */
export function parseCents(raw: string): number | null {
  if (raw.trim() === "") return null;
  const n = parseFloat(raw);
  if (!isFinite(n) || isNaN(n) || n < 0) return null;
  return Math.round(n * 100);
}

/** Round cents value to integer. */
export const rc = (n: number) => Math.round(n);

/** Format integer cents to "$X.XX" */
export function fmtC(cents: number): string {
  const abs = Math.abs(cents);
  const [whole, dec] = (abs / 100).toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${cents < 0 ? "-" : ""}$${grouped}.${dec}`;
}

// ─── Coupon types ─────────────────────────────────────────────────────────────

export type CouponType = "percentage" | "fixed" | "free-shipping";

export type WebsiteCoupon = {
  code: string;
  label: string;
  type: CouponType;
  value?: number; // percentage (0-100) or fixed cents
};

export const WEBSITE_COUPONS: WebsiteCoupon[] = [
  { code: "SAVETEN",    label: "SAVETEN — $10 Off",     type: "fixed",       value: 10_00 },
  { code: "SAVE5",      label: "SAVE5 — 5% Off",        type: "percentage",  value: 5 },
  { code: "5OFFPROMO",  label: "5OFFPROMO — 5% Off",    type: "percentage",  value: 5 },
  { code: "FREESHIP",   label: "FREESHIP — Free Shipping", type: "free-shipping" },
  { code: "SAVEFIVE",   label: "SAVEFIVE — 5% Off",     type: "percentage",  value: 5 },
  { code: "MOBILE5",    label: "MOBILE5 — 5% Off",      type: "percentage",  value: 5 },
  { code: "WELCOME5",   label: "WELCOME5 — 5% Off",     type: "percentage",  value: 5 },
  { code: "CART5",      label: "CART5 — 5% Off",        type: "percentage",  value: 5 },
  { code: "RETURN5",    label: "RETURN5 — 5% Off",      type: "percentage",  value: 5 },
  { code: "SEZZLE5",    label: "SEZZLE5 — 5% Off",      type: "percentage",  value: 5 },
  { code: "BF10",       label: "BF10 — 10% Off",        type: "percentage",  value: 10 },
];

// ─── Discount mode ────────────────────────────────────────────────────────────

export type DiscountMode = "none" | "coupon" | "manual";

// ─── Order item ───────────────────────────────────────────────────────────────

export type OrderItem = {
  id: string;
  name: string;
  unitPrice: string;   // raw input string
  quantity: string;    // raw input string
  fixedShipping: string; // raw input string, blank = 0
};

export function makeOrderItem(): OrderItem {
  return {
    id: crypto.randomUUID(),
    name: "",
    unitPrice: "",
    quantity: "1",
    fixedShipping: "",
  };
}

// ─── Shipping mode ────────────────────────────────────────────────────────────

export type ShippingMode = "keep" | "recalculate" | "manual";

// ─── Core calculations (all in cents) ────────────────────────────────────────

export type CalcResult = {
  rawMerchandise: number;
  discountAmount: number;
  discountLabel: string;
  discountedMerchandise: number;
  redoAmount: number;
  shippingAmount: number;
  shippingLabel: string;
  isFreeShip: boolean;
  taxableSubtotal: number;
  taxAmount: number;
  newGrandTotal: number;
  originalGrandTotal: number;
  difference: number; // positive = customer pays, negative = refund
};

export function calculateShipping(params: {
  mode: ShippingMode;
  originalShipping: number;   // cents
  manualShipping: number;     // cents
  rawMerchandise: number;     // cents (pre-discount, for threshold)
  fixedShippingTotal: number; // cents
  isFreeShip: boolean;
  applyStandardShipping: boolean;
}): { amount: number; label: string } {
  const { mode, originalShipping, manualShipping, rawMerchandise, fixedShippingTotal, isFreeShip, applyStandardShipping } = params;

  if (mode === "keep") {
    return { amount: originalShipping, label: "Shipping (Kept Original)" };
  }

  if (mode === "manual") {
    return { amount: manualShipping, label: "Shipping (Manual)" };
  }

  // Recalculate
  if (isFreeShip) {
    return { amount: 0, label: "Shipping (FREESHIP)" };
  }
  if (fixedShippingTotal > 0) {
    return { amount: fixedShippingTotal, label: "Shipping (Fixed)" };
  }
  if (rawMerchandise < FREE_SHIPPING_THRESHOLD) {
    return {
      amount: applyStandardShipping ? STANDARD_SHIPPING : 0,
      label: "Shipping (Recalculated)",
    };
  }
  return { amount: 0, label: "Shipping (Recalculated)" };
}

type CalcParams = {
  originalGrandTotal: number;   // cents
  province: string;
  provinceTaxRates: Record<string, number>;
  redoAmount: number;           // cents
  originalShipping: number;     // cents
  shippingMode: ShippingMode;
  manualShipping: number;       // cents (used when mode === "manual")
  items: OrderItem[];
  discountMode: DiscountMode;
  selectedCoupon: WebsiteCoupon | null;
  manualPct: string;            // raw input
  applyStandardShipping: boolean;
};

export function calculateAdjustment(p: CalcParams): CalcResult | null {
  if (p.originalGrandTotal <= 0 || !p.province) return null;

  // 1. Raw merchandise + fixed shipping from items
  let rawMerchandise = 0;
  let fixedShippingTotal = 0;

  for (const item of p.items) {
    const unitPrice = parseCents(item.unitPrice);
    const qty = parseInt(item.quantity, 10);
    const fs = parseCents(item.fixedShipping);

    if (unitPrice !== null && qty > 0) {
      rawMerchandise += rc(unitPrice * qty);
    }
    if (fs !== null) {
      fixedShippingTotal += fs;
    }
  }

  // 2. Discount
  let discountAmount = 0;
  let discountLabel = "";
  let isFreeShip = false;

  if (p.discountMode === "coupon" && p.selectedCoupon) {
    const coupon = p.selectedCoupon;
    if (coupon.type === "percentage" && coupon.value !== undefined) {
      discountAmount = rc(rawMerchandise * coupon.value / 100);
      discountLabel = `${coupon.code} (${coupon.value}%)`;
    } else if (coupon.type === "fixed" && coupon.value !== undefined) {
      discountAmount = Math.min(coupon.value, rawMerchandise);
      discountLabel = coupon.code;
    } else if (coupon.type === "free-shipping") {
      // FREESHIP only applies in recalculate mode
      if (p.shippingMode === "recalculate") isFreeShip = true;
      discountLabel = "FREESHIP";
    }
  } else if (p.discountMode === "manual") {
    const pct = parseFloat(p.manualPct);
    if (isFinite(pct) && pct >= 0 && pct <= 100) {
      discountAmount = rc(rawMerchandise * pct / 100);
      discountLabel = `Manual Discount (${pct}%)`;
    }
  }

  // 3. Discounted merchandise
  const discountedMerchandise = rawMerchandise - discountAmount;

  // 4. Shipping via helper
  const { amount: shippingAmount, label: shippingLabel } = calculateShipping({
    mode: p.shippingMode,
    originalShipping: p.originalShipping,
    manualShipping: p.manualShipping,
    rawMerchandise,
    fixedShippingTotal,
    isFreeShip,
    applyStandardShipping: p.applyStandardShipping,
  });

  // 5. Tax — taxable base: discounted merchandise + redo + shipping
  const taxableSubtotal = discountedMerchandise + p.redoAmount + shippingAmount;
  const taxRate = p.provinceTaxRates[p.province] ?? 0;
  const taxAmount = rc(taxableSubtotal * taxRate / 100);

  // 6. New grand total
  const newGrandTotal = discountedMerchandise + p.redoAmount + shippingAmount + taxAmount;

  // 7. Difference
  const difference = newGrandTotal - p.originalGrandTotal;

  return {
    rawMerchandise,
    discountAmount,
    discountLabel,
    discountedMerchandise,
    redoAmount: p.redoAmount,
    shippingAmount,
    shippingLabel,
    isFreeShip,
    taxableSubtotal,
    taxAmount,
    newGrandTotal,
    originalGrandTotal: p.originalGrandTotal,
    difference,
  };
}

// ─── Constants ───────────────────────────────────────────────────────────────

export const CAD_COGS_TAX = 0.13;

export const WEBSITE_PAYMENT_RATES = {
  card: 0.05,
  afterpay: 0.08,
} as const;

export type WebsitePaymentMethod = keyof typeof WEBSITE_PAYMENT_RATES;

export const WEBSITE_ROUTE_TAX_RATES: Record<string, number> = {
  Alberta: 0.05,
  "British Columbia": 0.12,
  Manitoba: 0.12,
  "New Brunswick": 0.15,
  "Newfoundland and Labrador": 0.15,
  "Northwest Territories": 0.05,
  "Nova Scotia": 0.14,
  Nunavut: 0.05,
  Ontario: 0.13,
  "Prince Edward Island": 0.15,
  Quebec: 0.14975,
  Saskatchewan: 0.11,
  Yukon: 0.05,
};

export const WALMART_COMMISSION_RATES: { label: string; rate: number }[] = [
  { label: "Apparel & Accessories", rate: 0.15 },
  { label: "Automotive & Powersports", rate: 0.12 },
  { label: "Baby", rate: 0.15 },
  { label: "Beauty", rate: 0.15 },
  { label: "Books", rate: 0.15 },
  { label: "Camera & Photo", rate: 0.08 },
  { label: "Cell Phones", rate: 0.08 },
  { label: "Consumer Electronics", rate: 0.08 },
  { label: "Electronics Accessories", rate: 0.15 },
  { label: "Furniture & Decor", rate: 0.15 },
  { label: "Gourmet Food", rate: 0.10 },
  { label: "Grocery", rate: 0.10 },
  { label: "Health & Personal Care", rate: 0.15 },
  { label: "Home & Garden", rate: 0.15 },
  { label: "Industrial & Scientific", rate: 0.12 },
  { label: "Jewellery", rate: 0.20 },
  { label: "Kitchen", rate: 0.15 },
  { label: "Luggage & Travel Accessories", rate: 0.15 },
  { label: "Major Appliances", rate: 0.08 },
  { label: "Music", rate: 0.15 },
  { label: "Musical Instruments", rate: 0.12 },
  { label: "Office Products", rate: 0.15 },
  { label: "Outdoors", rate: 0.15 },
  { label: "Personal Computers", rate: 0.06 },
  { label: "Pet Supplies", rate: 0.15 },
  { label: "Shoes, Handbags & Sunglasses", rate: 0.15 },
  { label: "Software & Computer Video Games", rate: 0.15 },
  { label: "Sporting Goods", rate: 0.15 },
  { label: "Tires & Wheels", rate: 0.10 },
  { label: "Tools & Home Improvement", rate: 0.12 },
  { label: "Toys & Games", rate: 0.15 },
  { label: "Video & DVD", rate: 0.15 },
  { label: "Video Game Consoles", rate: 0.08 },
  { label: "Video Games", rate: 0.15 },
  { label: "Watches", rate: 0.15 },
  { label: "Everything Else", rate: 0.15 },
];

export const DEFAULT_WALMART_CATEGORY = "Consumer Electronics";

// ─── Money helpers ────────────────────────────────────────────────────────────

/** Round to nearest cent using integer arithmetic to avoid float errors */
export function roundCents(value: number): number {
  return Math.round(value * 100) / 100;
}

export function parseMoney(raw: string): number | null {
  const n = parseFloat(raw);
  if (!isFinite(n) || isNaN(n)) return null;
  return n;
}

export function fmtMoney(v: number): string {
  const abs = Math.abs(v);
  const [whole, decimal] = abs.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${v < 0 ? "-" : ""}$${grouped}.${decimal}`;
}

// ─── Date ─────────────────────────────────────────────────────────────────────

export function formatPMDate(): string {
  const now = new Date();
  const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
  return `${months[now.getMonth()]} ${now.getDate()}`;
}

// ─── Brand type ───────────────────────────────────────────────────────────────

export type BrandType = "us" | "cad";

export function calculateFinalCogs(cogs: number, brand: BrandType): number {
  if (brand === "cad") return roundCents(cogs * (1 + CAD_COGS_TAX));
  return roundCents(cogs);
}

// ─── Multi-item COGS ──────────────────────────────────────────────────────────

export type CogsItem = {
  id: string;
  amount: string;       // raw string from input
  brand: BrandType | null;
};

export function makeCogsItem(): CogsItem {
  return { id: crypto.randomUUID(), amount: "", brand: null };
}

export function defaultCogsItems(): CogsItem[] {
  return [makeCogsItem()];
}

/** Final cost for a single item. Returns null if item is incomplete. */
export function calculateCogsItemFinal(item: CogsItem): number | null {
  const amt = parseMoney(item.amount);
  if (amt === null || item.brand === null) return null;
  return calculateFinalCogs(amt, item.brand);
}

/**
 * Sum of all items' final costs.
 * Returns null if ANY item is incomplete (has amount but no brand, or partial).
 * Blank amount items are skipped (treated as $0) unless they also have a brand
 * selection, in which case the row is considered incomplete.
 */
export function calculateTotalCogs(items: CogsItem[]): number | null {
  let total = 0;
  for (const item of items) {
    const hasAmount = item.amount.trim() !== "" && parseMoney(item.amount) !== null;
    const hasBrand = item.brand !== null;

    if (!hasAmount && !hasBrand) {
      // Fully blank row — skip
      continue;
    }
    if (hasAmount && !hasBrand) {
      // Has amount but no brand — incomplete
      return null;
    }
    if (!hasAmount && hasBrand) {
      // Has brand but no amount — incomplete
      return null;
    }
    // Both present
    const itemFinal = calculateCogsItemFinal(item);
    if (itemFinal === null) return null;
    total = roundCents(total + itemFinal);
  }
  return total;
}

// ─── Platform calculators ─────────────────────────────────────────────────────
// Optional fields (shipping, commissionFee) are number | null.
// null means "not entered" → treated as $0 in calculation, omitted from note.

// ─── Shared note builder ──────────────────────────────────────────────────────

/**
 * Build the shipping+insurance segment.
 * - shipping null  → omit entirely (insurance also omitted)
 * - shipping present, insurance null → "Shipping $X"
 * - both present → "Shipping $X w/$Y Ins." (Amazon: "w/$Y ADS Ins.")
 */
function buildShippingSegment(
  shipping: number | null,
  insurance: number | null,
  amazonAds = false
): string | null {
  if (shipping === null) return null;
  const insuranceLabel = amazonAds ? "ADS Ins." : "Ins.";
  if (insurance !== null) {
    return `Shipping ${fmtMoney(shipping)} w/${fmtMoney(insurance)} ${insuranceLabel}`;
  }
  return `Shipping ${fmtMoney(shipping)}`;
}

/**
 * Assemble a PM order note from dynamic segments.
 * Null/empty segments are filtered out. Segments joined with " / ".
 * Format: PM $X (CostSeg) / RouteSeg / ShippingSeg Date (Initials)
 * The Cost segment goes in parens; Route and Shipping are outside parens.
 * If no segments at all, no parens.
 */
export function buildPmNote(params: {
  finalPM: number;
  segments: (string | null)[];
  initials: string;
}): string {
  const date = formatPMDate();
  const initials = params.initials.trim();
  // segments[0] = Cost (inside parens), rest = outside parens
  const allParts = params.segments.filter((s): s is string => s !== null && s.length > 0);
  if (allParts.length === 0) {
    return `PM ${fmtMoney(params.finalPM)} ${date} (${initials})`;
  }
  const [first, ...rest] = allParts;
  const inner = `(${first})`;
  const outside = rest.length > 0 ? ` / ${rest.join(" / ")}` : "";
  return `PM ${fmtMoney(params.finalPM)} ${inner}${outside} ${date} (${initials})`;
}

/** Return "Cost $X" segment only if cogs > 0, otherwise null */
function buildCostSegment(totalCogs: number): string | null {
  if (totalCogs <= 0) return null;
  return `Cost ${fmtMoney(totalCogs)}`;
}

// ─── Website ──────────────────────────────────────────────────────────────────

export type WebsitePMResult = {
  finalCogs: number;
  finalRoute: number;
  paymentFee: number;
  finalPM: number;
};

export function calculateWebsitePM(params: {
  grandTotal: number;
  totalCogs: number;
  paymentMethod: WebsitePaymentMethod | null;
  routePreTax: number;
  province: string;
  shipping: number | null;
}): WebsitePMResult {
  const paymentFee = params.paymentMethod
    ? roundCents(params.grandTotal * WEBSITE_PAYMENT_RATES[params.paymentMethod])
    : 0;
  const taxRate = WEBSITE_ROUTE_TAX_RATES[params.province] ?? 0;
  const finalRoute = params.routePreTax > 0 ? roundCents(params.routePreTax * (1 + taxRate)) : 0;
  const shippingAmt = params.shipping ?? 0;
  const finalPM = roundCents(params.grandTotal - paymentFee - finalRoute - params.totalCogs - shippingAmt);
  return { finalCogs: params.totalCogs, finalRoute, paymentFee, finalPM };
}

export function buildWebsiteNote(params: {
  finalPM: number;
  finalCogs: number;
  finalRoute: number;
  shipping: number | null;
  insurance: number | null;
  initials: string;
}): string {
  const routeSegment = params.finalRoute > 0 ? `Re-Do ${fmtMoney(params.finalRoute)}` : null;
  const shippingSegment = buildShippingSegment(params.shipping, params.insurance, false);
  return buildPmNote({
    finalPM: params.finalPM,
    segments: [buildCostSegment(params.finalCogs), routeSegment, shippingSegment],
    initials: params.initials,
  });
}

// ─── Amazon ───────────────────────────────────────────────────────────────────

export type AmazonPMResult = {
  finalCogs: number;
  finalPM: number;
};

export function calculateAmazonPM(params: {
  grandTotal: number;
  totalCogs: number;
  shipping: number | null;
}): AmazonPMResult {
  const shippingAmt = params.shipping ?? 0;
  const finalPM = roundCents(params.grandTotal - params.totalCogs - shippingAmt);
  return { finalCogs: params.totalCogs, finalPM };
}

export function buildAmazonNote(params: {
  finalPM: number;
  finalCogs: number;
  shipping: number | null;
  insurance: number | null;
  initials: string;
}): string {
  const shippingSegment = buildShippingSegment(params.shipping, params.insurance, true);
  return buildPmNote({
    finalPM: params.finalPM,
    segments: [buildCostSegment(params.finalCogs), shippingSegment],
    initials: params.initials,
  });
}

// ─── Best Buy ─────────────────────────────────────────────────────────────────

export type BestBuyPMResult = {
  finalCogs: number;
  finalPM: number;
};

export function calculateBestBuyPM(params: {
  grandTotal: number;
  totalCogs: number;
  commissionFee: number | null;
  shipping: number | null;
}): BestBuyPMResult {
  const commissionAmt = params.commissionFee ?? 0;
  const shippingAmt = params.shipping ?? 0;
  const finalPM = roundCents(params.grandTotal - params.totalCogs - commissionAmt - shippingAmt);
  return { finalCogs: params.totalCogs, finalPM };
}

export function buildBestBuyNote(params: {
  finalPM: number;
  finalCogs: number;
  commissionFee: number | null;
  shipping: number | null;
  insurance: number | null;
  initials: string;
}): string {
  const commSegment = params.commissionFee !== null ? `Comms Fee ${fmtMoney(params.commissionFee)}` : null;
  const shippingSegment = buildShippingSegment(params.shipping, params.insurance, false);
  return buildPmNote({
    finalPM: params.finalPM,
    segments: [buildCostSegment(params.finalCogs), commSegment, shippingSegment],
    initials: params.initials,
  });
}

// ─── Walmart ──────────────────────────────────────────────────────────────────

export type WalmartPMResult = {
  finalCogs: number;
  commissionFee: number;
  finalPM: number;
};

export function calculateWalmartPM(params: {
  grandTotal: number;
  totalCogs: number;
  categoryRate: number;
  shipping: number | null;
}): WalmartPMResult {
  const commissionFee = roundCents(params.grandTotal * params.categoryRate);
  const shippingAmt = params.shipping ?? 0;
  const finalPM = roundCents(params.grandTotal - commissionFee - params.totalCogs - shippingAmt);
  return { finalCogs: params.totalCogs, commissionFee, finalPM };
}

export function buildWalmartNote(params: {
  finalPM: number;
  finalCogs: number;
  commissionFee: number;
  shipping: number | null;
  insurance: number | null;
  initials: string;
}): string {
  const shippingSegment = buildShippingSegment(params.shipping, params.insurance, false);
  return buildPmNote({
    finalPM: params.finalPM,
    segments: [
      buildCostSegment(params.finalCogs),
      `Comms Fee ${fmtMoney(params.commissionFee)}`,
      shippingSegment,
    ],
    initials: params.initials,
  });
}


export type TabId = "retail" | "discount" | "match" | "wholesale" | "adjust";

export type ProvinceTax = Record<string, number>;

export type WholesaleBrand = {
  key: string;
  label: string;
  markup: number | null;
  divisor: number | null;
};

export type RetailResult = {
  cogsWithTax: number;
  totalCost: number;
  retailPrice: number | null;
  platformFeeAmt: number | null;
  profit: number | null;
  netMargin: number | null;
};

export type MatchResult = {
  grandTotal: number;
  pfAmt: number;
  totalCost: number;
  profit: number;
  margin: number;
};

export const PROVINCE_TAX: ProvinceTax = {
  Alberta: 5,
  "British Columbia": 12,
  Manitoba: 12,
  "New Brunswick": 15,
  "Newfoundland and Labrador": 15,
  "Northwest Territories": 5,
  "Nova Scotia": 14,
  Nunavut: 5,
  Ontario: 13,
  "Prince Edward Island": 15,
  Quebec: 14.975,
  Saskatchewan: 11,
  Yukon: 5,
};

export const DISCOUNT_RATES = [5, 7.5, 10];

export const WHOLESALE_BRANDS: WholesaleBrand[] = [
  { key: "jlAudio", label: "JL Audio", markup: 25, divisor: 0.75 },
  {
    key: "kenwoodExcelon",
    label: "Kenwood Excelon",
    markup: 25,
    divisor: 0.75,
  },
  { key: "sobel", label: "Sobel", markup: 15, divisor: 0.85 },
  { key: "automobRockford", label: "Automob — Rockford Fosgate", markup: 18, divisor: 0.82 },
  { key: "automobHertz", label: "Automob — Hertz", markup: 30, divisor: 0.70 },
  { key: "automobOther", label: "Automob — All Others", markup: 15, divisor: 0.85 },
  { key: "carrady", label: "Carrady", markup: 15, divisor: 0.85 },
  { key: "importel", label: "Importel", markup: 15, divisor: 0.85 },
  { key: "gemsen", label: "Gemsen", markup: 20, divisor: 0.8 },
  { key: "gentec", label: "Gentec", markup: 15, divisor: 0.85 },
  { key: "focal", label: "Focal", markup: 25, divisor: 0.75 },
  { key: "pioneer", label: "Pioneer", markup: 20, divisor: 0.80 },
  { key: "other", label: "Other", markup: null, divisor: null },
];

export const fmtCAD = (v: number | null | undefined) => {
  if (v === null || v === undefined || Number.isNaN(v) || !Number.isFinite(v)) {
    return "—";
  }
  const abs = Math.abs(v);
  const [whole, decimal] = abs.toFixed(2).split(".");
  const grouped = whole.replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  return `${v < 0 ? "-" : ""}$${grouped}.${decimal}`;
};

export const fmtPct = (v: number | null | undefined) => {
  if (v === null || v === undefined || Number.isNaN(v)) return "—";
  return `${v.toFixed(2)}%`;
};

export const toNum = (value: string) => {
  const n = Number.parseFloat(value);
  return Number.isFinite(n) ? n : 0;
};

export const marginStyle = (margin: number) => {
  if (Number.isNaN(margin)) {
    return {
      color: "text-zinc-400",
      bg: "bg-zinc-100",
      badge: "bg-zinc-100 text-zinc-500",
    };
  }
  if (margin < 0) {
    return {
      color: "text-red-500",
      bg: "bg-red-50",
      badge: "bg-red-50 text-red-500",
    };
  }
  if (margin < 10) {
    return {
      color: "text-amber-500",
      bg: "bg-amber-50",
      badge: "bg-amber-50 text-amber-600",
    };
  }
  return {
    color: "text-emerald-500",
    bg: "bg-emerald-50",
    badge: "bg-emerald-50 text-emerald-600",
  };
};

"use client";

import { useState, useMemo, useCallback, useRef, useEffect } from "react";
import { WHOLESALE_BRANDS, type WholesaleBrand, fmtCAD } from "./interface";
import { FieldLabel, NumberInput } from "./components";

// ─── Types ────────────────────────────────────────────────────────────────────

type ProductCategory = "remoteStarter" | "everythingElse";

interface CategoryConfig {
  label: string;
  divisor: number;
  markup: number;
  isRemoteStarter: boolean;
}

const CATEGORIES: Record<ProductCategory, CategoryConfig> = {
  everythingElse: { label: "Everything Else", divisor: 0.85, markup: 15, isRemoteStarter: false },
  remoteStarter: { label: "Remote Starter (Fortin & iData)", divisor: 0.90, markup: 10, isRemoteStarter: true },
};

// Brand list for the selector (single entry per brand)
interface BrandListItem {
  key: string;
  label: string;
  displayDivisor: number | null;
  displayMarkup: number | null;
  hasCategories: boolean;
  note?: string;
}

function buildBrandList(): BrandListItem[] {
  return WHOLESALE_BRANDS.map((b) => ({
    key: b.key,
    label: b.label,
    displayDivisor: b.divisor,
    displayMarkup: b.markup,
    hasCategories: b.hasCategories ?? false,
    note: b.note,
  }));
}

const BRAND_LIST = buildBrandList();

// ─── Helpers ──────────────────────────────────────────────────────────────────

function calcPrices(cost: number, divisor: number) {
  if (!cost || !divisor || divisor <= 0 || divisor >= 1) return null;
  const wholesale = cost / divisor;
  const profit = wholesale - cost;
  const margin = ((wholesale - cost) / wholesale) * 100;
  return { wholesale, profit, margin };
}

function copyToClipboard(text: string): Promise<void> {
  if (navigator.clipboard) return navigator.clipboard.writeText(text);
  const el = document.createElement("textarea");
  el.value = text;
  document.body.appendChild(el);
  el.select();
  document.execCommand("copy");
  document.body.removeChild(el);
  return Promise.resolve();
}

// ─── Sub-components ───────────────────────────────────────────────────────────

function CopyButton({ text, label }: { text: string; label: string }) {
  const [copied, setCopied] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const handleCopy = useCallback(() => {
    copyToClipboard(text).then(() => {
      setCopied(true);
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setCopied(false), 2000);
    });
  }, [text]);

  useEffect(() => () => { if (timerRef.current) clearTimeout(timerRef.current); }, []);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={[
        "inline-flex items-center gap-1.5 rounded-md px-3 py-1.5 text-[12px] font-semibold transition",
        copied
          ? "bg-emerald-100 text-emerald-700"
          : "bg-zinc-100 text-zinc-600 hover:bg-zinc-200 hover:text-zinc-900",
      ].join(" ")}
    >
      {copied ? "✓ Copied" : `Copy ${label}`}
    </button>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────

export function WholesaleCalculator() {
  const [search, setSearch] = useState("");
  const [selectedKey, setSelectedKey] = useState<string>(BRAND_LIST[0].key);
  const [dealerCost, setDealerCost] = useState("");
  const [quantity, setQuantity] = useState("1");
  const [category, setCategory] = useState<ProductCategory>("everythingElse");
  const [otherDivisor, setOtherDivisor] = useState("0.85");

  // Filter brands by search
  const filteredBrands = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return BRAND_LIST;
    return BRAND_LIST.filter((b) => b.label.toLowerCase().includes(q));
  }, [search]);

  // Selected brand object
  const selectedBrand = useMemo(
    () => BRAND_LIST.find((b) => b.key === selectedKey) ?? BRAND_LIST[0],
    [selectedKey]
  );

  // Resolve active divisor and markup
  const { activeDivisor, activeMarkup, isRemoteStarter } = useMemo(() => {
    if (selectedBrand.key === "other") {
      const d = parseFloat(otherDivisor);
      const valid = isFinite(d) && d > 0 && d < 1;
      const markup = valid ? Math.round((1 - d) * 100 * 100) / 100 : null;
      return { activeDivisor: valid ? d : null, activeMarkup: markup, isRemoteStarter: false };
    }
    if (selectedBrand.hasCategories) {
      const cat = CATEGORIES[category];
      return { activeDivisor: cat.divisor, activeMarkup: cat.markup, isRemoteStarter: cat.isRemoteStarter };
    }
    return {
      activeDivisor: selectedBrand.displayDivisor,
      activeMarkup: selectedBrand.displayMarkup,
      isRemoteStarter: false,
    };
  }, [selectedBrand, category, otherDivisor]);

  // Parsed inputs
  const cost = useMemo(() => {
    const n = parseFloat(dealerCost);
    return isFinite(n) && n > 0 ? n : 0;
  }, [dealerCost]);

  const qty = useMemo(() => {
    const n = parseInt(quantity, 10);
    return isFinite(n) && n >= 1 ? n : 1;
  }, [quantity]);

  // Calculations
  const result = useMemo(
    () => (activeDivisor ? calcPrices(cost, activeDivisor) : null),
    [cost, activeDivisor]
  );

  const nxgResult = useMemo(() => {
    if (!isRemoteStarter || !activeDivisor || !cost) return null;
    const standard = cost / activeDivisor;
    const nxgPrice = standard * 0.95;
    const profit = nxgPrice - cost;
    const margin = ((nxgPrice - cost) / nxgPrice) * 100;
    return { wholesale: nxgPrice, profit, margin };
  }, [isRemoteStarter, activeDivisor, cost]);

  // Copy text builders
  const standardCopyText = useMemo(() => {
    if (!result) return "";
    const cat = selectedBrand.hasCategories ? ` (${CATEGORIES[category].label})` : "";
    return `${selectedBrand.label}${cat} — Wholesale Price: ${fmtCAD(result.wholesale)}`;
  }, [result, selectedBrand, category]);

  const nxgCopyText = useMemo(() => {
    if (!nxgResult) return "";
    return `${selectedBrand.label} – Remote Starter (Fortin & iData) — NXG Auto EXCLUSIVE Price: ${fmtCAD(nxgResult.wholesale)} (Authorized Dealer Only — Do NOT quote to other dealers)`;
  }, [nxgResult, selectedBrand]);

  const handleSelectBrand = useCallback((key: string) => {
    setSelectedKey(key);
    // Reset category to default when switching brands
    setCategory("everythingElse");
  }, []);

  return (
    <div className="space-y-5">
      {/* ── Warning banners ── */}
      <div className="rounded-lg border border-red-300 bg-red-50 px-4 py-3.5">
        <p className="text-[13px] font-semibold text-red-700">
          ⚠️ Singh Electronics Private Label Items
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-red-600">
          Pricing for Singh Electronics private label items (e.g. 0 gauge wire spools and similar products) must always be sourced directly from the Google Sheets or the Wholesale Distribution website — do not use this calculator for those items. The same applies to any US brands we carry (e.g. Skar Audio, CT Sounds, Deaf Bonce). The same restriction applies to UV Brands Wear products.
        </p>
      </div>

      <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-3.5">
        <p className="text-[13px] font-semibold text-amber-800">
          ⚠️ Fortin &amp; iData – Supplier Pricing Rule
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-amber-700">
          For all Fortin and iData brand products, wholesale pricing must be based on dealer costs obtained from the{" "}
          <span className="font-semibold">Carrady or Importel websites</span>.
        </p>
        <p className="mt-1.5 text-[12.5px] font-semibold leading-[1.6] text-amber-800">
          Do NOT use Sobel&apos;s dealer pricing for Fortin or iData products, even when these products are available through Sobel.
        </p>
        <p className="mt-1 text-[12.5px] leading-[1.6] text-amber-700">
          For remote starter products, use the dedicated{" "}
          <span className="font-semibold">Carrady or Importel Remote Starter category</span> with the 0.90 divisor.
        </p>
      </div>

      {/* ── Two-column layout on desktop ── */}
      <div className="grid gap-5 lg:grid-cols-[1fr_1.1fr]">
        {/* ── Left: Brand selector ── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="mb-1 text-[10.5px] font-bold tracking-[0.1em] uppercase text-zinc-400">
            Wholesale Pricing Calculator
          </div>
          <h2 className="mb-4 text-[17px] font-extrabold tracking-[-0.02em] text-zinc-900">
            Select Brand
          </h2>

          {/* Search */}
          <div className="relative mb-3">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 pointer-events-none">
              🔍
            </span>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search brands or suppliers..."
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 py-2.5 pl-9 pr-3 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
              aria-label="Search brands"
            />
          </div>

          {/* Brand list */}
          <div
            className="max-h-[340px] overflow-y-auto rounded-lg border border-zinc-200"
            role="listbox"
            aria-label="Available brands"
          >
            {filteredBrands.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 text-zinc-400">
                <span className="text-2xl">🔎</span>
                <p className="mt-2 text-[13px]">No brands match &ldquo;{search}&rdquo;</p>
              </div>
            ) : (
              filteredBrands.map((brand, idx) => {
                const isSelected = brand.key === selectedKey;
                const displayDivisor = brand.hasCategories ? "0.85–0.90" : brand.displayDivisor?.toFixed(2) ?? "—";
                const displayMargin = brand.hasCategories ? "10–15%" : brand.displayMarkup !== null ? `${brand.displayMarkup}%` : "Custom";

                return (
                  <button
                    key={brand.key}
                    type="button"
                    role="option"
                    aria-selected={isSelected}
                    onClick={() => handleSelectBrand(brand.key)}
                    className={[
                      "flex w-full items-center gap-3 px-3.5 py-2.5 text-left transition",
                      idx !== 0 ? "border-t border-zinc-100" : "",
                      isSelected
                        ? "bg-zinc-900 text-white"
                        : "hover:bg-zinc-50 text-zinc-900",
                    ].join(" ")}
                  >
                    {/* Radio indicator */}
                    <span
                      className={[
                        "flex h-4 w-4 shrink-0 items-center justify-center rounded-full border transition",
                        isSelected
                          ? "border-emerald-400 bg-emerald-400"
                          : "border-zinc-300 bg-white",
                      ].join(" ")}
                    >
                      {isSelected && (
                        <span className="h-1.5 w-1.5 rounded-full bg-zinc-900" />
                      )}
                    </span>

                    {/* Brand name */}
                    <span className="flex-1 text-[13px] font-semibold leading-tight">
                      {brand.label}
                    </span>

                    {/* Divisor + margin */}
                    <span className={["text-right shrink-0", isSelected ? "text-zinc-300" : "text-zinc-400"].join(" ")}>
                      <span className="block font-mono text-[12px] font-semibold">
                        ÷{displayDivisor}
                      </span>
                      <span className="block text-[11px]">{displayMargin} margin</span>
                    </span>
                  </button>
                );
              })
            )}
          </div>

          {/* Other divisor note */}
          {selectedBrand.key !== "other" && (
            <p className="mt-3 text-[11.5px] leading-[1.6] text-zinc-400">
              Select <span className="font-semibold text-zinc-500">Other</span> to enter a custom divisor for unlisted brands.
            </p>
          )}
        </div>

        {/* ── Right: Pricing panel ── */}
        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
          {/* Selected brand header */}
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              <div className="text-[10.5px] font-bold tracking-[0.1em] uppercase text-zinc-400">
                Selected Brand
              </div>
              <h2 className="mt-0.5 text-[18px] font-extrabold tracking-[-0.02em] text-zinc-900 leading-tight">
                {selectedBrand.label}
              </h2>
              {selectedBrand.hasCategories && (
                <span className="mt-1 inline-block rounded-full bg-zinc-100 px-2 py-0.5 text-[11px] font-semibold text-zinc-500">
                  {CATEGORIES[category].label}
                </span>
              )}
            </div>
            {activeDivisor && (
              <div className="text-right shrink-0">
                <div className="text-[10px] uppercase tracking-[0.07em] text-zinc-400">Divisor</div>
                <div className="font-mono text-[18px] font-extrabold text-zinc-900">
                  {activeDivisor.toFixed(2)}
                </div>
                {activeMarkup !== null && (
                  <div className="text-[11px] text-zinc-400">{activeMarkup}% margin</div>
                )}
              </div>
            )}
          </div>

          {/* Sobel warning */}
          {selectedBrand.note && (
            <div className="mb-4 rounded-lg border border-amber-200 bg-amber-50 px-3.5 py-2.5">
              <p className="text-[12px] leading-[1.5] text-amber-700">
                ⚠️ {selectedBrand.note}
              </p>
            </div>
          )}

          {/* Category dropdown for Carrady / Importel */}
          {selectedBrand.hasCategories && (
            <div className="mb-4">
              <FieldLabel>Product Category</FieldLabel>
              <select
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900"
                value={category}
                onChange={(e) => setCategory(e.target.value as ProductCategory)}
                aria-label="Product category"
              >
                <option value="everythingElse">Everything Else — ÷0.85 (15% margin)</option>
                <option value="remoteStarter">Remote Starter (Fortin &amp; iData) — ÷0.90 (10% margin)</option>
              </select>
            </div>
          )}

          {/* Other: custom divisor */}
          {selectedBrand.key === "other" && (
            <div className="mb-4">
              <FieldLabel>Custom Divisor</FieldLabel>
              <NumberInput
                value={otherDivisor}
                onChange={setOtherDivisor}
                placeholder="0.85"
                min={0.01}
                max={0.99}
              />
              <p className="mt-1.5 text-[11.5px] leading-[1.6] text-amber-700">
                ⚠️ For unlisted brands, the default divisor is 0.85 (15% gross margin). Any nonstandard divisor must be approved by management before providing a wholesale quotation.
              </p>
            </div>
          )}

          {/* Inputs: Dealer Cost + Quantity */}
          <div className="mb-4 grid grid-cols-2 gap-3">
            <div>
              <FieldLabel>Dealer Cost (pre-tax)</FieldLabel>
              <NumberInput
                value={dealerCost}
                onChange={setDealerCost}
                prefix="$"
                placeholder="0.00"
                min={0}
              />
            </div>
            <div>
              <FieldLabel>Quantity</FieldLabel>
              <NumberInput
                value={quantity}
                onChange={setQuantity}
                placeholder="1"
                min={1}
              />
            </div>
          </div>

          {/* ── Results ── */}
          {cost > 0 && activeDivisor && result ? (
            <div className="space-y-3">
              {/* Standard wholesale price */}
              <div className="rounded-xl border border-zinc-200 bg-zinc-50 p-4">
                <div className="mb-3 flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-400">
                    {isRemoteStarter ? "Standard Wholesale Price – All Dealers" : "Wholesale Selling Price"}
                  </span>
                  <CopyButton text={standardCopyText} label="Price" />
                </div>

                {/* Primary price */}
                <div className="mb-3 text-center">
                  <div className="font-mono text-[32px] font-black tracking-[-0.02em] text-emerald-500">
                    {fmtCAD(result.wholesale)}
                  </div>
                  {qty > 1 && (
                    <div className="mt-0.5 text-[13px] text-zinc-400">
                      per unit · <span className="font-semibold text-emerald-600">{fmtCAD(result.wholesale * qty)} total</span>
                    </div>
                  )}
                </div>

                {/* Breakdown row */}
                <div className="grid grid-cols-3 gap-2 border-t border-zinc-200 pt-3">
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-zinc-400">Dealer Cost</div>
                    <div className="font-mono text-[13px] font-semibold text-zinc-700">{fmtCAD(cost)}</div>
                  </div>
                  <div className="text-center border-x border-zinc-200">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-zinc-400">Gross Profit/Unit</div>
                    <div className="font-mono text-[13px] font-semibold text-emerald-600">{fmtCAD(result.profit)}</div>
                    {qty > 1 && (
                      <div className="text-[11px] text-zinc-400">{fmtCAD(result.profit * qty)} total</div>
                    )}
                  </div>
                  <div className="text-center">
                    <div className="text-[10px] uppercase tracking-[0.06em] text-zinc-400">Gross Margin</div>
                    <div className="font-mono text-[13px] font-semibold text-emerald-600">{result.margin.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              {/* NXG Auto exclusive price */}
              {isRemoteStarter && nxgResult && (
                <div className="rounded-xl border border-violet-300 bg-violet-50 p-4">
                  <div className="mb-2 flex items-center justify-between gap-2">
                    <div>
                      <div className="text-[11px] font-bold uppercase tracking-[0.08em] text-violet-600">
                        🔒 NXG Auto – Exclusive Dealer Price
                      </div>
                      <div className="text-[11px] text-violet-500">Additional 5% Off Standard Price</div>
                    </div>
                    <CopyButton text={nxgCopyText} label="NXG Price" />
                  </div>

                  <div className="mb-3 text-center">
                    <div className="font-mono text-[28px] font-black tracking-[-0.02em] text-violet-600">
                      {fmtCAD(nxgResult.wholesale)}
                    </div>
                    {qty > 1 && (
                      <div className="mt-0.5 text-[13px] text-violet-400">
                        per unit · <span className="font-semibold text-violet-600">{fmtCAD(nxgResult.wholesale * qty)} total</span>
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2 border-t border-violet-200 pt-3">
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-[0.06em] text-violet-400">Gross Profit/Unit</div>
                      <div className="font-mono text-[13px] font-semibold text-violet-600">{fmtCAD(nxgResult.profit)}</div>
                      {qty > 1 && (
                        <div className="text-[11px] text-violet-400">{fmtCAD(nxgResult.profit * qty)} total</div>
                      )}
                    </div>
                    <div className="text-center">
                      <div className="text-[10px] uppercase tracking-[0.06em] text-violet-400">Effective Margin</div>
                      <div className="font-mono text-[13px] font-semibold text-violet-600">{nxgResult.margin.toFixed(2)}%</div>
                    </div>
                  </div>

                  {/* Authorization notice */}
                  <div className="mt-3 rounded-lg border border-violet-300 bg-violet-100 px-3.5 py-3">
                    <p className="text-[12px] font-bold leading-snug text-violet-900">
                      NXG Auto is currently the ONLY authorized dealer eligible for an additional 5% discount on Fortin and iData remote starter wholesale pricing.
                    </p>
                    <p className="mt-1.5 text-[11.5px] leading-[1.6] text-violet-800">
                      All other dealers must receive standard pricing calculated using the 0.90 divisor (10% gross margin).
                    </p>
                    <p className="mt-1 text-[11.5px] font-bold leading-[1.6] text-violet-900">
                      Do not offer the NXG Auto discounted price to any other dealer without explicit management authorization.
                    </p>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center rounded-xl border border-dashed border-zinc-200 py-10 text-zinc-400">
              <span className="text-3xl">💰</span>
              <p className="mt-2 text-[13px]">Enter a dealer cost above to calculate pricing</p>
              {activeDivisor && (
                <p className="mt-1 font-mono text-[12px]">÷{activeDivisor.toFixed(2)} · {activeMarkup !== null ? `${activeMarkup}% margin` : "custom margin"}</p>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

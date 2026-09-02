"use client";

import Link from "next/link";
import {
  fmtCAD,
  fmtPct,
  marginStyle,
  PROVINCE_TAX,
  type TabId,
  toNum,
  WHOLESALE_BRANDS,
} from "./interface";
import { Card, FieldLabel, NumberInput } from "./components";
import { OrderAdjustCalculator } from "./OrderAdjustCalculator";
import { useCalculators } from "./useCalculators";

export default function CalculatorsPage() {
  const {
    activeTab,
    setActiveTab,
    retail,
    rCogs,
    setRCogs,
    rShipping,
    setRShipping,
    rPlatform,
    setRPlatform,
    rMargin,
    setRMargin,
    rTaxEnabled,
    setRTaxEnabled,
    discount,
    dSubtotal,
    setDSubtotal,
    dProvince,
    setDProvince,
    dTaxRate,
    setDTaxRate,
    dCogs,
    setDCogs,
    dLogistics,
    setDLogistics,
    dPlatform,
    setDPlatform,
    match,
    matchMarginVisual,
    mPrice,
    setMPrice,
    mProvince,
    setMProvince,
    mTaxRate,
    setMTaxRate,
    mCogs,
    setMCogs,
    mLogistics,
    setMLogistics,
    mPlatform,
    setMPlatform,
    wsCosts,
    setWsCosts,
    wsOtherDivisor,
    setWsOtherDivisor,
  } = useCalculators();

  return (
    <main className="min-h-svh bg-zinc-100 text-zinc-900">
      <header className="sticky top-0 z-30 bg-zinc-900 shadow-[0_1px_0_rgba(255,255,255,0.06)]">
        <div className="mx-auto max-w-[980px] px-5">
          <div className="flex items-center justify-between pb-2 pt-[18px]">
            <div>
              <div className="text-[22px] font-extrabold tracking-[-0.03em] text-white">
                Price<span className="text-emerald-500">Calculators</span>
              </div>
              <div className="mt-1 text-[11.5px] text-zinc-500">
                Singh Electronics Pricing Tool · CAD $
              </div>
            </div>
            <div className="size-2.5 animate-pulse rounded-full bg-emerald-500 shadow-[0_0_0_4px_rgba(16,185,129,0.15)]" />
          </div>

          <nav className="flex gap-0.5 overflow-x-auto pt-3.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
            {(
              [
                ["discount", "📊 Discount Profit"],
                ["match", "⚡ Price Match"],
                ["wholesale", "🏭 Wholesale"],
                ["adjust", "🔄 Order Adjustment"],
                ["retail", "🏷 Retail Price"],
              ] as [TabId, string][]
            ).map(([id, label]) => {
              const selected = activeTab === id;
              return (
                <button
                  key={id}
                  type="button"
                  onClick={() => setActiveTab(id as TabId)}
                  className={[
                    "shrink-0 cursor-pointer whitespace-nowrap rounded-t-lg px-[18px] py-2.5 text-[13px] font-semibold tracking-[-0.01em] transition",
                    selected
                      ? "bg-zinc-100 text-zinc-900"
                      : "text-zinc-500 hover:text-zinc-300",
                  ].join(" ")}
                >
                  {label}
                </button>
              );
            })}
          </nav>
        </div>
      </header>

      <div className="mx-auto max-w-[980px] px-5 pb-20 pt-6">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-zinc-300 bg-white px-3.5 py-2 text-sm font-semibold text-zinc-700 transition hover:border-zinc-900 hover:text-zinc-900"
          >
            ← Back to Home
          </Link>
        </div>

        {activeTab === "adjust" ? (
          <section>
            <OrderAdjustCalculator />
          </section>
        ) : null}

        {activeTab === "retail" ? (
          <section className="grid gap-5 md:grid-cols-2">
            <Card title="Inputs">
              <div className="space-y-3.5">
                <div>
                  <FieldLabel>COGS</FieldLabel>
                  <NumberInput
                    value={rCogs}
                    onChange={setRCogs}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Shipping</FieldLabel>
                  <NumberInput
                    value={rShipping}
                    onChange={setRShipping}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Platform Fee</FieldLabel>
                  <NumberInput
                    value={rPlatform}
                    onChange={setRPlatform}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <FieldLabel>Target Profit Margin</FieldLabel>
                  <NumberInput
                    value={rMargin}
                    onChange={setRMargin}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <FieldLabel>
                    Tax Rate (13%)
                  </FieldLabel>
                  <div className="flex items-center justify-between rounded-lg border border-zinc-200 bg-zinc-50 px-3.5 py-2.5">
                    <span className="text-[13px] text-zinc-600">Add tax to COGS</span>
                    <button
                      type="button"
                      onClick={() => setRTaxEnabled((v) => !v)}
                      className={[
                        "relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 focus:outline-none",
                        rTaxEnabled ? "bg-emerald-500" : "bg-zinc-300",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "inline-block h-5 w-5 transform rounded-full bg-white shadow transition duration-200",
                          rTaxEnabled ? "translate-x-5" : "translate-x-0",
                        ].join(" ")}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </Card>

            <Card title="Results" sticky>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                  <span className="text-[13px] text-zinc-500">
                    COGS {rTaxEnabled ? "+ Tax (13%)" : "(no tax)"}
                  </span>
                  <span className="font-mono text-sm font-semibold">
                    {fmtCAD(retail.cogsWithTax)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                  <span className="text-[13px] text-zinc-500">Total Cost</span>
                  <span className="font-mono text-sm font-semibold">
                    {fmtCAD(retail.totalCost)}
                  </span>
                </div>
                <div className="my-3 h-px bg-zinc-200" />
                {retail.retailPrice === null ? (
                  <div className="py-2 text-center text-[13px] text-red-500">
                    Invalid margin / fee combination
                  </div>
                ) : (
                  <>
                    <div className="flex items-center justify-between py-2">
                      <span className="text-[13px] text-zinc-500">
                        Retail Price
                      </span>
                      <span className="font-mono text-[19px] font-extrabold">
                        {fmtCAD(retail.retailPrice)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                      <span className="text-[13px] text-zinc-500">
                        Platform Fee ({rPlatform || "0"}%)
                      </span>
                      <span className="font-mono text-sm font-semibold text-zinc-500">
                        − {fmtCAD(retail.platformFeeAmt)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between rounded-lg bg-emerald-50 px-3.5 py-2.5">
                      <span className="text-[13px] font-medium text-emerald-700">
                        Net Profit
                      </span>
                      <span className={[
                        "font-mono text-[15px] font-bold",
                        retail.profit !== null && retail.profit < 0 ? "text-red-500" : "text-emerald-600",
                      ].join(" ")}>
                        {fmtCAD(retail.profit)}
                      </span>
                    </div>
                    <div className="flex items-center justify-between px-3.5 py-1.5">
                      <span className="text-[12px] text-zinc-400">
                        Net Margin
                      </span>
                      <span className={[
                        "font-mono text-[12px] font-semibold",
                        retail.netMargin !== null && retail.netMargin < 0 ? "text-red-400" : "text-emerald-500",
                      ].join(" ")}>
                        {fmtPct(retail.netMargin)}
                      </span>
                    </div>
                  </>
                )}
              </div>
            </Card>
          </section>
        ) : null}

        {activeTab === "discount" ? (
          <section className="space-y-5">
            <Card title="Inputs">
              <div className="grid gap-x-5 gap-y-3.5 md:grid-cols-2">
                <div>
                  <FieldLabel>Subtotal</FieldLabel>
                  <NumberInput
                    value={dSubtotal}
                    onChange={setDSubtotal}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Province</FieldLabel>
                  <select
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 pr-8 text-sm outline-none transition focus:border-zinc-900"
                    value={dProvince}
                    onChange={(e) => {
                      const p = e.target.value;
                      setDProvince(p);
                      setDTaxRate(String(PROVINCE_TAX[p]));
                    }}
                  >
                    {Object.keys(PROVINCE_TAX).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Tax Rate</FieldLabel>
                  <NumberInput
                    value={dTaxRate}
                    onChange={setDTaxRate}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <FieldLabel>Lightspeed Cost (incl. taxes)</FieldLabel>
                  <NumberInput
                    value={dCogs}
                    onChange={setDCogs}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Shipping Costs</FieldLabel>
                  <NumberInput
                    value={dLogistics}
                    onChange={setDLogistics}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Platform Fee</FieldLabel>
                  <NumberInput
                    value={dPlatform}
                    onChange={setDPlatform}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between rounded-lg bg-zinc-50 px-3.5 py-2.5 text-[13px] text-zinc-500">
                <span>Base Grand Total</span>
                <span className="font-mono font-bold text-zinc-900">
                  {fmtCAD(discount.grandTotal)}
                </span>
              </div>
            </Card>

            <Card title="Discount Scenarios">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[760px] border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-zinc-200">
                      {[
                        "Discount",
                        "Disc. Subtotal",
                        "New Grand Total",
                        "Platform Fee",
                        "Total Cost",
                        "Profit",
                        "Margin",
                      ].map((col, i) => (
                        <th
                          key={col}
                          className={[
                            "px-3 py-2 text-right text-[10.5px] font-bold tracking-[0.07em] uppercase whitespace-nowrap text-zinc-400",
                            i === 0 ? "text-left" : "",
                          ].join(" ")}
                        >
                          {col}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {discount.scenarios.map((s) => {
                      const m = marginStyle(s.margin);
                      return (
                        <tr
                          key={s.disc}
                          className="border-b border-zinc-100 hover:bg-zinc-50"
                        >
                          <td className="px-3 py-2.5 text-left font-sans font-bold text-zinc-900">
                            {s.disc}%
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            {fmtCAD(s.discSubtotal)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            {fmtCAD(s.newGrandTotal)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            {fmtCAD(s.pfAmt)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            {fmtCAD(s.totalCost)}
                          </td>
                          <td
                            className={[
                              "px-3 py-2.5 text-right font-mono font-bold",
                              s.profit < 0
                                ? "text-red-500"
                                : "text-emerald-500",
                            ].join(" ")}
                          >
                            {fmtCAD(s.profit)}
                          </td>
                          <td className="px-3 py-2.5 text-right font-mono">
                            <span
                              className={[
                                "inline-block rounded-full px-2 py-0.5 text-xs font-bold",
                                m.badge,
                              ].join(" ")}
                            >
                              {fmtPct(s.margin)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        ) : null}

        {activeTab === "match" ? (
          <section className="grid gap-5 md:grid-cols-2">
            <Card title="Inputs">
              <div className="space-y-3.5">
                <div>
                  <FieldLabel>Competitor Price</FieldLabel>
                  <NumberInput
                    value={mPrice}
                    onChange={setMPrice}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Province</FieldLabel>
                  <select
                    className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 pr-8 text-sm outline-none transition focus:border-zinc-900"
                    value={mProvince}
                    onChange={(e) => {
                      const p = e.target.value;
                      setMProvince(p);
                      setMTaxRate(String(PROVINCE_TAX[p]));
                    }}
                  >
                    {Object.keys(PROVINCE_TAX).map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <FieldLabel>Tax Rate</FieldLabel>
                  <NumberInput
                    value={mTaxRate}
                    onChange={setMTaxRate}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
                <div>
                  <FieldLabel>Lightspeed Cost (incl. taxes)</FieldLabel>
                  <NumberInput
                    value={mCogs}
                    onChange={setMCogs}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Shipping Costs</FieldLabel>
                  <NumberInput
                    value={mLogistics}
                    onChange={setMLogistics}
                    prefix="$"
                    min={0}
                  />
                </div>
                <div>
                  <FieldLabel>Platform Fee</FieldLabel>
                  <NumberInput
                    value={mPlatform}
                    onChange={setMPlatform}
                    suffix="%"
                    min={0}
                    max={100}
                  />
                </div>
              </div>
            </Card>

            <Card title="Results" sticky>
              <div className="space-y-2">
                <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                  <span className="text-[13px] text-zinc-500">
                    Competitor Grand Total
                  </span>
                  <span className="font-mono text-sm font-semibold">
                    {fmtCAD(match.grandTotal)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                  <span className="text-[13px] text-zinc-500">
                    Platform Fee ($)
                  </span>
                  <span className="font-mono text-sm font-semibold">
                    {fmtCAD(match.pfAmt)}
                  </span>
                </div>
                <div className="flex items-center justify-between border-b border-zinc-100 py-2">
                  <span className="text-[13px] text-zinc-500">Total Cost</span>
                  <span className="font-mono text-sm font-semibold">
                    {fmtCAD(match.totalCost)}
                  </span>
                </div>

                <div className="my-3 h-px bg-zinc-200" />

                <div className="flex items-center justify-between py-2">
                  <span className="text-[13px] text-zinc-500">Profit</span>
                  <span
                    className={[
                      "font-mono text-[19px] font-extrabold",
                      match.profit < 0 ? "text-red-500" : "text-emerald-500",
                    ].join(" ")}
                  >
                    {fmtCAD(match.profit)}
                  </span>
                </div>

                <div
                  className={[
                    "mt-4 rounded-lg p-5 text-center",
                    matchMarginVisual.bg,
                  ].join(" ")}
                >
                  <div
                    className={[
                      "mb-1.5 text-[10.5px] font-bold tracking-[0.1em] uppercase",
                      matchMarginVisual.color,
                    ].join(" ")}
                  >
                    Profit Margin
                  </div>
                  <div
                    className={[
                      "font-mono text-4xl font-black sm:text-[44px]",
                      matchMarginVisual.color,
                    ].join(" ")}
                  >
                    {fmtPct(match.margin)}
                  </div>
                </div>
              </div>
            </Card>
          </section>
        ) : null}

        {activeTab === "wholesale" ? (
          <section>
            {/* Warning Banner */}
            <div className="mb-4 rounded-lg border border-red-300 bg-red-50 px-4 py-3.5">
              <p className="text-[13px] font-semibold text-red-700">
                ⚠️ Singh Electronics Private Label Items
              </p>
              <p className="mt-1 text-[12.5px] leading-[1.6] text-red-600">
                Pricing for Singh Electronics private label items (e.g. 0 gauge wire spools and similar products) must always be sourced directly from the Google Sheets or the Wholesale Distribution website — do not use this calculator for those items. The same applies to any US brands we carry (e.g. Skar Audio, CT Sounds, Deaf Bonce).
              </p>
            </div>

            {/* Instructions Note */}
            <div className="mb-4 rounded-lg border border-zinc-200 bg-zinc-50 px-4 py-3.5">
              <p className="text-[12.5px] leading-[1.6] text-zinc-600">
                Use the <span className="font-semibold text-zinc-800">Other</span> row to calculate wholesale pricing for any brand not listed above. Adjust the divisor based on your target margin — for example, a divisor of <span className="font-mono font-semibold">0.80</span> gives a 20% margin, and <span className="font-mono font-semibold">0.70</span> gives a 30% margin. If you are unsure which divisor to use, please check with management before proceeding.
              </p>
            </div>

            <Card title="Wholesale Pricing Sheet">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[720px] border-collapse text-[13px]">
                  <thead>
                    <tr className="border-b-2 border-zinc-200">
                      <th className="px-3.5 py-2.5 text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-zinc-400">
                        Brand Name
                      </th>
                      <th className="px-3.5 py-2.5 text-right text-[10.5px] font-bold tracking-[0.08em] uppercase text-zinc-400">
                        Divisor
                      </th>
                      <th className="px-3.5 py-2.5 text-left text-[10.5px] font-bold tracking-[0.08em] uppercase text-zinc-400">
                        Dealer Cost
                      </th>
                      <th className="px-3.5 py-2.5 text-right text-[10.5px] font-bold tracking-[0.08em] uppercase text-zinc-400">
                        Wholesale Price
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {WHOLESALE_BRANDS.map((brand) => {
                      const cost = toNum(wsCosts[brand.key] ?? "");
                      const divisor =
                        brand.key === "other"
                          ? Number.parseFloat(wsOtherDivisor)
                          : brand.divisor;
                      const validDivisor =
                        Number.isFinite(divisor) &&
                        (divisor as number) > 0 &&
                        (divisor as number) < 1;
                      const price =
                        cost > 0 && validDivisor
                          ? cost / (divisor as number)
                          : null;

                      return (
                        <tr
                          key={brand.key}
                          className="border-b border-zinc-100 hover:bg-zinc-50"
                        >
                          <td className="px-3.5 py-2.5 text-left text-[13px] font-bold whitespace-nowrap text-zinc-900">
                            {brand.label}
                          </td>
                          <td className="px-3.5 py-2.5 text-right">
                            {brand.key === "other" ? (
                              <div className="ml-auto flex max-w-[100px] overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-zinc-900">
                                <input
                                  type="number"
                                  value={wsOtherDivisor}
                                  onChange={(e) =>
                                    setWsOtherDivisor(e.target.value)
                                  }
                                  min={0.01}
                                  max={0.99}
                                  step={0.01}
                                  placeholder="0.85"
                                  className="w-full bg-transparent px-2 py-1.5 text-right font-mono text-[13px] outline-none"
                                />
                              </div>
                            ) : (
                              <span className="inline-block rounded-md bg-zinc-100 px-2.5 py-1 font-mono text-[13px] font-semibold text-zinc-500">
                                {brand.divisor?.toFixed(2)}
                              </span>
                            )}
                          </td>
                          <td className="w-[160px] px-3.5 py-2.5">
                            <div className="flex overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 focus-within:border-zinc-900">
                              <span className="flex items-center border-r border-zinc-200 bg-zinc-100 px-2 text-[13px] text-zinc-400">
                                $
                              </span>
                              <input
                                type="number"
                                value={wsCosts[brand.key] ?? ""}
                                onChange={(e) =>
                                  setWsCosts((prev) => ({
                                    ...prev,
                                    [brand.key]: e.target.value,
                                  }))
                                }
                                min={0}
                                step="any"
                                placeholder="0.00"
                                className="w-full bg-transparent px-2.5 py-2 font-mono text-[13px] outline-none"
                              />
                            </div>
                          </td>
                          <td className="px-3.5 py-2.5 text-right font-mono text-[15px] font-bold whitespace-nowrap text-zinc-400">
                            <span
                              className={
                                price !== null
                                  ? "text-emerald-500"
                                  : "text-zinc-400"
                              }
                            >
                              {fmtCAD(price)}
                            </span>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </Card>
          </section>
        ) : null}
      </div>
    </main>
  );
}

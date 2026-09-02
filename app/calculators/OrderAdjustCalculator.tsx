"use client";

import { useState, useMemo } from "react";
import { FieldLabel, NumberInput, Card } from "./components";
import { PROVINCE_TAX } from "./interface";
import {
  parseCents,
  fmtC,
  calculateAdjustment,
  makeOrderItem,
  WEBSITE_COUPONS,
  STANDARD_SHIPPING,
  FREE_SHIPPING_THRESHOLD,
  type DiscountMode,
  type ShippingMode,
  type OrderItem,
  type WebsiteCoupon,
} from "./orderAdjustLib";

// ─── Item Row ─────────────────────────────────────────────────────────────────

function ItemRow({
  item, index, canRemove, onChange, onRemove,
}: {
  item: OrderItem; index: number; canRemove: boolean;
  onChange: (patch: Partial<OrderItem>) => void; onRemove: () => void;
}) {
  const price = parseCents(item.unitPrice);
  const qty = parseInt(item.quantity, 10);
  return (
    <div className="rounded-lg border border-zinc-200 bg-zinc-50 p-3.5">
      <div className="mb-2.5 flex items-center justify-between">
        <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-400">Item {index + 1}</span>
        {canRemove && (
          <button type="button" onClick={onRemove} className="text-[11px] font-semibold text-red-400 hover:text-red-600 transition">Remove</button>
        )}
      </div>
      <div className="mb-2">
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Product / SKU (optional)</label>
        <input type="text" value={item.name} onChange={(e) => onChange({ name: e.target.value })} placeholder="e.g. Pioneer TS-A301D4"
          className="w-full rounded-lg border border-zinc-200 bg-white px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900" />
      </div>
      <div className="grid grid-cols-3 gap-2">
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Unit Price</label>
          <NumberInput value={item.unitPrice} onChange={(v) => onChange({ unitPrice: v })} prefix="$" min={0} />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Qty</label>
          <NumberInput value={item.quantity} onChange={(v) => onChange({ quantity: v })} min={1} placeholder="1" />
        </div>
        <div>
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Fixed Ship</label>
          <NumberInput value={item.fixedShipping} onChange={(v) => onChange({ fixedShipping: v })} prefix="$" min={0} placeholder="0.00" />
        </div>
      </div>
      {price !== null && qty > 0 && (
        <div className="mt-2 text-right text-[11px] text-zinc-400">
          Subtotal: <span className="font-semibold text-zinc-700">{fmtC(price * qty)}</span>
        </div>
      )}
    </div>
  );
}

// ─── Main Calculator ──────────────────────────────────────────────────────────

export function OrderAdjustCalculator() {
  // Original order
  const [origGrandTotal, setOrigGrandTotal] = useState("");
  const [province, setProvince] = useState("Ontario");
  const [redo, setRedo] = useState("");
  const [origShipping, setOrigShipping] = useState("");

  // Discount
  const [discountMode, setDiscountMode] = useState<DiscountMode>("none");
  const [selectedCouponCode, setSelectedCouponCode] = useState(WEBSITE_COUPONS[0].code);
  const [manualPct, setManualPct] = useState("");

  // Shipping handling
  const [shippingMode, setShippingMode] = useState<ShippingMode>("keep");
  const [manualShipping, setManualShipping] = useState("");
  const [applyStandardShipping, setApplyStandardShipping] = useState(false);

  // Final order items
  const [items, setItems] = useState<OrderItem[]>([makeOrderItem()]);

  // ── Derived ──────────────────────────────────────────────────────────────

  const origCents = parseCents(origGrandTotal);
  const redoCents = parseCents(redo) ?? 0;
  const origShippingCents = parseCents(origShipping) ?? 0;
  const manualShippingCents = parseCents(manualShipping) ?? 0;
  const selectedCoupon: WebsiteCoupon | null = WEBSITE_COUPONS.find((c) => c.code === selectedCouponCode) ?? null;

  const rawMerchandiseCents = useMemo(() => {
    let total = 0;
    for (const item of items) {
      const price = parseCents(item.unitPrice);
      const qty = parseInt(item.quantity, 10);
      if (price !== null && qty > 0) total += Math.round(price * qty);
    }
    return total;
  }, [items]);

  const hasFixedShipping = items.some((i) => (parseCents(i.fixedShipping) ?? 0) > 0);
  const isFreeShipCoupon = discountMode === "coupon" && selectedCoupon?.type === "free-shipping";
  const needsShippingPrompt =
    shippingMode === "recalculate" &&
    !isFreeShipCoupon &&
    !hasFixedShipping &&
    rawMerchandiseCents > 0 &&
    rawMerchandiseCents < FREE_SHIPPING_THRESHOLD;

  const result = useMemo(() => {
    if (origCents === null || !province) return null;
    return calculateAdjustment({
      originalGrandTotal: origCents,
      province,
      provinceTaxRates: PROVINCE_TAX,
      redoAmount: redoCents,
      originalShipping: origShippingCents,
      shippingMode,
      manualShipping: manualShippingCents,
      items,
      discountMode,
      selectedCoupon: discountMode === "coupon" ? selectedCoupon : null,
      manualPct,
      applyStandardShipping,
    });
  }, [origCents, province, redoCents, origShippingCents, shippingMode, manualShippingCents, items, discountMode, selectedCoupon, manualPct, applyStandardShipping]);

  // ── Helpers ───────────────────────────────────────────────────────────────

  const updateItem = (id: string, patch: Partial<OrderItem>) =>
    setItems((prev) => prev.map((i) => (i.id === id ? { ...i, ...patch } : i)));
  const removeItem = (id: string) => setItems((prev) => prev.filter((i) => i.id !== id));

  const reset = () => {
    setOrigGrandTotal(""); setProvince("Ontario"); setRedo(""); setOrigShipping("");
    setDiscountMode("none"); setSelectedCouponCode(WEBSITE_COUPONS[0].code); setManualPct("");
    setShippingMode("keep"); setManualShipping(""); setApplyStandardShipping(false);
    setItems([makeOrderItem()]);
  };

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
      {/* LEFT — Inputs */}
      <div className="space-y-5">

        {/* Original Order */}
        <Card title="Original Order">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <FieldLabel>Original Grand Total</FieldLabel>
              <NumberInput value={origGrandTotal} onChange={setOrigGrandTotal} prefix="$" min={0} />
            </div>
            <div>
              <FieldLabel>Province / Territory</FieldLabel>
              <select value={province} onChange={(e) => setProvince(e.target.value)}
                className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900">
                <option value="">— Select —</option>
                {Object.entries(PROVINCE_TAX).sort(([a], [b]) => a.localeCompare(b)).map(([p, r]) => (
                  <option key={p} value={p}>{p} ({r}%)</option>
                ))}
              </select>
            </div>
            <div>
              <FieldLabel>Re-Do (stays fixed)</FieldLabel>
              <NumberInput value={redo} onChange={setRedo} prefix="$" min={0} placeholder="0.00" />
              <p className="mt-1 text-[10px] text-zinc-400">Re-Do is never recalculated or discounted.</p>
            </div>
            <div>
              <FieldLabel>Original Shipping</FieldLabel>
              <NumberInput value={origShipping} onChange={setOrigShipping} prefix="$" min={0} placeholder="0.00" />
              <p className="mt-1 text-[10px] text-zinc-400">What the customer paid for shipping on the original order.</p>
            </div>
          </div>
        </Card>

        {/* Discount */}
        <Card title="Discount">
          <div className="flex gap-4 flex-wrap mb-3">
            {(["none", "coupon", "manual"] as DiscountMode[]).map((mode) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700">
                <input type="radio" name="discountMode" checked={discountMode === mode} onChange={() => setDiscountMode(mode)} className="accent-zinc-900" />
                {mode === "none" ? "No Discount" : mode === "coupon" ? "Website Coupon" : "Manual Discount %"}
              </label>
            ))}
          </div>
          {discountMode === "coupon" && (
            <select value={selectedCouponCode} onChange={(e) => setSelectedCouponCode(e.target.value)}
              className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900">
              {WEBSITE_COUPONS.map((c) => (<option key={c.code} value={c.code}>{c.label}</option>))}
            </select>
          )}
          {discountMode === "manual" && (
            <div className="w-48">
              <NumberInput value={manualPct} onChange={setManualPct} suffix="%" min={0} max={100} placeholder="0.00" />
            </div>
          )}
        </Card>

        {/* Shipping Handling */}
        <Card title="Shipping Handling">
          <div className="flex gap-4 flex-wrap mb-3">
            {([
              ["keep", "Keep Original Shipping"],
              ["recalculate", "Recalculate Shipping"],
              ["manual", "Manual Shipping"],
            ] as [ShippingMode, string][]).map(([mode, label]) => (
              <label key={mode} className="flex items-center gap-2 cursor-pointer text-sm text-zinc-700">
                <input type="radio" name="shippingMode" checked={shippingMode === mode} onChange={() => setShippingMode(mode)} className="accent-zinc-900" />
                {label}
              </label>
            ))}
          </div>

          {shippingMode === "keep" && (
            <p className="text-[12px] text-zinc-400">
              New shipping = Original Shipping ({origShippingCents > 0 ? fmtC(origShippingCents) : "$0.00"}). Will not change even if merchandise total exceeds $200.
            </p>
          )}

          {shippingMode === "manual" && (
            <div className="w-48">
              <FieldLabel>New Shipping Amount</FieldLabel>
              <NumberInput value={manualShipping} onChange={setManualShipping} prefix="$" min={0} placeholder="0.00" />
            </div>
          )}

          {shippingMode === "recalculate" && (
            <p className="text-[12px] text-zinc-400">
              Shipping will be recalculated using standard Website rules ($200 threshold, fixed shipping, FREESHIP).
            </p>
          )}
        </Card>

        {/* Final Order Items */}
        <Card title="Final Order Items — All Items Remaining on the Order">
          <p className="mb-3 rounded-lg border border-blue-100 bg-blue-50 px-3.5 py-2.5 text-[12px] text-blue-700">
            Enter <strong>all items that will remain on the order</strong> after the requested change — including existing items that are not being removed. Do not enter only the new item.
          </p>

          <div className="space-y-3">
            {items.map((item, idx) => (
              <ItemRow key={item.id} item={item} index={idx} canRemove={items.length > 1}
                onChange={(patch) => updateItem(item.id, patch)} onRemove={() => removeItem(item.id)} />
            ))}
          </div>

          <button type="button" onClick={() => setItems((prev) => [...prev, makeOrderItem()])}
            className="mt-3 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-white px-3.5 py-2.5 text-[12px] font-semibold text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-700">
            + Add Item
          </button>

          {rawMerchandiseCents > 0 && (
            <div className="mt-3 flex justify-between rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5">
              <span className="text-[13px] font-semibold text-zinc-600">Raw Merchandise Total</span>
              <span className="font-mono text-[13px] font-bold text-zinc-900">{fmtC(rawMerchandiseCents)}</span>
            </div>
          )}
        </Card>

        {/* Standard shipping prompt (recalculate mode only) */}
        {needsShippingPrompt && (
          <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3.5 flex items-center justify-between gap-4">
            <div>
              <p className="text-[12.5px] font-semibold text-amber-800">Order is below {fmtC(FREE_SHIPPING_THRESHOLD)} before tax</p>
              <p className="text-[11px] text-amber-700 mt-0.5">Standard ${(STANDARD_SHIPPING / 100).toFixed(2)} shipping applies. Apply it?</p>
            </div>
            <div className="flex gap-2 shrink-0">
              <button type="button" onClick={() => setApplyStandardShipping(true)}
                className={["rounded border px-3 py-1.5 text-[12px] font-semibold transition",
                  applyStandardShipping ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"].join(" ")}>
                Apply $14.99
              </button>
              <button type="button" onClick={() => setApplyStandardShipping(false)}
                className={["rounded border px-3 py-1.5 text-[12px] font-semibold transition",
                  !applyStandardShipping ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-300 bg-white text-zinc-700 hover:border-zinc-500"].join(" ")}>
                Skip
              </button>
            </div>
          </div>
        )}
      </div>

      {/* RIGHT — Result */}
      <div className="space-y-4">
        <Card title="Order Breakdown" sticky>
          {!result ? (
            <p className="text-[13px] text-zinc-400 italic">Enter the original grand total and province to see the breakdown.</p>
          ) : (
            <div className="space-y-1.5 text-[13px]">
              <div className="flex justify-between border-b border-zinc-100 pb-2">
                <span className="text-zinc-500">Original Grand Total</span>
                <span className="font-mono font-semibold">{fmtC(result.originalGrandTotal)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Raw Merchandise</span>
                <span className="font-mono">{fmtC(result.rawMerchandise)}</span>
              </div>
              {result.discountAmount > 0 && (
                <div className="flex justify-between py-0.5">
                  <span className="text-zinc-500">{result.discountLabel}</span>
                  <span className="font-mono text-red-500">−{fmtC(result.discountAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-600 font-medium">Discounted Merchandise</span>
                <span className="font-mono font-semibold">{fmtC(result.discountedMerchandise)}</span>
              </div>
              {result.redoAmount > 0 && (
                <div className="flex justify-between py-0.5">
                  <span className="text-zinc-500">Re-Do</span>
                  <span className="font-mono">{fmtC(result.redoAmount)}</span>
                </div>
              )}
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">{result.shippingLabel}</span>
                <span className="font-mono">{fmtC(result.shippingAmount)}</span>
              </div>
              <div className="flex justify-between py-0.5">
                <span className="text-zinc-500">Tax ({PROVINCE_TAX[province] ?? 0}%)</span>
                <span className="font-mono">{fmtC(result.taxAmount)}</span>
              </div>
              <div className="flex justify-between border-t border-zinc-200 pt-2 mt-1">
                <span className="font-semibold text-zinc-900">New Grand Total</span>
                <span className="font-mono font-bold">{fmtC(result.newGrandTotal)}</span>
              </div>
            </div>
          )}
        </Card>

        {/* Final adjustment — GREEN for price diff, RED for refund */}
        {result && (() => {
          const diff = result.difference;
          const isRefund = diff < 0;
          const isZero = diff === 0;
          const absDiff = Math.abs(diff);

          // Price Diff (customer pays us) = GREEN
          // Partial Refund (we pay customer) = RED
          const bg = isZero
            ? "bg-zinc-50 border-zinc-200"
            : isRefund
            ? "bg-red-50 border-red-300"
            : "bg-emerald-50 border-emerald-300";
          const textColor = isZero ? "text-zinc-700" : isRefund ? "text-red-700" : "text-emerald-700";
          const amtColor = isZero ? "text-zinc-900" : isRefund ? "text-red-700" : "text-emerald-700";

          return (
            <div className={`rounded-xl border-2 p-4 ${bg}`}>
              <div className={`text-[11px] font-bold uppercase tracking-[0.08em] mb-1 ${textColor}`}>
                {isZero ? "No Difference" : isRefund ? "Partial Refund" : "Price Difference"}
              </div>
              {isZero ? (
                <p className="text-[13px] text-zinc-500">No payment or refund required.</p>
              ) : (
                <div className="flex items-baseline justify-between">
                  <span className={`text-[13px] font-medium ${textColor}`}>
                    {isRefund ? "Refund Customer:" : "Customer Needs to Pay:"}
                  </span>
                  <span className={`font-mono text-[22px] font-extrabold ${amtColor}`}>
                    {fmtC(absDiff)}
                  </span>
                </div>
              )}
            </div>
          );
        })()}

        <button type="button" onClick={reset}
          className="w-full rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700">
          Reset Calculator
        </button>
      </div>
    </div>
  );
}

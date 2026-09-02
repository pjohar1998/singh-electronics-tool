"use client";

import Link from "next/link";
import { useState, useCallback } from "react";
import { FieldLabel, NumberInput, Card } from "../calculators/components";
import {
  fmtMoney,
  parseMoney,
  calculateCogsItemFinal,
  calculateTotalCogs,
  calculateWebsitePM,
  buildWebsiteNote,
  calculateAmazonPM,
  buildAmazonNote,
  calculateBestBuyPM,
  buildBestBuyNote,
  calculateWalmartPM,
  buildWalmartNote,
  WEBSITE_ROUTE_TAX_RATES,
  WALMART_COMMISSION_RATES,
  DEFAULT_WALMART_CATEGORY,
  defaultCogsItems,
  makeCogsItem,
  type CogsItem,
  type BrandType,
  type WebsitePaymentMethod,
} from "./lib";

type Platform = "website" | "amazon" | "bestbuy" | "walmart";

// ─── Helpers ─────────────────────────────────────────────────────────────────

/** Blank string → null. Otherwise parse as number. */
function parseOptional(raw: string): number | null {
  if (raw.trim() === "") return null;
  return parseMoney(raw);
}

// ─── Multi-item COGS ─────────────────────────────────────────────────────────

function MultiItemCogs({ items, onChange }: { items: CogsItem[]; onChange: (items: CogsItem[]) => void }) {
  const updateItem = (id: string, patch: Partial<CogsItem>) =>
    onChange(items.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  const addItem = () => onChange([...items, makeCogsItem()]);
  const removeItem = (id: string) => { if (items.length > 1) onChange(items.filter((i) => i.id !== id)); };
  const totalCogs = calculateTotalCogs(items);

  return (
    <div>
      <FieldLabel>COGS</FieldLabel>
      <div className="space-y-3">
        {items.map((item, idx) => {
          const amt = parseMoney(item.amount);
          const itemFinal = calculateCogsItemFinal(item);
          return (
            <div key={item.id} className="rounded-lg border border-zinc-200 bg-zinc-50 p-3">
              <div className="mb-2 flex items-center justify-between">
                <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Item {idx + 1}</span>
                {items.length > 1 && (
                  <button type="button" onClick={() => removeItem(item.id)}
                    className="rounded px-2 py-0.5 text-[11px] font-semibold text-red-400 transition hover:bg-red-50 hover:text-red-600">
                    Remove
                  </button>
                )}
              </div>
              <div className="grid gap-2 sm:grid-cols-2">
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Cost (before taxes)</label>
                  <NumberInput value={item.amount} onChange={(v) => updateItem(item.id, { amount: v })} prefix="$" min={0} />
                </div>
                <div>
                  <label className="mb-1 block text-[10px] font-semibold uppercase tracking-[0.06em] text-zinc-400">Brand</label>
                  <div className="flex gap-2">
                    {(["us", "cad"] as BrandType[]).map((b) => (
                      <button key={b} type="button" onClick={() => updateItem(item.id, { brand: b })}
                        className={["flex-1 rounded-lg border py-2 text-[12px] font-semibold transition",
                          item.brand === b ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"].join(" ")}>
                        {b === "us" ? "🇺🇸 US" : "🇨🇦 CAD"}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
              {amt !== null && item.brand !== null && itemFinal !== null && (
                <div className="mt-2 text-right text-[12px] text-zinc-500">
                  Final: <span className="font-semibold text-zinc-800">{fmtMoney(itemFinal)}</span>
                  {item.brand === "cad" && <span className="ml-1 text-zinc-400">(+13%)</span>}
                </div>
              )}
            </div>
          );
        })}
      </div>
      <button type="button" onClick={addItem}
        className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-lg border border-dashed border-zinc-300 bg-white px-3.5 py-2 text-[12px] font-semibold text-zinc-500 transition hover:border-zinc-500 hover:text-zinc-700">
        + Add Item
      </button>
      <div className="mt-3 flex items-center justify-between rounded-lg border border-zinc-200 bg-white px-3.5 py-2.5">
        <span className="text-[13px] font-semibold text-zinc-600">Total COGS</span>
        <span className="font-mono text-[15px] font-bold text-zinc-900">
          {totalCogs !== null ? fmtMoney(totalCogs) : <span className="text-[13px] font-normal text-zinc-400">Incomplete</span>}
        </span>
      </div>
    </div>
  );
}

// ─── Shared UI ───────────────────────────────────────────────────────────────

function OrderNoteBox({ note }: { note: string | null }) {
  const [copied, setCopied] = useState(false);
  const handleCopy = useCallback(() => {
    if (!note) return;
    navigator.clipboard.writeText(note).then(() => { setCopied(true); setTimeout(() => setCopied(false), 2000); });
  }, [note]);
  return (
    <div className="mt-4 overflow-hidden rounded-lg border border-zinc-200">
      <div className="flex items-center justify-between bg-zinc-900 px-3.5 py-2">
        <span className="text-[11px] font-semibold uppercase tracking-[0.06em] text-zinc-300">Order Note</span>
        <button type="button" onClick={handleCopy} disabled={!note}
          className={["rounded border px-2.5 py-1 font-mono text-[10px] uppercase tracking-[0.04em] transition",
            copied ? "border-emerald-500 bg-emerald-500 text-white"
              : note ? "border-white/30 bg-white/10 text-white hover:bg-white/20"
              : "cursor-not-allowed border-white/10 bg-white/5 text-white/30"].join(" ")}>
          {copied ? "Copied!" : "Copy Note"}
        </button>
      </div>
      <div className="min-h-[56px] bg-zinc-50 px-4 py-3.5 text-[13px] leading-[1.7] text-zinc-700">
        {note ?? <span className="italic text-zinc-400">Enter Grand Total to generate the order note.</span>}
      </div>
    </div>
  );
}

function SummaryRow({ label, value, deduction = false, bold = false }: { label: string; value: string; deduction?: boolean; bold?: boolean }) {
  return (
    <div className={["flex items-center justify-between py-1.5", bold ? "mt-1 border-t border-zinc-200 pt-2.5" : ""].join(" ")}>
      <span className={["text-[13px]", bold ? "font-semibold text-zinc-900" : "text-zinc-500"].join(" ")}>{label}</span>
      <span className={["font-mono text-[13px]", bold ? "text-[15px] font-bold text-zinc-900" : deduction ? "text-red-500" : "text-zinc-700"].join(" ")}>
        {deduction ? `−${value}` : value}
      </span>
    </div>
  );
}

function ResetButton({ onClick }: { onClick: () => void }) {
  return (
    <button type="button" onClick={onClick}
      className="rounded-lg border border-zinc-200 bg-white px-4 py-2 text-[12px] font-semibold uppercase tracking-[0.05em] text-zinc-500 transition hover:border-zinc-400 hover:text-zinc-700">
      Reset Calculator
    </button>
  );
}

// ─── Website ─────────────────────────────────────────────────────────────────

function WebsiteCalculator({ initials }: { initials: string }) {
  const [grandTotal, setGrandTotal] = useState("");
  const [cogsItems, setCogsItems] = useState<CogsItem[]>(defaultCogsItems());
  const [payment, setPayment] = useState<WebsitePaymentMethod | null>(null);
  const [route, setRoute] = useState("");
  const [province, setProvince] = useState("");
  const [shipping, setShipping] = useState("");
  const [insurance, setInsurance] = useState("100");

  const gt = parseMoney(grandTotal);
  // totalCogs: if null (incomplete items), treat as 0 for calculation
  const totalCogs = calculateTotalCogs(cogsItems) ?? 0;
  const routeVal = parseMoney(route) ?? 0;
  const shippingVal = parseOptional(shipping);
  const insuranceVal = parseOptional(insurance);
  const routeNeedsProvince = routeVal > 0 && !province;

  // Always calculate if we have grand total (other blanks = $0)
  const result = gt !== null && !routeNeedsProvince
    ? calculateWebsitePM({ grandTotal: gt, totalCogs, paymentMethod: payment, routePreTax: routeVal, province, shipping: shippingVal })
    : null;

  const note = result
    ? buildWebsiteNote({ finalPM: result.finalPM, finalCogs: result.finalCogs, finalRoute: result.finalRoute, shipping: shippingVal, insurance: insuranceVal, initials })
    : null;

  const reset = () => { setGrandTotal(""); setCogsItems(defaultCogsItems()); setPayment(null); setRoute(""); setProvince(""); setShipping(""); setInsurance("100"); };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel>Grand Total</FieldLabel><NumberInput value={grandTotal} onChange={setGrandTotal} prefix="$" min={0} /></div>
        <div>
          <FieldLabel>Shipping — our actual cost (optional)</FieldLabel>
          <NumberInput value={shipping} onChange={setShipping} prefix="$" min={0} placeholder="0.00" />
        </div>
      </div>

      <MultiItemCogs items={cogsItems} onChange={setCogsItems} />

      <div>
        <FieldLabel>Payment Method (optional)</FieldLabel>
        <div className="flex gap-2">
          {([["card", "💳 Credit Card / Apple Pay / Google Pay", "5%"], ["afterpay", "🔄 Afterpay / Sezzle", "8%"]] as [WebsitePaymentMethod, string, string][]).map(([id, label, pct]) => (
            <button key={id} type="button"
              onClick={() => setPayment(payment === id ? null : id)}
              className={["flex-1 rounded-lg border px-2 py-2.5 text-left text-[12px] font-semibold transition",
                payment === id ? "border-zinc-900 bg-zinc-900 text-white" : "border-zinc-200 bg-zinc-50 text-zinc-600 hover:border-zinc-400"].join(" ")}>
              {label}<span className="mt-0.5 block text-[10px] font-normal opacity-70">{pct} of Grand Total</span>
            </button>
          ))}
        </div>
        {payment && gt !== null && (
          <p className="mt-1.5 text-[12px] text-zinc-400">
            Payment fee: {fmtMoney(Math.round(gt * (payment === "card" ? 0.05 : 0.08) * 100) / 100)}
          </p>
        )}
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <FieldLabel>Re-Do (pre-tax, optional)</FieldLabel>
          <NumberInput value={route} onChange={setRoute} prefix="$" min={0} placeholder="0.00" />
        </div>
        <div>
          <FieldLabel>Province / Territory{routeVal > 0 ? " *" : ""}</FieldLabel>
          <select value={province} onChange={(e) => setProvince(e.target.value)} disabled={routeVal === 0}
            className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900 disabled:opacity-40">
            <option value="">— Select Province —</option>
            {Object.keys(WEBSITE_ROUTE_TAX_RATES).sort().map((p) => (
              <option key={p} value={p}>{p} ({(WEBSITE_ROUTE_TAX_RATES[p] * 100).toFixed(p === "Quebec" ? 3 : 0)}%)</option>
            ))}
          </select>
          {routeVal > 0 && province && (
            <p className="mt-1.5 text-[12px] text-zinc-400">Final Re-Do: {fmtMoney(Math.round(routeVal * (1 + WEBSITE_ROUTE_TAX_RATES[province]) * 100) / 100)}</p>
          )}
          {routeNeedsProvince && <p className="mt-1 text-[11px] text-red-500">Province required when Re-Do amount is entered.</p>}
        </div>
      </div>

      <div>
        <FieldLabel>Insurance (optional)</FieldLabel>
        <NumberInput value={insurance} onChange={setInsurance} prefix="$" min={0} placeholder="100" />
        {shippingVal === null && <p className="mt-1 text-[11px] text-zinc-400">Insurance only appears in note when Shipping is entered.</p>}
      </div>

      {result && (
        <Card title="Calculation Summary">
          <SummaryRow label="Grand Total" value={fmtMoney(gt!)} />
          {payment && result.paymentFee > 0 && <SummaryRow label={`Payment Fee (${payment === "card" ? "5" : "8"}%)`} value={fmtMoney(result.paymentFee)} deduction />}
          {result.finalRoute > 0 && <SummaryRow label="Re-Do" value={fmtMoney(result.finalRoute)} deduction />}
          {totalCogs > 0 && <SummaryRow label="Total COGS" value={fmtMoney(totalCogs)} deduction />}
          {shippingVal !== null && <SummaryRow label="Shipping" value={fmtMoney(shippingVal)} deduction />}
          <SummaryRow label="Final PM" value={fmtMoney(result.finalPM)} bold />
          {gt !== null && gt > 0 && result && (() => {
            const pct = (result.finalPM / gt) * 100;
            const approved = pct >= 15;
            const valid = isFinite(pct) && !isNaN(pct);
            if (!valid) return null;
            return (
              <div className="mt-2 rounded-lg border px-3.5 py-2.5 flex items-center justify-between"
                style={{ borderColor: approved ? '#16a34a' : '#dc2626', backgroundColor: approved ? '#f0fdf4' : '#fef2f2' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                    PM %
                  </span>
                  <span className="ml-2 text-[11px]" style={{ color: approved ? '#16a34a' : '#dc2626' }}>
                    {approved ? '✓ Approved' : '⚠ Slack Approval Required'}
                  </span>
                </div>
                <span className="font-mono text-[15px] font-bold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                  {pct.toFixed(2)}%
                </span>
              </div>
            );
          })()}
        </Card>
      )}

      <OrderNoteBox note={note} />
      <ResetButton onClick={reset} />
    </div>
  );
}

// ─── Amazon ───────────────────────────────────────────────────────────────────

function AmazonCalculator({ initials }: { initials: string }) {
  const [grandTotal, setGrandTotal] = useState("");
  const [cogsItems, setCogsItems] = useState<CogsItem[]>(defaultCogsItems());
  const [shipping, setShipping] = useState("");
  const [insurance, setInsurance] = useState("100");

  const gt = parseMoney(grandTotal);
  const totalCogs = calculateTotalCogs(cogsItems) ?? 0;
  const shippingVal = parseOptional(shipping);
  const insuranceVal = parseOptional(insurance);

  const result = gt !== null
    ? calculateAmazonPM({ grandTotal: gt, totalCogs, shipping: shippingVal })
    : null;

  const note = result
    ? buildAmazonNote({ finalPM: result.finalPM, finalCogs: result.finalCogs, shipping: shippingVal, insurance: insuranceVal, initials })
    : null;

  const reset = () => { setGrandTotal(""); setCogsItems(defaultCogsItems()); setShipping(""); setInsurance("100"); };

  return (
    <div className="space-y-5">
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3">
        <p className="text-[12.5px] font-semibold text-amber-800">⚠️ Important: Grand Total Source</p>
        <p className="mt-1 text-[12px] leading-[1.6] text-amber-700">
          Use the Grand Total shown in the <strong>Amazon order message/email received in Gmail</strong>. This amount is already after Amazon commission deductions. Do <strong>not</strong> use the total shown directly on the Amazon platform.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel>Grand Total (from Gmail)</FieldLabel><NumberInput value={grandTotal} onChange={setGrandTotal} prefix="$" min={0} /></div>
        <div>
          <FieldLabel>Shipping — our actual cost (optional)</FieldLabel>
          <NumberInput value={shipping} onChange={setShipping} prefix="$" min={0} placeholder="0.00" />
        </div>
      </div>

      <MultiItemCogs items={cogsItems} onChange={setCogsItems} />

      <div>
        <FieldLabel>Insurance — ADS (optional)</FieldLabel>
        <NumberInput value={insurance} onChange={setInsurance} prefix="$" min={0} placeholder="100" />
        {shippingVal === null && <p className="mt-1 text-[11px] text-zinc-400">Insurance only appears in note when Shipping is entered.</p>}
      </div>

      {result && (
        <Card title="Calculation Summary">
          <SummaryRow label="Grand Total" value={fmtMoney(gt!)} />
          {totalCogs > 0 && <SummaryRow label="Total COGS" value={fmtMoney(totalCogs)} deduction />}
          {shippingVal !== null && <SummaryRow label="Shipping" value={fmtMoney(shippingVal)} deduction />}
          <SummaryRow label="Final PM" value={fmtMoney(result.finalPM)} bold />
          {gt !== null && gt > 0 && result && (() => {
            const pct = (result.finalPM / gt) * 100;
            const approved = pct >= 15;
            const valid = isFinite(pct) && !isNaN(pct);
            if (!valid) return null;
            return (
              <div className="mt-2 rounded-lg border px-3.5 py-2.5 flex items-center justify-between"
                style={{ borderColor: approved ? '#16a34a' : '#dc2626', backgroundColor: approved ? '#f0fdf4' : '#fef2f2' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                    PM %
                  </span>
                  <span className="ml-2 text-[11px]" style={{ color: approved ? '#16a34a' : '#dc2626' }}>
                    {approved ? '✓ Approved' : '⚠ Slack Approval Required'}
                  </span>
                </div>
                <span className="font-mono text-[15px] font-bold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                  {pct.toFixed(2)}%
                </span>
              </div>
            );
          })()}
        </Card>
      )}

      <OrderNoteBox note={note} />
      <ResetButton onClick={reset} />
    </div>
  );
}

// ─── Best Buy ─────────────────────────────────────────────────────────────────

function BestBuyCalculator({ initials }: { initials: string }) {
  const [grandTotal, setGrandTotal] = useState("");
  const [cogsItems, setCogsItems] = useState<CogsItem[]>(defaultCogsItems());
  const [commissionFee, setCommissionFee] = useState("");
  const [shipping, setShipping] = useState("");
  const [insurance, setInsurance] = useState("100");

  const gt = parseMoney(grandTotal);
  const totalCogs = calculateTotalCogs(cogsItems) ?? 0;
  const commissionVal = parseOptional(commissionFee);
  const shippingVal = parseOptional(shipping);
  const insuranceVal = parseOptional(insurance);

  const result = gt !== null
    ? calculateBestBuyPM({ grandTotal: gt, totalCogs, commissionFee: commissionVal, shipping: shippingVal })
    : null;

  const note = result
    ? buildBestBuyNote({ finalPM: result.finalPM, finalCogs: result.finalCogs, commissionFee: commissionVal, shipping: shippingVal, insurance: insuranceVal, initials })
    : null;

  const reset = () => { setGrandTotal(""); setCogsItems(defaultCogsItems()); setCommissionFee(""); setShipping(""); setInsurance("100"); };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel>Grand Total</FieldLabel><NumberInput value={grandTotal} onChange={setGrandTotal} prefix="$" min={0} /></div>
        <div>
          <FieldLabel>Commission Fee (optional)</FieldLabel>
          <NumberInput value={commissionFee} onChange={setCommissionFee} prefix="$" min={0} placeholder="0.00" />
          <p className="mt-1 text-[11px] text-zinc-400">Enter the exact dollar amount shown on the Best Buy order.</p>
        </div>
        <div>
          <FieldLabel>Shipping — our actual cost (optional)</FieldLabel>
          <NumberInput value={shipping} onChange={setShipping} prefix="$" min={0} placeholder="0.00" />
        </div>
        <div>
          <FieldLabel>Insurance (optional)</FieldLabel>
          <NumberInput value={insurance} onChange={setInsurance} prefix="$" min={0} placeholder="100" />
          {shippingVal === null && <p className="mt-1 text-[11px] text-zinc-400">Insurance only appears in note when Shipping is entered.</p>}
        </div>
      </div>

      <MultiItemCogs items={cogsItems} onChange={setCogsItems} />

      {result && (
        <Card title="Calculation Summary">
          <SummaryRow label="Grand Total" value={fmtMoney(gt!)} />
          {totalCogs > 0 && <SummaryRow label="Total COGS" value={fmtMoney(totalCogs)} deduction />}
          {commissionVal !== null && <SummaryRow label="Commission Fee" value={fmtMoney(commissionVal)} deduction />}
          {shippingVal !== null && <SummaryRow label="Shipping" value={fmtMoney(shippingVal)} deduction />}
          <SummaryRow label="Final PM" value={fmtMoney(result.finalPM)} bold />
          {gt !== null && gt > 0 && result && (() => {
            const pct = (result.finalPM / gt) * 100;
            const approved = pct >= 15;
            const valid = isFinite(pct) && !isNaN(pct);
            if (!valid) return null;
            return (
              <div className="mt-2 rounded-lg border px-3.5 py-2.5 flex items-center justify-between"
                style={{ borderColor: approved ? '#16a34a' : '#dc2626', backgroundColor: approved ? '#f0fdf4' : '#fef2f2' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                    PM %
                  </span>
                  <span className="ml-2 text-[11px]" style={{ color: approved ? '#16a34a' : '#dc2626' }}>
                    {approved ? '✓ Approved' : '⚠ Slack Approval Required'}
                  </span>
                </div>
                <span className="font-mono text-[15px] font-bold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                  {pct.toFixed(2)}%
                </span>
              </div>
            );
          })()}
        </Card>
      )}

      <OrderNoteBox note={note} />
      <ResetButton onClick={reset} />
    </div>
  );
}

// ─── Walmart ──────────────────────────────────────────────────────────────────

function WalmartCalculator({ initials }: { initials: string }) {
  const [grandTotal, setGrandTotal] = useState("");
  const [cogsItems, setCogsItems] = useState<CogsItem[]>(defaultCogsItems());
  const [category, setCategory] = useState(DEFAULT_WALMART_CATEGORY);
  const [shipping, setShipping] = useState("");
  const [insurance, setInsurance] = useState("100");

  const gt = parseMoney(grandTotal);
  const totalCogs = calculateTotalCogs(cogsItems) ?? 0;
  const shippingVal = parseOptional(shipping);
  const insuranceVal = parseOptional(insurance);
  const categoryObj = WALMART_COMMISSION_RATES.find((c) => c.label === category) ?? WALMART_COMMISSION_RATES.find((c) => c.label === DEFAULT_WALMART_CATEGORY)!;
  const categoryRate = categoryObj.rate;

  const result = gt !== null
    ? calculateWalmartPM({ grandTotal: gt, totalCogs, categoryRate, shipping: shippingVal })
    : null;

  const note = result
    ? buildWalmartNote({ finalPM: result.finalPM, finalCogs: result.finalCogs, commissionFee: result.commissionFee, shipping: shippingVal, insurance: insuranceVal, initials })
    : null;

  const reset = () => { setGrandTotal(""); setCogsItems(defaultCogsItems()); setCategory(DEFAULT_WALMART_CATEGORY); setShipping(""); setInsurance("100"); };

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div><FieldLabel>Grand Total</FieldLabel><NumberInput value={grandTotal} onChange={setGrandTotal} prefix="$" min={0} /></div>
        <div>
          <FieldLabel>Shipping — our actual cost (optional)</FieldLabel>
          <NumberInput value={shipping} onChange={setShipping} prefix="$" min={0} placeholder="0.00" />
        </div>
        <div>
          <FieldLabel>Insurance (optional)</FieldLabel>
          <NumberInput value={insurance} onChange={setInsurance} prefix="$" min={0} placeholder="100" />
          {shippingVal === null && <p className="mt-1 text-[11px] text-zinc-400">Insurance only appears in note when Shipping is entered.</p>}
        </div>
      </div>

      <div>
        <FieldLabel>Product Category / Commission Rate</FieldLabel>
        <select value={category} onChange={(e) => setCategory(e.target.value)}
          className="w-full rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 text-sm text-zinc-900 outline-none transition focus:border-zinc-900">
          {WALMART_COMMISSION_RATES.map((c) => (
            <option key={c.label} value={c.label}>{c.label} — {(c.rate * 100).toFixed(0)}%</option>
          ))}
        </select>
        {gt !== null && (
          <p className="mt-1.5 text-[12px] text-zinc-400">
            Calculated Commission Fee: <span className="font-semibold text-zinc-700">{fmtMoney(Math.round(gt * categoryRate * 100) / 100)}</span>
          </p>
        )}
      </div>

      <MultiItemCogs items={cogsItems} onChange={setCogsItems} />

      {result && (
        <Card title="Calculation Summary">
          <SummaryRow label="Grand Total" value={fmtMoney(gt!)} />
          <SummaryRow label={`Commission Fee (${(categoryRate * 100).toFixed(0)}%)`} value={fmtMoney(result.commissionFee)} deduction />
          {totalCogs > 0 && <SummaryRow label="Total COGS" value={fmtMoney(totalCogs)} deduction />}
          {shippingVal !== null && <SummaryRow label="Shipping" value={fmtMoney(shippingVal)} deduction />}
          <SummaryRow label="Final PM" value={fmtMoney(result.finalPM)} bold />
          {gt !== null && gt > 0 && result && (() => {
            const pct = (result.finalPM / gt) * 100;
            const approved = pct >= 15;
            const valid = isFinite(pct) && !isNaN(pct);
            if (!valid) return null;
            return (
              <div className="mt-2 rounded-lg border px-3.5 py-2.5 flex items-center justify-between"
                style={{ borderColor: approved ? '#16a34a' : '#dc2626', backgroundColor: approved ? '#f0fdf4' : '#fef2f2' }}>
                <div>
                  <span className="text-[12px] font-semibold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                    PM %
                  </span>
                  <span className="ml-2 text-[11px]" style={{ color: approved ? '#16a34a' : '#dc2626' }}>
                    {approved ? '✓ Approved' : '⚠ Slack Approval Required'}
                  </span>
                </div>
                <span className="font-mono text-[15px] font-bold" style={{ color: approved ? '#15803d' : '#b91c1c' }}>
                  {pct.toFixed(2)}%
                </span>
              </div>
            );
          })()}
        </Card>
      )}

      <OrderNoteBox note={note} />
      <ResetButton onClick={reset} />
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

const PLATFORMS: { id: Platform; label: string; emoji: string }[] = [
  { id: "website", label: "Website", emoji: "🌐" },
  { id: "amazon", label: "Amazon", emoji: "📦" },
  { id: "bestbuy", label: "Best Buy", emoji: "🛒" },
  { id: "walmart", label: "Walmart", emoji: "🏪" },
];

export default function PMCalculatorPage() {
  const [platform, setPlatform] = useState<Platform>("website");
  const [initials, setInitials] = useState("");

  return (
    <main className="min-h-svh bg-[#f4f2ee] text-[#1a1814]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(221,217,208,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(221,217,208,0.25)_1px,transparent_1px)] [background-size:32px_32px]" />
      <div className="relative z-10 mx-auto w-full max-w-[900px] px-4 pb-16">
        <div className="pt-5 mb-6">
          <Link href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#b8b2a7] bg-white px-3.5 py-2 text-sm font-semibold text-[#4a463f] transition hover:border-[#1a1814] hover:text-[#1a1814]">
            ← Back to Home
          </Link>
        </div>

        <header className="mb-6 flex items-end justify-between gap-4 border-b-2 border-[#1a1814] pb-6 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <h1 className="font-mono text-xl font-medium tracking-[-0.02em]">PM Calculator</h1>
            <p className="mt-1 text-xs font-normal uppercase tracking-[0.04em] text-[#8a8278]">Singh Electronics · Internal Tool</p>
            <p className="mt-2 text-[12px] text-zinc-500 normal-case tracking-normal">⚠️ For store-location shipments only. Not suitable for estimating drop-shipping costs.</p>
          </div>
          <div className="shrink-0 rounded-sm bg-[#1a1814] px-2.5 py-1 font-mono text-[10px] font-medium uppercase tracking-[0.06em] text-[#f4f2ee]">Staff Use Only</div>
        </header>

        <div className="mb-6 rounded-xl border border-zinc-200 bg-white p-4 sm:p-5">
          <div className="flex items-center gap-4 max-[480px]:flex-col max-[480px]:items-start">
            <div className="shrink-0">
              <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.08em] text-zinc-500">Employee Initials</label>
              <input type="text" value={initials} onChange={(e) => setInitials(e.target.value)} placeholder="e.g. SM" maxLength={6}
                className="w-28 rounded-lg border border-zinc-200 bg-zinc-50 px-3 py-2.5 font-mono text-sm text-zinc-900 outline-none transition focus:border-zinc-900" />
            </div>
            <p className="max-w-[340px] text-[12.5px] leading-[1.5] text-zinc-400">
              Enter your initials once — they will appear in all generated order notes across every platform.
            </p>
          </div>
        </div>

        <div className="mb-6 flex gap-2 overflow-x-auto pb-1">
          {PLATFORMS.map((p) => (
            <button key={p.id} type="button" onClick={() => setPlatform(p.id)}
              className={["flex shrink-0 items-center gap-2 rounded-lg border px-4 py-2.5 text-[13px] font-semibold transition",
                platform === p.id ? "border-[#1a1814] bg-[#1a1814] text-white" : "border-zinc-200 bg-white text-zinc-600 hover:border-zinc-400"].join(" ")}>
              <span>{p.emoji}</span>{p.label}
            </button>
          ))}
        </div>

        <div className="rounded-xl border border-zinc-200 bg-white p-5 sm:p-6">
          <div className="mb-5">
            <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-[#c8420a]">
              — {PLATFORMS.find((p) => p.id === platform)?.label} PM Calculator
            </span>
          </div>
          {platform === "website" && <WebsiteCalculator initials={initials} />}
          {platform === "amazon" && <AmazonCalculator initials={initials} />}
          {platform === "bestbuy" && <BestBuyCalculator initials={initials} />}
          {platform === "walmart" && <WalmartCalculator initials={initials} />}
        </div>
      </div>
    </main>
  );
}

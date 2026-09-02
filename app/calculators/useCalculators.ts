import { useMemo, useState } from "react";
import {
  type MatchResult,
  type RetailResult,
  type TabId,
  DISCOUNT_RATES,
  PROVINCE_TAX,
  marginStyle,
  toNum,
} from "./interface";

export function useCalculators() {
  const [activeTab, setActiveTab] = useState<TabId>("discount");

  const [rCogs, setRCogs] = useState("");
  const [rShipping, setRShipping] = useState("");
  const [rPlatform, setRPlatform] = useState("");
  const [rMargin, setRMargin] = useState("");
  const [rTaxEnabled, setRTaxEnabled] = useState(true);

  const [dSubtotal, setDSubtotal] = useState("");
  const [dProvince, setDProvince] = useState("Ontario");
  const [dTaxRate, setDTaxRate] = useState(String(PROVINCE_TAX.Ontario));
  const [dCogs, setDCogs] = useState("");
  const [dLogistics, setDLogistics] = useState("");
  const [dPlatform, setDPlatform] = useState("");

  const [mPrice, setMPrice] = useState("");
  const [mProvince, setMProvince] = useState("Ontario");
  const [mTaxRate, setMTaxRate] = useState(String(PROVINCE_TAX.Ontario));
  const [mCogs, setMCogs] = useState("");
  const [mLogistics, setMLogistics] = useState("");
  const [mPlatform, setMPlatform] = useState("");

  const [wsCosts, setWsCosts] = useState<Record<string, string>>({});
  const [wsOtherDivisor, setWsOtherDivisor] = useState("");

  const retail = useMemo<RetailResult>(() => {
    const cogs = toNum(rCogs);
    const shipping = toNum(rShipping);
    const platformFee = toNum(rPlatform);
    const targetMargin = toNum(rMargin);

    const cogsWithTax = rTaxEnabled ? cogs * 1.13 : cogs;
    const totalCost = cogsWithTax + shipping;
    const divisor = 1 - platformFee / 100 - targetMargin / 100;
    const retailPrice = divisor <= 0 ? null : totalCost / divisor;
    const platformFeeAmt = retailPrice === null ? null : retailPrice * (platformFee / 100);
    const profit = retailPrice === null ? null : retailPrice - totalCost - (retailPrice * (platformFee / 100));
    const netMargin = retailPrice === null || retailPrice === 0 ? null : ((profit as number) / retailPrice) * 100;

    return { cogsWithTax, totalCost, retailPrice, platformFeeAmt, profit, netMargin };
  }, [rCogs, rShipping, rPlatform, rMargin, rTaxEnabled]);

  const discount = useMemo(() => {
    const subtotal = toNum(dSubtotal);
    const taxRate = toNum(dTaxRate);
    const cogs = toNum(dCogs);
    const logistics = toNum(dLogistics);
    const platformFee = toNum(dPlatform);

    const grandTotal = subtotal * (1 + taxRate / 100);
    const scenarios = DISCOUNT_RATES.map((disc) => {
      const discSubtotal = subtotal * (1 - disc / 100);
      const newGrandTotal = discSubtotal * (1 + taxRate / 100);
      const pfAmt = (platformFee / 100) * newGrandTotal;
      const totalCost = cogs + logistics + pfAmt;
      const profit = newGrandTotal - totalCost;
      const margin = newGrandTotal !== 0 ? (profit / newGrandTotal) * 100 : 0;
      return { disc, discSubtotal, newGrandTotal, pfAmt, totalCost, profit, margin };
    });

    return { grandTotal, scenarios };
  }, [dSubtotal, dTaxRate, dCogs, dLogistics, dPlatform]);

  const match = useMemo<MatchResult>(() => {
    const competitorPrice = toNum(mPrice);
    const taxRate = toNum(mTaxRate);
    const cogs = toNum(mCogs);
    const logistics = toNum(mLogistics);
    const platformFee = toNum(mPlatform);

    const grandTotal = competitorPrice * (1 + taxRate / 100);
    const pfAmt = (platformFee / 100) * grandTotal;
    const totalCost = cogs + logistics + pfAmt;
    const profit = grandTotal - totalCost;
    const margin = grandTotal !== 0 ? (profit / grandTotal) * 100 : 0;

    return { grandTotal, pfAmt, totalCost, profit, margin };
  }, [mPrice, mTaxRate, mCogs, mLogistics, mPlatform]);

  const matchMarginVisual = useMemo(() => marginStyle(match.margin), [match.margin]);

  return {
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
  };
}

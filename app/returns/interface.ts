export type Choice = {
  label: string;
  short?: string;
  next: string;
};

export type InfoType = "info" | "warn" | "success" | "danger";

export type TerminalType =
  | "approve"
  | "decline"
  | "escalate"
  | "direct"
  | "info-end";

export type BaseStep = {
  id: string;
  section: string;
  title?: string;
  body?: string;
  emailTemplate?: string;
  images?: { src: string; caption?: string }[];
};

export type QuestionStep = BaseStep & {
  type: "question";
  question: string;
  helpText?: string;
  choices: Choice[];
};

export type InfoStep = BaseStep & {
  type: "info";
  infoType?: InfoType;
  next: string;
};

export type TerminalStep = BaseStep & {
  type: "terminal";
  terminalType: TerminalType;
  emailTemplateDecline?: string;
  emailTemplateException?: string;
  emailTemplateCanada?: string;
  emailTemplateUS?: string;
};

export type Step = QuestionStep | InfoStep | TerminalStep;

export type StepsMap = Record<string, Step>;

export type HistoryItem = {
  stepId: string;
  choiceLabel: string;
};

export const LETTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

export const INFO_TONE_CLASS: Record<InfoType, string> = {
  info: "border-blue-300 bg-blue-50 text-blue-900",
  warn: "border-amber-300 bg-amber-50 text-amber-900",
  success: "border-emerald-300 bg-emerald-50 text-emerald-900",
  danger: "border-red-300 bg-red-50 text-red-900",
};

export const INFO_LABEL: Record<InfoType, string> = {
  info: "Required Step",
  warn: "Important Note",
  success: "Approved",
  danger: "Declined",
};

export const INFO_ICON: Record<InfoType, string> = {
  info: "ℹ",
  warn: "⚠",
  success: "✓",
  danger: "✕",
};

export const TERMINAL_LABEL: Record<TerminalType, string> = {
  approve: "Approved",
  decline: "Declined / Refused",
  escalate: "Escalate to Management",
  direct: "Direct to Manufacturer / Service Centre",
  "info-end": "Final Instruction",
};

export const TERMINAL_DOT_CLASS: Record<TerminalType, string> = {
  approve: "bg-emerald-500 text-emerald-800",
  decline: "bg-red-500 text-red-800",
  escalate: "bg-amber-500 text-amber-800",
  direct: "bg-blue-500 text-blue-800",
  "info-end": "bg-zinc-500 text-zinc-700",
};

import { memo } from "react";

type EmailTemplateProps = {
  label?: string;
  text: string;
  templateKey: string;
  copiedKey: string | null;
  onCopy: (text: string, key: string) => void;
};

function renderBold(text: string) {
  const parts = text.split(/(\*\*.*?\*\*)/g);
  return parts.map((part, i) =>
    part.startsWith("**") && part.endsWith("**")
      ? <strong key={i}>{part.slice(2, -2)}</strong>
      : <span key={i}>{part}</span>
  );
}

function stripBold(text: string) {
  return text.replace(/\*\*(.*?)\*\*/g, "$1");
}

export const EmailTemplate = memo(function EmailTemplate({
  label,
  text,
  templateKey,
  copiedKey,
  onCopy,
}: EmailTemplateProps) {
  return (
    <div className="mt-4">
      {label ? (
        <div className="mb-1.5 font-mono text-[11px] font-semibold tracking-[0.06em] text-zinc-500 uppercase">
          {label}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-md border border-zinc-200 bg-[#fafaf8]">
        <div className="flex items-center justify-between bg-zinc-900 px-3.5 py-2 text-[11px] font-medium tracking-[0.06em] text-zinc-100 uppercase">
          <span>Email Template</span>
          <button
            type="button"
            onClick={() => onCopy(stripBold(text), templateKey)}
            className={[
              "rounded border px-2.5 py-1 font-mono text-[10px] tracking-[0.04em] transition",
              copiedKey === templateKey
                ? "border-emerald-500 bg-emerald-500 text-white"
                : "border-white/30 bg-white/15 text-white hover:bg-white/25",
            ].join(" ")}
          >
            {copiedKey === templateKey ? "Copied" : "Copy"}
          </button>
        </div>
        <div className="whitespace-pre-wrap px-4 py-4 text-[13px] leading-[1.65] text-zinc-700">
          {text.split("\n").map((line, i) => (
            <span key={i}>
              {renderBold(line)}
              {"\n"}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
});

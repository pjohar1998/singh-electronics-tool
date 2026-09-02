import { memo, type ReactNode } from "react";

type FieldLabelProps = {
  children: ReactNode;
};

export const FieldLabel = memo(function FieldLabel({ children }: FieldLabelProps) {
  return (
    <label className="mb-1.5 block text-[11px] font-bold tracking-[0.08em] uppercase text-zinc-500">
      {children}
    </label>
  );
});

type NumberInputProps = {
  value: string;
  onChange?: (value: string) => void;
  prefix?: string;
  suffix?: string;
  disabled?: boolean;
  placeholder?: string;
  min?: number;
  max?: number;
};

export const NumberInput = memo(function NumberInput({
  value,
  onChange,
  prefix,
  suffix,
  disabled,
  placeholder = "0.00",
  min,
  max,
}: NumberInputProps) {
  return (
    <div className="flex overflow-hidden rounded-lg border border-zinc-200 bg-zinc-50 transition focus-within:border-zinc-900">
      {prefix ? (
        <span className="flex items-center border-r border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-400">
          {prefix}
        </span>
      ) : null}
      <input
        type="number"
        className="w-full bg-transparent px-3 py-2.5 text-sm text-zinc-900 outline-none disabled:cursor-not-allowed disabled:opacity-60"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
        disabled={disabled}
        placeholder={placeholder}
        min={min}
        max={max}
        step="any"
      />
      {suffix ? (
        <span className="flex items-center border-l border-zinc-200 bg-zinc-100 px-3 text-sm text-zinc-400">
          {suffix}
        </span>
      ) : null}
    </div>
  );
});

type CardProps = {
  title: string;
  children: ReactNode;
  sticky?: boolean;
};

export const Card = memo(function Card({ title, children, sticky = false }: CardProps) {
  return (
    <div
      className={[
        "rounded-xl border border-zinc-200 bg-white p-5 sm:p-6",
        sticky ? "md:sticky md:top-24" : "",
      ].join(" ")}
    >
      <div className="mb-4 text-[10.5px] font-bold tracking-[0.1em] uppercase text-zinc-400">{title}</div>
      {children}
    </div>
  );
});

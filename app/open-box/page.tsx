"use client";

import Link from "next/link";
import { EmailTemplate } from "../returns/components";
import {
  INFO_ICON,
  INFO_LABEL,
  INFO_TONE_CLASS,
  LETTERS,
  TERMINAL_DOT_CLASS,
  TERMINAL_LABEL,
  type StepsMap,
} from "../returns/interface";
import { OB_STEPS } from "./steps";
import { useReturnsWizard } from "../returns/useReturnsWizard";

const steps = OB_STEPS as StepsMap;

export default function OpenBoxPage() {
  const {
    history,
    currentStep,
    stepCount,
    progress,
    copiedKey,
    choose,
    goBack,
    resetWizard,
    continueInfo,
    copyTemplate,
  } = useReturnsWizard(steps, "ob_start");

  return (
    <main className="min-h-svh bg-[#f4f2ee] text-[#1a1814]">
      <div className="pointer-events-none fixed inset-0 z-0 bg-[linear-gradient(rgba(221,217,208,0.25)_1px,transparent_1px),linear-gradient(90deg,rgba(221,217,208,0.25)_1px,transparent_1px)] [background-size:32px_32px]" />

      <div className="relative z-10 mx-auto w-full max-w-[760px] px-4 pb-[60px]">
        <div className="mb-5">
          <Link
            href="/"
            className="inline-flex items-center gap-2 rounded-lg border border-[#b8b2a7] bg-white px-3.5 py-2 text-sm font-semibold text-[#4a463f] transition hover:border-[#1a1814] hover:text-[#1a1814]"
          >
            ← Back to Home
          </Link>
        </div>

        <header className="mb-8 flex items-end justify-between gap-4 border-b-2 border-[#1a1814] py-7 max-[520px]:flex-col max-[520px]:items-start">
          <div>
            <h1 className="font-mono text-xl font-medium tracking-[-0.02em]">
              Open Box Return Authorization Assistant
            </h1>
            <p className="mt-1 text-xs font-normal tracking-[0.04em] text-[#8a8278] uppercase">
              Singh Electronics · Internal Tool
            </p>
          </div>
          <div className="shrink-0 rounded-sm bg-[#1a1814] px-2.5 py-1 font-mono text-[10px] font-medium tracking-[0.06em] text-[#f4f2ee] uppercase">
            Staff Use Only
          </div>
        </header>

        <section className="mb-7">
          <div className="mb-2 flex items-center justify-between">
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#8a8278] uppercase">
              Step {stepCount + 1}
            </span>
            <span className="font-mono text-[11px] tracking-[0.06em] text-[#8a8278] uppercase">
              {progress}%
            </span>
          </div>
          <div className="h-[3px] overflow-hidden rounded-sm bg-[#ddd9d0]">
            <div
              className="h-full rounded-sm bg-[#c8420a] transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>
        </section>

        <section className="mb-6 flex min-h-[22px] flex-wrap gap-1.5">
          {history.map((item, index) => (
            <div
              key={`${item.stepId}-${index}`}
              title={item.choiceLabel}
              className="max-w-[220px] truncate rounded-sm border border-[#ddd9d0] bg-white px-2 py-0.5 font-mono text-[11px] text-[#8a8278]"
            >
              {index > 0 ? "→ " : ""}
              {item.choiceLabel}
            </div>
          ))}
        </section>

        {!currentStep ? (
          <section className="rounded-md border border-[#ddd9d0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)]">
            <p className="text-sm text-zinc-700">Step not found.</p>
          </section>
        ) : null}

        {currentStep?.type === "question" ? (
          <section className="mb-4 rounded-md border border-[#ddd9d0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] max-[520px]:p-5">
            <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-[#c8420a] uppercase before:inline-block before:h-0.5 before:w-4 before:bg-[#c8420a] before:content-['']">
              {currentStep.section}
            </div>
            <h2 className="mb-2 text-lg leading-[1.45] font-semibold text-[#1a1814]">
              {currentStep.question}
            </h2>

            {currentStep.helpText ? (
              <p className="mb-6 rounded-r border-l-[3px] border-[#b8b2a7] bg-[#f4f2ee] px-3.5 py-3 text-[13px] leading-[1.6] text-[#4a463f] whitespace-pre-wrap">
                {currentStep.helpText}
              </p>
            ) : null}

            <div className="flex flex-col gap-2">
              {currentStep.emailTemplate ? (
                <EmailTemplate
                  text={currentStep.emailTemplate}
                  templateKey={`${currentStep.id}-default`}
                  copiedKey={copiedKey}
                  onCopy={copyTemplate}
                />
              ) : null}
            </div>

            <div className="mt-4 flex flex-col gap-2">
              {currentStep.choices.map((choice, i) => (
                <button
                  key={`${choice.next}-${i}`}
                  type="button"
                  onClick={() => choose(choice)}
                  className="group flex w-full cursor-pointer items-start gap-2.5 rounded-[5px] border border-[#ddd9d0] bg-[#f4f2ee] px-4 py-3 text-left text-sm leading-[1.5] text-[#1a1814] transition hover:translate-x-[3px] hover:border-[#c8420a] hover:bg-[#f9ede8]"
                >
                  <span className="mt-0.5 flex h-[22px] w-[22px] min-w-[22px] items-center justify-center rounded-[3px] border border-[#ddd9d0] bg-white font-mono text-[11px] text-[#8a8278] transition group-hover:border-[#c8420a] group-hover:bg-[#c8420a] group-hover:text-white">
                    {LETTERS[i] ?? i + 1}
                  </span>
                  <span>{choice.label}</span>
                </button>
              ))}
            </div>
          </section>
        ) : null}

        {currentStep?.type === "info" ? (
          <section className="mb-4 rounded-md border border-[#ddd9d0] bg-white p-6 shadow-[0_2px_12px_rgba(0,0,0,0.06)] max-[520px]:p-5">
            <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-[#c8420a] uppercase before:inline-block before:h-0.5 before:w-4 before:bg-[#c8420a] before:content-['']">
              {currentStep.section}
            </div>

            {currentStep.title ? (
              <h2 className="mb-2 text-lg leading-[1.45] font-semibold text-[#1a1814]">
                {currentStep.title}
              </h2>
            ) : null}

            <div
              className={[
                "mt-3 rounded-[5px] border px-4 py-4 text-[13.5px] leading-[1.65] whitespace-pre-wrap",
                INFO_TONE_CLASS[currentStep.infoType ?? "info"],
              ].join(" ")}
            >
              <div className="mb-2 flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.08em] uppercase">
                {INFO_ICON[currentStep.infoType ?? "info"]}{" "}
                {INFO_LABEL[currentStep.infoType ?? "info"]}
              </div>
              {currentStep.body}
            </div>

            {currentStep.emailTemplate ? (
              <EmailTemplate
                text={currentStep.emailTemplate}
                templateKey={`${currentStep.id}-default`}
                copiedKey={copiedKey}
                onCopy={copyTemplate}
              />
            ) : null}

            <div className="my-5 h-px bg-[#ddd9d0]" />

            <button
              type="button"
              onClick={() => continueInfo(currentStep)}
              className="rounded border border-[#1a4f8a] bg-[#1a4f8a] px-4 py-2 font-mono text-xs font-medium tracking-[0.04em] text-white uppercase transition hover:opacity-90"
            >
              Continue →
            </button>
          </section>
        ) : null}

        {currentStep?.type === "terminal" ? (
          <section className="mb-4 rounded-md border-2 border-[#1a1814] bg-white p-6 shadow-[4px_4px_0_#1a1814] max-[520px]:p-5">
            <div
              className={[
                "mb-3 flex items-center gap-2 font-mono text-[13px] font-medium tracking-[0.08em] uppercase",
                TERMINAL_DOT_CLASS[currentStep.terminalType].split(" ")[1],
              ].join(" ")}
            >
              <span
                className={[
                  "inline-block h-2.5 w-2.5 rounded-full",
                  TERMINAL_DOT_CLASS[currentStep.terminalType].split(" ")[0],
                ].join(" ")}
              />
              {TERMINAL_LABEL[currentStep.terminalType]}
            </div>

            <div className="mb-2.5 flex items-center gap-1.5 font-mono text-[10px] font-medium tracking-[0.08em] text-[#c8420a] uppercase before:inline-block before:h-0.5 before:w-4 before:bg-[#c8420a] before:content-['']">
              {currentStep.section}
            </div>
            <h2 className="mb-3.5 text-lg leading-[1.45] font-semibold text-[#1a1814]">
              {currentStep.title}
            </h2>
            <div className="text-sm leading-[1.65] text-[#4a463f] whitespace-pre-wrap">
              {currentStep.body ?? ""}
            </div>

            {currentStep.emailTemplate ? (
              <EmailTemplate
                text={currentStep.emailTemplate}
                templateKey={`${currentStep.id}-default`}
                copiedKey={copiedKey}
                onCopy={copyTemplate}
              />
            ) : null}

            <div className="my-5 h-px bg-[#ddd9d0]" />

            <button
              type="button"
              onClick={resetWizard}
              className="rounded border border-[#1a1814] bg-[#1a1814] px-4 py-2 font-mono text-xs font-medium tracking-[0.04em] text-[#f4f2ee] uppercase transition hover:opacity-90"
            >
              Start New Request
            </button>
          </section>
        ) : null}

        <div className="mt-4 flex flex-wrap gap-2.5">
          {history.length > 0 ? (
            <button
              type="button"
              onClick={goBack}
              className="rounded border-[1.5px] border-[#b8b2a7] bg-white px-4 py-2 font-mono text-xs font-medium tracking-[0.04em] text-[#4a463f] uppercase transition hover:border-[#1a1814] hover:text-[#1a1814]"
            >
              ← Back
            </button>
          ) : null}

          <button
            type="button"
            onClick={resetWizard}
            className="rounded border-[1.5px] border-[#ddd9d0] bg-white px-4 py-2 font-mono text-xs font-medium tracking-[0.04em] text-[#8a8278] uppercase transition hover:border-[#c8420a] hover:text-[#c8420a] cursor-pointer"
          >
            Reset
          </button>
        </div>
      </div>
    </main>
  );
}

import { useMemo, useState } from "react";
import type { Choice, HistoryItem, InfoStep, StepsMap } from "./interface";

const MAX_PROGRESS_DEPTH = 8;

export function useReturnsWizard(steps: StepsMap, initialStep: string = "start") {
  const [history, setHistory] = useState<HistoryItem[]>([]);
  const [currentStepId, setCurrentStepId] = useState(initialStep);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const currentStep = steps[currentStepId];
  const stepCount = history.length;

  const progress = useMemo(() => {
    return Math.min(100, Math.round((stepCount / MAX_PROGRESS_DEPTH) * 100));
  }, [stepCount]);

  const choose = (choice: Choice) => {
    setHistory((prev) => [
      ...prev,
      { stepId: currentStepId, choiceLabel: choice.short || choice.label },
    ]);
    setCurrentStepId(choice.next);
  };

  const goBack = () => {
    setHistory((prev) => {
      if (!prev.length) return prev;
      const next = [...prev];
      const popped = next.pop();
      if (popped) setCurrentStepId(popped.stepId);
      return next;
    });
  };

  const resetWizard = () => {
    setHistory([]);
    setCurrentStepId(initialStep);
  };

  const continueInfo = (step: InfoStep) => {
    setHistory((prev) => [
      ...prev,
      { stepId: currentStepId, choiceLabel: "Acknowledged" },
    ]);
    setCurrentStepId(step.next);
  };

  const copyTemplate = async (text: string, key: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedKey(key);
      window.setTimeout(() => {
        setCopiedKey((current) => (current === key ? null : current));
      }, 1800);
    } catch {
      setCopiedKey(null);
    }
  };

  return {
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
  };
}

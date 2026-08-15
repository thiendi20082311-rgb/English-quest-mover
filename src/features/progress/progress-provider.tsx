"use client";

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";

type Activity = "vocabulary" | "grammar" | "quiz";

type ProgressContextValue = {
  completed: Record<Activity, boolean>;
  points: number;
  bestQuizPercent: number;
  completeActivity: (activity: Activity, quizPercent?: number) => void;
};

const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const [completed, setCompleted] = useState<Record<Activity, boolean>>({
    vocabulary: false,
    grammar: false,
    quiz: false,
  });
  const [bestQuizPercent, setBestQuizPercent] = useState(0);

  const completeActivity = (activity: Activity, quizPercent = 0) => {
    if (activity === "quiz") {
      setBestQuizPercent((current) => Math.max(current, quizPercent));
      if (quizPercent < 70) return;
    }
    setCompleted((current) => ({ ...current, [activity]: true }));
  };

  const value = useMemo(() => {
    const points =
      (completed.vocabulary ? 10 : 0) +
      (completed.grammar ? 10 : 0) +
      (completed.quiz ? 20 : 0);
    return { completed, points, bestQuizPercent, completeActivity };
  }, [bestQuizPercent, completed]);

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}

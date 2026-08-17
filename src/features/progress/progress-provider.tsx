"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import { useAuth } from "@/features/auth/auth-provider";
import { getSupabaseBrowserClient } from "@/lib/supabase/client";

type Activity = "vocabulary" | "grammar" | "quiz";
type Completed = Record<Activity, boolean>;

type ProgressContextValue = {
  completed: Completed;
  points: number;
  bestQuizPercent: number;
  isLoading: boolean;
  error: string | null;
  completeActivity: (activity: Activity, quizPercent?: number) => Promise<void>;
};

const emptyCompleted: Completed = { vocabulary: false, grammar: false, quiz: false };
const ProgressContext = createContext<ProgressContextValue | null>(null);

export function ProgressProvider({ children }: { children: ReactNode }) {
  const { user, activeProfile } = useAuth();
  const [completed, setCompleted] = useState<Completed>(emptyCompleted);
  const [points, setPoints] = useState(0);
  const [bestQuizPercent, setBestQuizPercent] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadProgress = useCallback(async () => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !activeProfile) return;
    setIsLoading(true);
    const [progressResult, rewardsResult] = await Promise.all([
      supabase
        .from("unit_progress")
        .select("vocabulary_completed, grammar_completed, quiz_completed, best_quiz_percent")
        .eq("learner_profile_id", activeProfile.id)
        .eq("unit_id", "unit01")
        .maybeSingle(),
      supabase.from("reward_ledger").select("points").eq("learner_profile_id", activeProfile.id),
    ]);

    if (progressResult.error || rewardsResult.error) {
      setError("Không thể tải tiến trình. Hãy kiểm tra kết nối và thử lại.");
    } else {
      const row = progressResult.data;
      setCompleted({
        vocabulary: row?.vocabulary_completed ?? false,
        grammar: row?.grammar_completed ?? false,
        quiz: row?.quiz_completed ?? false,
      });
      setBestQuizPercent(row?.best_quiz_percent ?? 0);
      setPoints((rewardsResult.data ?? []).reduce((total, reward) => total + reward.points, 0));
      setError(null);
    }
    setIsLoading(false);
  }, [activeProfile]);

  useEffect(() => {
    if (!activeProfile) return;
    const timer = window.setTimeout(() => void loadProgress(), 0);
    return () => window.clearTimeout(timer);
  }, [activeProfile, loadProgress]);

  const completeActivity = async (activity: Activity, quizPercent = 0) => {
    const supabase = getSupabaseBrowserClient();
    if (!supabase || !user || !activeProfile) return;

    const nextBestQuizPercent = activity === "quiz" ? Math.max(bestQuizPercent, quizPercent) : bestQuizPercent;
    const qualifies = activity !== "quiz" || quizPercent >= 70;
    const nextCompleted = qualifies ? { ...completed, [activity]: true } : completed;
    setCompleted(nextCompleted);
    setBestQuizPercent(nextBestQuizPercent);
    setError(null);

    const { error: progressError } = await supabase.from("unit_progress").upsert(
      {
        owner_id: user.id,
        learner_profile_id: activeProfile.id,
        unit_id: "unit01",
        vocabulary_completed: nextCompleted.vocabulary,
        grammar_completed: nextCompleted.grammar,
        quiz_completed: nextCompleted.quiz,
        best_quiz_percent: nextBestQuizPercent,
        updated_at: new Date().toISOString(),
      },
      { onConflict: "learner_profile_id,unit_id" },
    );

    if (progressError) {
      setError("Chưa thể lưu tiến trình. Vui lòng thử lại.");
      await loadProgress();
      return;
    }

    if (qualifies && !completed[activity]) {
      const rewards: Record<Activity, number> = { vocabulary: 10, grammar: 10, quiz: 20 };
      const { error: rewardError } = await supabase.from("reward_ledger").insert({
        owner_id: user.id,
        learner_profile_id: activeProfile.id,
        activity_id: `unit01-${activity}`,
        points: rewards[activity],
      });
      if (rewardError && rewardError.code !== "23505") {
        setError("Tiến trình đã lưu nhưng chưa thể cập nhật điểm.");
      }
    }

    await loadProgress();
  };

  const value = activeProfile
    ? { completed, points, bestQuizPercent, isLoading, error, completeActivity }
    : {
        completed: emptyCompleted,
        points: 0,
        bestQuizPercent: 0,
        isLoading: false,
        error: null,
        completeActivity,
      };

  return <ProgressContext.Provider value={value}>{children}</ProgressContext.Provider>;
}

export function useProgress() {
  const value = useContext(ProgressContext);
  if (!value) throw new Error("useProgress must be used inside ProgressProvider");
  return value;
}

import { unit00Fixture } from "@/content/units/unit-00-fixture";
import { QuizEngine } from "@/features/learning/quiz-engine";

export default function QuizPage() {
  return <QuizEngine unit={unit00Fixture} />;
}

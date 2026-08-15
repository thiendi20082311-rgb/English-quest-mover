"use client";

import Link from "next/link";
import { useState } from "react";
import type { QuizQuestion, UnitContent } from "@/content/schema";
import { LearningImage } from "@/components/learning-image";
import { StepProgress } from "@/components/step-progress";
import { useProgress } from "@/features/progress/progress-provider";

function seededRandom(seed: number) {
  let state = seed || 1;
  return () => {
    state = (state * 1664525 + 1013904223) % 4294967296;
    return state / 4294967296;
  };
}

function hashSeed(value: string) {
  return [...value].reduce((total, character) => ((total * 31) + character.charCodeAt(0)) >>> 0, 0);
}

function shuffle<T>(items: T[], random: () => number) {
  const result = [...items];
  for (let index = result.length - 1; index > 0; index -= 1) {
    const nextIndex = Math.floor(random() * (index + 1));
    [result[index], result[nextIndex]] = [result[nextIndex], result[index]];
  }
  return result;
}

function createAttempt(unit: UnitContent, attemptNumber: number) {
  const random = seededRandom(hashSeed(`${unit.id}-${attemptNumber}`));
  const required = (["meaning-choice", "image-choice", "grammar-choice"] as const)
    .map((type) => shuffle(unit.quizBank.filter((question) => question.type === type), random)[0]);
  const requiredIds = new Set(required.map((question) => question.id));
  const remaining = shuffle(unit.quizBank.filter((question) => !requiredIds.has(question.id)), random);
  return shuffle([...required, ...remaining.slice(0, unit.quizRules.questionsPerAttempt - required.length)], random);
}

function QuestionPrompt({ question }: { question: QuizQuestion }) {
  if (question.type === "meaning-choice") return <h2>{question.word}</h2>;
  if (question.type === "grammar-choice") return <h2>{question.sentenceEn}</h2>;
  return <LearningImage src={question.imageSrc} alt={question.imageAltVi} />;
}

export function QuizEngine({ unit }: { unit: UnitContent }) {
  const [attemptNumber, setAttemptNumber] = useState(0);
  const [questions, setQuestions] = useState<QuizQuestion[]>(() => createAttempt(unit, 0));
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [correctCount, setCorrectCount] = useState(0);
  const [finished, setFinished] = useState(false);
  const { completeActivity } = useProgress();

  const restart = () => {
    const nextAttempt = attemptNumber + 1;
    setAttemptNumber(nextAttempt);
    setQuestions(createAttempt(unit, nextAttempt));
    setIndex(0);
    setSelected(null);
    setCorrectCount(0);
    setFinished(false);
  };

  if (finished) {
    const percent = Math.round((correctCount / questions.length) * 100);
    const passed = percent >= unit.quizRules.passPercent;
    return (
      <main className="page-wrap">
        <section className="result-card">
          <p className="eyebrow">Quiz complete</p>
          <h1>{passed ? "Great job!" : "Keep practicing!"}</h1>
          <div className="result-score">{percent}%</div>
          <p className="muted">
            Bạn trả lời đúng {correctCount}/{questions.length} câu. {passed ? `Bạn đã đạt mốc ${unit.quizRules.passPercent}%.` : `Cần đạt ${unit.quizRules.passPercent}% để hoàn thành.`}
          </p>
          <div className="button-row">
            <button type="button" className="button button--secondary" onClick={restart}>Làm lại quiz</button>
            <Link href="/" className="button button--primary" onClick={() => completeActivity("quiz", percent)}>
              Về trang chủ
            </Link>
          </div>
        </section>
      </main>
    );
  }

  const question = questions[index];
  const isCorrect = selected === question.correctOptionId;

  const next = () => {
    if (index === questions.length - 1) {
      const finalCorrect = correctCount + (isCorrect ? 1 : 0);
      setCorrectCount(finalCorrect);
      const percent = Math.round((finalCorrect / questions.length) * 100);
      completeActivity("quiz", percent);
      setFinished(true);
      return;
    }
    setCorrectCount((current) => current + (isCorrect ? 1 : 0));
    setIndex((current) => current + 1);
    setSelected(null);
  };

  return (
    <main className="page-wrap">
      <Link href="/" className="crumb">← Trang chủ</Link>
      <div className="lesson-heading">
        <p className="eyebrow">Mixed quiz · {unit.level}</p>
        <h1>Ready, set, choose!</h1>
        <p>Mỗi lượt có 7 câu không lặp và đủ ba dạng bài.</p>
      </div>
      <StepProgress current={index + 1} total={questions.length} />
      <section className="question-card">
        <p className="eyebrow">{question.instructionVi}</p>
        <div className={question.type === "image-choice" ? "quiz-image" : ""}>
          <QuestionPrompt question={question} />
        </div>
        <div className="option-grid">
          {question.options.map((option) => {
            const optionIsCorrect = option.id === question.correctOptionId;
            const optionIsSelected = option.id === selected;
            const stateClass = selected && optionIsCorrect ? "option--correct" : optionIsSelected ? "option--wrong" : "";
            return (
              <button
                type="button"
                className={`option ${stateClass}`}
                key={option.id}
                disabled={Boolean(selected)}
                onClick={() => setSelected(option.id)}
              >
                {option.text}
              </button>
            );
          })}
        </div>
        {selected && (
          <>
            <p className="feedback"><strong>{isCorrect ? "Correct!" : "Not quite."}</strong> {question.explanationVi}</p>
            <div className="button-row">
              <button type="button" className="button button--primary button--wide" onClick={next}>
                {index === questions.length - 1 ? "Xem kết quả" : "Câu tiếp theo →"}
              </button>
            </div>
          </>
        )}
      </section>
    </main>
  );
}

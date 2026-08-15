"use client";

import Link from "next/link";
import { useState } from "react";
import type { UnitContent } from "@/content/schema";
import { useProgress } from "@/features/progress/progress-provider";

export function GrammarLesson({ unit }: { unit: UnitContent }) {
  const [answers, setAnswers] = useState<Record<string, string>>({});
  const { completeActivity } = useProgress();
  const grammar = unit.grammar;
  const allAnswered = grammar.practice.every((question) => answers[question.id]);

  return (
    <main className="page-wrap">
      <Link href="/" className="crumb">← Trang chủ</Link>
      <div className="lesson-heading">
        <p className="eyebrow">Grammar · {unit.level}</p>
        <h1>{grammar.title.en}</h1>
        <p>{grammar.explanationVi}</p>
      </div>

      <section className="lesson-card">
        <p className="eyebrow">The rule</p>
        <div className="grammar-rule">{grammar.rule}</div>
        <ul className="examples-list" aria-label="Ví dụ">
          {grammar.examplesEn.map((example) => <li key={example}>{example}</li>)}
        </ul>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Practice</p>
          <h2>Thử sức với 3 câu</h2>
        </div>
      </div>

      <div className="practice-stack">
        {grammar.practice.map((question, index) => {
          const selected = answers[question.id];
          return (
            <section className="question-card" key={question.id}>
              <p className="eyebrow">Question {index + 1}</p>
              <h3>{question.sentenceEn}</h3>
              <div className="option-grid">
                {question.options.map((option) => {
                  const isCorrect = option.id === question.correctOptionId;
                  const isSelected = option.id === selected;
                  const stateClass = selected && isCorrect ? "option--correct" : isSelected ? "option--wrong" : "";
                  return (
                    <button
                      type="button"
                      className={`option ${stateClass}`}
                      key={option.id}
                      disabled={Boolean(selected)}
                      onClick={() => setAnswers((current) => ({ ...current, [question.id]: option.id }))}
                    >
                      {option.text}
                    </button>
                  );
                })}
              </div>
              {selected && <p className="feedback">{question.explanationVi}</p>}
            </section>
          );
        })}
      </div>

      {allAnswered && (
        <div className="button-row">
          <Link href="/" className="button button--primary" onClick={() => completeActivity("grammar")}>
            Hoàn thành · nhận {unit.rewards.grammar} điểm
          </Link>
        </div>
      )}
    </main>
  );
}

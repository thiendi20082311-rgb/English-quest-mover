"use client";

import Link from "next/link";
import { useState } from "react";
import type { UnitContent } from "@/content/schema";
import { LearningImage } from "@/components/learning-image";
import { StepProgress } from "@/components/step-progress";
import { useProgress } from "@/features/progress/progress-provider";

export function VocabularyLesson({ unit }: { unit: UnitContent }) {
  const [index, setIndex] = useState(0);
  const [viewed, setViewed] = useState(() => new Set([0]));
  const { completeActivity } = useProgress();
  const item = unit.vocabulary[index];

  const speak = () => {
    if (!("speechSynthesis" in window) || item.pronunciation.kind !== "tts") return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(item.pronunciation.text);
    utterance.lang = item.pronunciation.lang;
    window.speechSynthesis.speak(utterance);
  };

  const allViewed = viewed.size === unit.vocabulary.length;

  const showNext = () => {
    const nextIndex = index + 1;
    setIndex(nextIndex);
    setViewed((current) => new Set(current).add(nextIndex));
  };

  return (
    <main className="page-wrap">
      <Link href="/" className="crumb">← Trang chủ</Link>
      <div className="lesson-heading">
        <p className="eyebrow">Vocabulary · {unit.level}</p>
        <h1>Learn five words</h1>
        <p>Lật qua từng thẻ, nghe phát âm và đọc câu mẫu bằng tiếng Anh.</p>
      </div>

      <StepProgress current={index + 1} total={unit.vocabulary.length} />
      <section className="lesson-card flashcard-layout" aria-live="polite">
        <LearningImage src={item.imageSrc} alt={item.imageAltVi} />
        <div>
          <p className="eyebrow">Word {index + 1}</p>
          <h2 className="word-title">{item.word}</h2>
          <p className="meaning">{item.meaningVi}</p>
          <p className="example">“{item.exampleEn}”</p>
          <div className="button-row">
            <button type="button" className="button button--secondary" onClick={speak}>
              <span aria-hidden="true">♪</span> Nghe phát âm
            </button>
            {index > 0 && (
              <button type="button" className="button button--secondary" onClick={() => setIndex((current) => current - 1)}>
                ← Từ trước
              </button>
            )}
            {index < unit.vocabulary.length - 1 && (
              <button type="button" className="button button--primary" onClick={showNext}>
                Từ tiếp theo →
              </button>
            )}
          </div>
        </div>
      </section>

      {allViewed && (
        <div className="button-row">
          <Link href="/" className="button button--primary" onClick={() => completeActivity("vocabulary")}>
            Hoàn thành · nhận {unit.rewards.vocabulary} điểm
          </Link>
        </div>
      )}
    </main>
  );
}

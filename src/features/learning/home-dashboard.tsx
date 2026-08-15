"use client";

import Link from "next/link";
import { unit00Fixture } from "@/content/units/unit-00-fixture";
import { useProgress } from "@/features/progress/progress-provider";

const activities = [
  {
    key: "vocabulary" as const,
    href: "/vocabulary",
    icon: "Aa",
    title: "Vocabulary",
    description: "Học 5 từ mới bằng flashcard, hình ảnh và phát âm.",
    reward: 10,
    color: "#e2f4ff",
  },
  {
    key: "grammar" as const,
    href: "/grammar",
    icon: "✎",
    title: "Grammar",
    description: "Khám phá tính từ so sánh hơn và luyện tập 3 câu.",
    reward: 10,
    color: "#fff0dc",
  },
  {
    key: "quiz" as const,
    href: "/quiz",
    icon: "✓",
    title: "Quiz",
    description: "Thử sức với 7 câu hỏi từ ngân hàng 10 câu.",
    reward: 20,
    color: "#e8f6e9",
  },
];

export function HomeDashboard() {
  const { completed, points, bestQuizPercent } = useProgress();
  const progressPercent = Math.round((points / 40) * 100);

  return (
    <main className="page-wrap">
      <section className="hero">
        <div className="hero__main">
          <p className="eyebrow">Unit engine preview · A1</p>
          <h1>{unit00Fixture.title.en}</h1>
          <p>{unit00Fixture.descriptionVi}</p>
        </div>
        <aside className="hero__progress" aria-label="Tiến trình Unit">
          <div>
            <p className="eyebrow">Your progress</p>
            <h2>Keep exploring!</h2>
            <p className="muted">Hoàn thành cả ba hoạt động để nhận 40 điểm.</p>
          </div>
          <div className="progress-ring" style={{ "--progress": `${progressPercent}%` } as React.CSSProperties}>
            <span>{progressPercent}%</span>
          </div>
          {bestQuizPercent > 0 && <p className="muted">Best quiz: {bestQuizPercent}%</p>}
        </aside>
      </section>

      <div className="section-heading">
        <div>
          <p className="eyebrow">Choose your path</p>
          <h2>Hôm nay bạn muốn học gì?</h2>
        </div>
      </div>

      <section className="activity-grid" aria-label="Các hoạt động học">
        {activities.map((activity) => (
          <Link className="activity-card" href={activity.href} key={activity.key}>
            <span className="activity-card__icon" style={{ "--accent-soft": activity.color } as React.CSSProperties} aria-hidden="true">
              {activity.icon}
            </span>
            <h3>{activity.title}</h3>
            <p>{activity.description}</p>
            <div className="activity-card__footer">
              <span>{activity.reward} points</span>
              <span className="status-pill">{completed[activity.key] ? "Completed" : "Start →"}</span>
            </div>
          </Link>
        ))}
      </section>

      <p className="demo-note">
        Đây là bản thử nghiệm engine dùng dữ liệu mẫu. Tiến trình chỉ được giữ trong phiên hiện tại; Supabase sẽ được kết nối ở Chặng 3.
      </p>
    </main>
  );
}

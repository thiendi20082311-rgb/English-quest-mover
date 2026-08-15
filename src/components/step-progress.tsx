export function StepProgress({ current, total }: { current: number; total: number }) {
  const percent = Math.round((current / total) * 100);

  return (
    <div className="step-progress" aria-label={`Tiến trình ${current} trên ${total}`}>
      <div className="step-progress__track" aria-hidden="true">
        <div className="step-progress__fill" style={{ width: `${percent}%` }} />
      </div>
      <strong>{current}/{total}</strong>
    </div>
  );
}

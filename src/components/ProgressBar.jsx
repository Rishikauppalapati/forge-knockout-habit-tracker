export default function ProgressBar({ value, max, label, trailingLabel, accent = false }) {
  const percent = max > 0 ? Math.round((value / max) * 100) : 0;

  return (
    <div className="progress-bar-block">
      {label && (
        <div className="progress-bar-heading">
          <span>{label}</span>
          <span>{trailingLabel}</span>
        </div>
      )}
      <div
        className="progress-bar-track"
        role="progressbar"
        aria-valuenow={percent}
        aria-valuemin={0}
        aria-valuemax={100}
      >
        <div
          className={accent ? "progress-bar-fill progress-bar-fill-accent" : "progress-bar-fill"}
          style={{ width: `${percent}%` }}
        />
      </div>
    </div>
  );
}

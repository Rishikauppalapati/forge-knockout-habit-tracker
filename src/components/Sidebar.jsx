import ProgressBar from "./ProgressBar.jsx";

export default function Sidebar({ totalHabits, completedToday, bestStreak, totalXP, level }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark" aria-hidden="true">🌳</span>
        <div>
          <p className="brand-name">Streakly</p>
          <p className="brand-tagline">Grow better habits</p>
        </div>
      </div>

      <nav className="sidebar-nav" aria-label="Primary">
        <span className="sidebar-nav-item sidebar-nav-item-active">
          <span aria-hidden="true">📋</span> Today
        </span>
      </nav>

      <div className="level-card">
        <div className="level-card-header">
          <span className="level-card-badge">🌲 Grove Level {level.level}</span>
          <span className="level-card-xp">{totalXP} growth</span>
        </div>
        <ProgressBar value={level.xpIntoLevel} max={level.xpPerLevel} accent />
        <p className="level-card-hint">
          {level.xpPerLevel - level.xpIntoLevel} growth to next level
        </p>
      </div>

      <div className="stats-panel">
        <p className="stats-panel-title">Overview</p>
        <div className="stat-card">
          <span className="stat-value">{totalHabits}</span>
          <span className="stat-label">Total habits</span>
        </div>
        <div className="stat-card">
          <span className="stat-value">
            {completedToday}/{totalHabits}
          </span>
          <span className="stat-label">Planted today</span>
        </div>
        <div className="stat-card stat-card-accent">
          <span className="stat-value">🌳 {bestStreak}</span>
          <span className="stat-label">Tallest tree (days)</span>
        </div>
      </div>
    </aside>
  );
}

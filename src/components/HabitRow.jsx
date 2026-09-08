import { dayLabel, getLastNDays, todayISO } from "../lib/dates.js";
import { getPlantStage } from "../lib/forest.js";
import { calculateCurrentStreak } from "../lib/streak.js";

export default function HabitRow({ habit, onToggleToday, onDelete }) {
  const today = todayISO();
  const checkInSet = new Set(habit.checkIns);
  const done = checkInSet.has(today);
  const streak = calculateCurrentStreak(habit.checkIns);
  const week = getLastNDays(7, today);
  const stage = getPlantStage(streak);

  return (
    <li className="habit-card">
      <div className="habit-card-top">
        <span className="habit-icon" aria-hidden="true" title={stage.label}>
          {stage.emoji}
        </span>

        <div className="habit-info">
          <span className={done ? "habit-name habit-name-done" : "habit-name"}>
            {habit.name}
          </span>
          <span className={streak > 0 ? "habit-streak" : "habit-streak habit-streak-zero"}>
            {stage.label} · {streak} day streak
          </span>
        </div>

        <button
          type="button"
          className={done ? "habit-check habit-check-done" : "habit-check"}
          aria-pressed={done}
          onClick={() => onToggleToday(habit.id)}
          aria-label={done ? `Mark ${habit.name} incomplete for today` : `Mark ${habit.name} complete for today`}
        >
          {done ? "✓" : ""}
        </button>

        <button
          type="button"
          className="habit-delete"
          aria-label={`Delete ${habit.name}`}
          onClick={() => onDelete(habit.id)}
        >
          ×
        </button>
      </div>

      <ol className="habit-week" aria-label={`Last 7 days for ${habit.name}`}>
        {week.map((date) => {
          const isDone = checkInSet.has(date);
          const isToday = date === today;
          return (
            <li key={date} className="habit-week-day">
              <span
                className={
                  "habit-week-dot" +
                  (isDone ? " habit-week-dot-done" : "") +
                  (isToday ? " habit-week-dot-today" : "")
                }
                title={date}
              />
              <span className="habit-week-label">{dayLabel(date)}</span>
            </li>
          );
        })}
      </ol>
    </li>
  );
}

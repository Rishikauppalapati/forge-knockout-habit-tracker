import { getTodayPlant } from "../lib/forest.js";
import ProgressBar from "./ProgressBar.jsx";

export default function Forest({ habits, streaksById, completedToday, today, questComplete }) {
  if (habits.length === 0) return null;

  return (
    <section
      className={questComplete ? "forest-hero forest-hero-complete" : "forest-hero"}
      aria-live="polite"
    >
      <div className="forest-hero-header">
        <span className="forest-hero-title">
          {questComplete ? "🌲 Your forest is complete today!" : "🌱 Growing your forest"}
        </span>
        <span className="forest-hero-fraction">
          {completedToday} / {habits.length}
        </span>
      </div>

      <div className="forest-scene">
        {questComplete && <span className="forest-sun" aria-hidden="true">☀️</span>}
        <div className="forest-plants">
          {habits.map((habit) => {
            const doneToday = habit.checkIns.includes(today);
            const plant = getTodayPlant(streaksById.get(habit.id) ?? 0, doneToday);
            return (
              <span
                key={habit.id}
                className={doneToday ? "forest-plant forest-plant-grown" : "forest-plant"}
                title={`${habit.name}: ${plant.label}`}
              >
                <span className="forest-plant-emoji" aria-hidden="true">
                  {plant.emoji}
                </span>
                <span className="forest-plant-name">{habit.name}</span>
              </span>
            );
          })}
        </div>
        <div className="forest-ground" aria-hidden="true" />
      </div>

      <ProgressBar value={completedToday} max={habits.length} accent />
      <p className="forest-hero-subtitle">
        {questComplete
          ? "Every habit planted today — your forest is in full bloom."
          : "Complete a habit and watch its plant grow. Finish them all to grow the whole forest."}
      </p>
    </section>
  );
}

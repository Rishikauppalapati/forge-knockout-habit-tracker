import { useEffect, useMemo, useState } from "react";
import AddHabitForm from "./components/AddHabitForm.jsx";
import Forest from "./components/Forest.jsx";
import HabitList from "./components/HabitList.jsx";
import HeatmapCalendar from "./components/HeatmapCalendar.jsx";
import Sidebar from "./components/Sidebar.jsx";
import ToastStack from "./components/ToastStack.jsx";
import { formatLongDate, greeting, todayISO } from "./lib/dates.js";
import { calculateLevel, calculateTodayXP, calculateTotalXP } from "./lib/gamification.js";
import { loadHabits, saveHabits } from "./lib/storage.js";
import { calculateCurrentStreak } from "./lib/streak.js";

const TOAST_DURATION_MS = 2200;

export default function App() {
  const [habits, setHabits] = useState(() => loadHabits());
  const [sortByStreak, setSortByStreak] = useState(false);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    saveHabits(habits);
  }, [habits]);

  function pushToast(text) {
    const id = crypto.randomUUID();
    setToasts((prev) => [...prev, { id, text }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((toast) => toast.id !== id));
    }, TOAST_DURATION_MS);
  }

  function handleAddHabit(name) {
    const newHabit = {
      id: crypto.randomUUID(),
      name,
      createdAt: todayISO(),
      checkIns: [],
    };
    setHabits((prev) => [...prev, newHabit]);
  }

  function handleToggleToday(habitId) {
    const today = todayISO();
    const target = habits.find((habit) => habit.id === habitId);
    if (!target) return;
    const wasDoneToday = target.checkIns.includes(today);

    setHabits((prev) =>
      prev.map((habit) => {
        if (habit.id !== habitId) return habit;
        return {
          ...habit,
          checkIns: wasDoneToday
            ? habit.checkIns.filter((d) => d !== today)
            : [...habit.checkIns, today],
        };
      }),
    );

    if (!wasDoneToday) {
      pushToast(`🌱 ${target.name} grew!`);
      const completedBefore = habits.filter((habit) => habit.checkIns.includes(today)).length;
      const willCompleteForest = habits.length > 0 && completedBefore + 1 === habits.length;
      if (willCompleteForest) {
        pushToast("🌲 Your forest is complete today!");
      }
    }
  }

  function handleDelete(habitId) {
    setHabits((prev) => prev.filter((habit) => habit.id !== habitId));
  }

  const today = todayISO();

  const streaksById = useMemo(() => {
    const map = new Map();
    habits.forEach((habit) => map.set(habit.id, calculateCurrentStreak(habit.checkIns)));
    return map;
  }, [habits]);

  const bestStreak = habits.length === 0 ? 0 : Math.max(...streaksById.values());
  const todayXP = useMemo(() => calculateTodayXP(habits, today), [habits, today]);
  const totalXP = useMemo(() => calculateTotalXP(habits, today), [habits, today]);
  const level = useMemo(() => calculateLevel(totalXP), [totalXP]);

  const visibleHabits = sortByStreak
    ? [...habits].sort((a, b) => streaksById.get(b.id) - streaksById.get(a.id))
    : habits;

  return (
    <div className="app-shell">
      <Sidebar
        totalHabits={habits.length}
        completedToday={todayXP.completedToday}
        bestStreak={bestStreak}
        totalXP={totalXP}
        level={level}
      />

      <main className="app">
        <header className="app-header">
          <h1>{greeting()}</h1>
          <p className="app-header-date">{formatLongDate(today)}</p>
        </header>

        <Forest
          habits={habits}
          streaksById={streaksById}
          completedToday={todayXP.completedToday}
          today={today}
          questComplete={todayXP.questComplete}
        />

        <HeatmapCalendar habits={habits} />

        <AddHabitForm onAddHabit={handleAddHabit} />

        <div className="habit-list-header">
          <h2>Your habits</h2>
          {habits.length > 1 && (
            <button
              type="button"
              className="sort-toggle"
              aria-pressed={sortByStreak}
              onClick={() => setSortByStreak((prev) => !prev)}
            >
              {sortByStreak ? "Sorted by streak ✓" : "Sort by streak"}
            </button>
          )}
        </div>

        <HabitList
          habits={visibleHabits}
          onToggleToday={handleToggleToday}
          onDelete={handleDelete}
        />
      </main>

      <ToastStack toasts={toasts} />
    </div>
  );
}

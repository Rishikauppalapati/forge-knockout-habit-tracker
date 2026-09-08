import { formatISO, todayISO } from "./dates.js";

const WEEKDAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

function mondayIndex(date) {
  return (date.getDay() + 6) % 7; // 0 = Monday ... 6 = Sunday
}

export function getMonthLabel(year, month) {
  return new Date(year, month, 1).toLocaleDateString(undefined, {
    month: "long",
    year: "numeric",
  });
}

/**
 * Derives a Monday-start calendar grid for `year`/`month` (0-indexed) purely from
 * existing habit.checkIns / habit.createdAt — no separate calendar data is stored.
 */
export function getMonthCalendarData(habits, year, month, today = todayISO()) {
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const leadingBlanks = mondayIndex(new Date(year, month, 1));

  const cells = Array.from({ length: leadingBlanks }, () => null);

  for (let day = 1; day <= daysInMonth; day += 1) {
    const date = formatISO(new Date(year, month, day));
    const isFuture = date > today;
    const activeHabits = habits.filter((habit) => habit.createdAt <= date);
    const total = activeHabits.length;
    const completed = isFuture
      ? 0
      : activeHabits.filter((habit) => habit.checkIns.includes(date)).length;
    const percent = total > 0 ? Math.round((completed / total) * 100) : 0;

    cells.push({
      date,
      day,
      completed,
      total,
      percent,
      isPerfectDay: !isFuture && total > 0 && completed === total,
      isToday: date === today,
      isFuture,
    });
  }

  return { cells, weekdayLabels: WEEKDAY_LABELS };
}

export function getMonthSummary(cells) {
  const trackedCells = cells.filter((cell) => cell && !cell.isFuture && cell.total > 0);
  const perfectDays = trackedCells.filter((cell) => cell.isPerfectDay).length;
  const avgPercent = trackedCells.length
    ? Math.round(trackedCells.reduce((sum, cell) => sum + cell.percent, 0) / trackedCells.length)
    : 0;
  return { perfectDays, avgPercent, trackedDays: trackedCells.length };
}

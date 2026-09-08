import { addDays, formatISO, parseISO, todayISO } from "./dates.js";

export function calculateCurrentStreak(checkIns, today = todayISO()) {
  if (!Array.isArray(checkIns) || checkIns.length === 0) return 0;

  const completed = new Set(checkIns.filter((date) => date <= today));
  if (completed.size === 0) return 0;

  const startDate = completed.has(today)
    ? parseISO(today)
    : addDays(parseISO(today), -1);

  let streak = 0;
  let cursor = startDate;
  while (completed.has(formatISO(cursor))) {
    streak += 1;
    cursor = addDays(cursor, -1);
  }
  return streak;
}

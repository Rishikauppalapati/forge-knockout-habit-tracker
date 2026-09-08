const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

export function todayISO() {
  return formatISO(new Date());
}

export function parseISO(dateStr) {
  const [year, month, day] = dateStr.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function formatISO(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export function addDays(date, delta) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate() + delta);
}

export function dayLabel(dateStr) {
  return DAY_LABELS[parseISO(dateStr).getDay()];
}

/** Returns the last `n` ISO date strings ending today, oldest first. */
export function getLastNDays(n, today = todayISO()) {
  const end = parseISO(today);
  return Array.from({ length: n }, (_, i) => formatISO(addDays(end, i - (n - 1))));
}

export function greeting(date = new Date()) {
  const hour = date.getHours();
  if (hour < 12) return "Good morning";
  if (hour < 18) return "Good afternoon";
  return "Good evening";
}

export function formatLongDate(dateStr = todayISO()) {
  return parseISO(dateStr).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
  });
}

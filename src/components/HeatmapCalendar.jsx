import { useMemo, useState } from "react";
import { getMonthCalendarData, getMonthLabel, getMonthSummary } from "../lib/calendar.js";
import { todayISO } from "../lib/dates.js";

function currentYearMonth() {
  const [year, month] = todayISO().split("-").map(Number);
  return { year, month: month - 1 };
}

export default function HeatmapCalendar({ habits }) {
  const [isOpen, setIsOpen] = useState(false);
  const [yearMonth, setYearMonth] = useState(currentYearMonth);
  const today = todayISO();
  const isCurrentMonth =
    yearMonth.year === currentYearMonth().year && yearMonth.month === currentYearMonth().month;

  const { cells, weekdayLabels } = useMemo(
    () => getMonthCalendarData(habits, yearMonth.year, yearMonth.month, today),
    [habits, yearMonth, today],
  );
  const summary = useMemo(() => getMonthSummary(cells), [cells]);

  if (habits.length === 0) return null;

  function goToPrevMonth() {
    setYearMonth(({ year, month }) =>
      month === 0 ? { year: year - 1, month: 11 } : { year, month: month - 1 },
    );
  }

  function goToNextMonth() {
    if (isCurrentMonth) return;
    setYearMonth(({ year, month }) =>
      month === 11 ? { year: year + 1, month: 0 } : { year, month: month + 1 },
    );
  }

  return (
    <section className="calendar-dropdown">
      <button
        type="button"
        className="calendar-toggle"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((prev) => !prev)}
      >
        <span className="calendar-toggle-label">📅 Consistency Calendar</span>
        <span className="calendar-toggle-summary">
          🎯 {summary.perfectDays} perfect · 📈 {summary.avgPercent}%
        </span>
        <span
          className={"calendar-toggle-chevron" + (isOpen ? " calendar-toggle-chevron-open" : "")}
          aria-hidden="true"
        >
          ▾
        </span>
      </button>

      {isOpen && (
        <div className="calendar-body">
          <div className="calendar-header">
            <div className="calendar-nav">
              <button type="button" onClick={goToPrevMonth} aria-label="Previous month">
                ‹
              </button>
              <span className="calendar-month-label">
                {getMonthLabel(yearMonth.year, yearMonth.month)}
              </span>
              <button
                type="button"
                onClick={goToNextMonth}
                disabled={isCurrentMonth}
                aria-label="Next month"
              >
                ›
              </button>
            </div>
          </div>

          <div className="calendar-weekdays">
            {weekdayLabels.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>

          <div className="calendar-grid">
            {cells.map((cell, index) =>
              cell === null ? (
                <span key={`blank-${index}`} className="calendar-cell calendar-cell-blank" />
              ) : (
                <span
                  key={cell.date}
                  className={
                    "calendar-cell" +
                    (cell.isFuture ? " calendar-cell-future" : "") +
                    (cell.isPerfectDay ? " calendar-cell-perfect" : "") +
                    (cell.isToday ? " calendar-cell-today" : "") +
                    (!cell.isFuture && cell.percent >= 60 ? " calendar-cell-dark" : "")
                  }
                  style={
                    !cell.isFuture && cell.total > 0
                      ? { backgroundColor: `rgba(47, 111, 79, ${0.14 + (cell.percent / 100) * 0.66})` }
                      : undefined
                  }
                  title={
                    cell.total > 0
                      ? `${cell.date}: ${cell.completed}/${cell.total} completed (${cell.percent}%)`
                      : cell.date
                  }
                >
                  <span className="calendar-cell-day">{cell.day}</span>
                  {cell.isPerfectDay && (
                    <span className="calendar-cell-flame" aria-hidden="true">
                      🌿
                    </span>
                  )}
                </span>
              ),
            )}
          </div>
        </div>
      )}
    </section>
  );
}

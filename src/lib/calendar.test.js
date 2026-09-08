import { describe, expect, it } from "vitest";
import { getMonthCalendarData, getMonthSummary } from "./calendar.js";

function habit(checkIns, createdAt = "2000-01-01") {
  return { id: Math.random().toString(36), name: "h", createdAt, checkIns };
}

describe("getMonthCalendarData", () => {
  it("pads the grid so day 1 lands on the correct Monday-start weekday column", () => {
    const { cells } = getMonthCalendarData([], 2026, 8, "2026-09-08"); // September = month index 8
    const expectedBlanks = (new Date(2026, 8, 1).getDay() + 6) % 7;
    const firstFilled = cells.findIndex((cell) => cell !== null);
    expect(firstFilled).toBe(expectedBlanks);
    expect(cells[expectedBlanks].date).toBe("2026-09-01");
  });

  it("counts completed vs total using only habits that already existed that day", () => {
    const habits = [
      habit(["2026-09-05"], "2026-09-01"),
      habit(["2026-09-05"], "2026-09-05"),
      habit([], "2026-09-06"), // didn't exist yet on 09-05
    ];
    const { cells } = getMonthCalendarData(habits, 2026, 8, "2026-09-08");
    const day5 = cells.find((cell) => cell?.date === "2026-09-05");
    expect(day5).toMatchObject({ completed: 2, total: 2, percent: 100, isPerfectDay: true });
  });

  it("zeroes out future days and never marks them a perfect day", () => {
    const habits = [habit(["2026-09-10"])];
    const { cells } = getMonthCalendarData(habits, 2026, 8, "2026-09-08");
    const future = cells.find((cell) => cell?.date === "2026-09-10");
    expect(future).toMatchObject({ completed: 0, isFuture: true, isPerfectDay: false });
  });

  it("treats a day with no habits yet as untracked (total 0), not a missed day", () => {
    const habits = [habit(["2026-09-05"], "2026-09-05")];
    const { cells } = getMonthCalendarData(habits, 2026, 8, "2026-09-08");
    const day1 = cells.find((cell) => cell?.date === "2026-09-01");
    expect(day1).toMatchObject({ total: 0, completed: 0, percent: 0, isPerfectDay: false });
  });
});

describe("getMonthSummary", () => {
  it("averages completion percent and counts perfect days across tracked days only", () => {
    const habits = [habit(["2026-09-05", "2026-09-06"], "2026-09-05")];
    const { cells } = getMonthCalendarData(habits, 2026, 8, "2026-09-08");
    const summary = getMonthSummary(cells);
    // tracked days = 09-05..09-08 (habit didn't exist before 09-05, 09-08 is today so not future)
    expect(summary.trackedDays).toBe(4);
    expect(summary.perfectDays).toBe(2); // 09-05 and 09-06
    expect(summary.avgPercent).toBe(50); // (100 + 100 + 0 + 0) / 4
  });

  it("returns zeroes when nothing is tracked yet", () => {
    const { cells } = getMonthCalendarData([], 2026, 8, "2026-09-08");
    expect(getMonthSummary(cells)).toEqual({ perfectDays: 0, avgPercent: 0, trackedDays: 0 });
  });
});

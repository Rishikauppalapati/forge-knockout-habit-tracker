import { describe, expect, it } from "vitest";
import { calculateCurrentStreak } from "./streak.js";

const TODAY = "2026-09-08"; // Tuesday

describe("calculateCurrentStreak", () => {
  it("returns 0 for empty history", () => {
    expect(calculateCurrentStreak([], TODAY)).toBe(0);
  });

  it("returns 1 for a single check-in today", () => {
    expect(calculateCurrentStreak(["2026-09-08"], TODAY)).toBe(1);
  });

  it("counts consecutive days ending today", () => {
    const checkIns = ["2026-09-06", "2026-09-07", "2026-09-08"];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(3);
  });

  it("stops at a missing day", () => {
    const checkIns = [
      "2026-09-04",
      "2026-09-05",
      // 2026-09-06 missing
      "2026-09-07",
      "2026-09-08",
    ];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(2);
  });

  it("ignores an older streak separated by a gap", () => {
    const checkIns = [
      "2026-09-01",
      "2026-09-02",
      "2026-09-03",
      // 2026-09-04 missing
      "2026-09-05",
      "2026-09-06",
      "2026-09-07",
      "2026-09-08",
    ];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(4);
  });

  it("handles duplicate dates", () => {
    const checkIns = ["2026-09-08", "2026-09-08", "2026-09-07", "2026-09-07"];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(2);
  });

  it("handles unordered dates", () => {
    const checkIns = ["2026-09-07", "2026-09-05", "2026-09-08", "2026-09-06"];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(4);
  });

  it("ignores future dates", () => {
    const checkIns = ["2026-09-08", "2026-09-09", "2026-09-10"];
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(1);
  });

  it("preserves yesterday's streak when today is not yet completed", () => {
    const checkIns = ["2026-09-06", "2026-09-07"]; // today (09-08) not checked in
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(2);
  });

  it("returns 0 when today is missed and there is no run ending yesterday", () => {
    const checkIns = ["2026-09-01", "2026-09-02"]; // gap before yesterday
    expect(calculateCurrentStreak(checkIns, TODAY)).toBe(0);
  });

  it("updates from 6 to 7 after completing today", () => {
    const beforeToday = [
      "2026-09-02",
      "2026-09-03",
      "2026-09-04",
      "2026-09-05",
      "2026-09-06",
      "2026-09-07",
    ];
    expect(calculateCurrentStreak(beforeToday, TODAY)).toBe(6);

    const afterToday = [...beforeToday, "2026-09-08"];
    expect(calculateCurrentStreak(afterToday, TODAY)).toBe(7);
  });
});

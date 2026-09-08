import { describe, expect, it } from "vitest";
import { calculateLevel, calculateTodayXP, calculateTotalXP } from "./gamification.js";

const TODAY = "2026-09-08";

function habit(checkIns, createdAt = "2000-01-01") {
  return { id: Math.random().toString(36), name: "h", createdAt, checkIns };
}

describe("calculateTotalXP", () => {
  it("returns 0 for no habits", () => {
    expect(calculateTotalXP([], TODAY)).toBe(0);
  });

  it("awards 10 XP per check-in when no day is fully completed", () => {
    const habits = [habit(["2026-09-01", "2026-09-02"]), habit(["2026-09-03"])];
    expect(calculateTotalXP(habits, TODAY)).toBe(30);
  });

  it("adds a 50 XP bonus for each day every active habit was completed", () => {
    const habits = [
      habit(["2026-09-01", "2026-09-02", "2026-09-03"]),
      habit(["2026-09-01", "2026-09-03"]), // misses 09-02
    ];
    // base: (3 + 2) * 10 = 50, bonus days: 09-01 and 09-03 -> 2 * 50 = 100
    expect(calculateTotalXP(habits, TODAY)).toBe(150);
  });

  it("only counts habits that already existed on a given day", () => {
    const habits = [
      habit(["2026-09-01", "2026-09-02"], "2026-09-01"),
      habit(["2026-09-02"], "2026-09-02"), // created on 09-02, didn't exist on 09-01
    ];
    // base: (2 + 1) * 10 = 30, bonus days: 09-01 (only habit A existed) and 09-02 (both) -> 2 * 50 = 100
    expect(calculateTotalXP(habits, TODAY)).toBe(130);
  });

  it("ignores check-ins after the given today cutoff", () => {
    const habits = [habit(["2026-09-08", "2026-09-09"])];
    // base: 1 valid check-in * 10 = 10; the single habit also completed its own "quest" that day: +50
    expect(calculateTotalXP(habits, TODAY)).toBe(60);
  });
});

describe("calculateTodayXP", () => {
  it("returns zero state for no habits", () => {
    const result = calculateTodayXP([], TODAY);
    expect(result).toMatchObject({ completedToday: 0, totalHabits: 0, questComplete: false, totalXP: 0 });
  });

  it("awards 10 XP per habit completed today, no bonus when partial", () => {
    const habits = [habit([TODAY]), habit([TODAY]), habit([])];
    const result = calculateTodayXP(habits, TODAY);
    expect(result).toMatchObject({ completedToday: 2, totalHabits: 3, baseXP: 20, bonusXP: 0, totalXP: 20, questComplete: false });
  });

  it("awards the 50 XP daily quest bonus when every habit is completed today", () => {
    const habits = [habit([TODAY]), habit([TODAY])];
    const result = calculateTodayXP(habits, TODAY);
    expect(result).toMatchObject({ completedToday: 2, totalHabits: 2, baseXP: 20, bonusXP: 50, totalXP: 70, questComplete: true });
  });

  it("loses the bonus again once a habit is un-checked", () => {
    const habits = [habit([TODAY]), habit([])];
    const result = calculateTodayXP(habits, TODAY);
    expect(result.questComplete).toBe(false);
    expect(result.bonusXP).toBe(0);
  });
});

describe("calculateLevel", () => {
  it("starts at level 1 with 0 XP", () => {
    expect(calculateLevel(0)).toEqual({ level: 1, xpIntoLevel: 0, xpPerLevel: 100 });
  });

  it("reaches level 2 at exactly 100 XP", () => {
    expect(calculateLevel(100)).toEqual({ level: 2, xpIntoLevel: 0, xpPerLevel: 100 });
  });

  it("tracks progress within the current level", () => {
    expect(calculateLevel(340)).toEqual({ level: 4, xpIntoLevel: 40, xpPerLevel: 100 });
  });
});

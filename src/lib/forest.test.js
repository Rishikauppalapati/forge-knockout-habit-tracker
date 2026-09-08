import { describe, expect, it } from "vitest";
import { getPlantStage, getTodayPlant } from "./forest.js";

describe("getPlantStage", () => {
  it("starts as a sprout at streak 0", () => {
    expect(getPlantStage(0).label).toBe("Sprout");
  });

  it("grows into a seedling at 3 days", () => {
    expect(getPlantStage(3).label).toBe("Seedling");
  });

  it("grows into a sapling at 7 days", () => {
    expect(getPlantStage(7).label).toBe("Sapling");
  });

  it("grows into a tree at 14 days", () => {
    expect(getPlantStage(14).label).toBe("Tree");
  });

  it("grows into an ancient tree at 30+ days", () => {
    expect(getPlantStage(30).label).toBe("Ancient tree");
    expect(getPlantStage(100).label).toBe("Ancient tree");
  });

  it("never regresses below a sprout for any non-negative streak", () => {
    expect(getPlantStage(1).label).toBe("Sprout");
    expect(getPlantStage(2).label).toBe("Sprout");
  });
});

describe("getTodayPlant", () => {
  it("is dormant (a seed) when not completed today, regardless of streak", () => {
    expect(getTodayPlant(30, false).label).toBe("Seed");
  });

  it("shows the real growth stage once completed today", () => {
    expect(getTodayPlant(14, true).label).toBe("Tree");
  });
});

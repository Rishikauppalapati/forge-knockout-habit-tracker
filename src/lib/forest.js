const DORMANT = { emoji: "🌰", label: "Seed" };

const GROWTH_STAGES = [
  { minStreak: 0, emoji: "🌱", label: "Sprout" },
  { minStreak: 3, emoji: "🌿", label: "Seedling" },
  { minStreak: 7, emoji: "🪴", label: "Sapling" },
  { minStreak: 14, emoji: "🌳", label: "Tree" },
  { minStreak: 30, emoji: "🌲", label: "Ancient tree" },
];

/** The habit's long-term growth stage, based on its current streak. */
export function getPlantStage(streak) {
  let stage = GROWTH_STAGES[0];
  for (const candidate of GROWTH_STAGES) {
    if (streak >= candidate.minStreak) stage = candidate;
  }
  return stage;
}

/** How the habit's plant should render in today's forest: dormant unless checked in today. */
export function getTodayPlant(streak, doneToday) {
  return doneToday ? getPlantStage(streak) : DORMANT;
}

export { DORMANT as DORMANT_PLANT };

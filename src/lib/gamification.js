const XP_PER_CHECKIN = 10;
const DAILY_QUEST_BONUS_XP = 50;
const XP_PER_LEVEL = 100;

/** Counts past days where every habit that existed yet had a check-in — i.e. days the daily quest was completed. */
function countCompletedQuestDays(habits, today) {
  if (habits.length === 0) return 0;

  const allDates = new Set();
  habits.forEach((habit) => {
    habit.checkIns.forEach((date) => {
      if (date <= today) allDates.add(date);
    });
  });

  let count = 0;
  allDates.forEach((date) => {
    const activeHabits = habits.filter((habit) => habit.createdAt <= date);
    if (activeHabits.length > 0 && activeHabits.every((habit) => habit.checkIns.includes(date))) {
      count += 1;
    }
  });
  return count;
}

export function calculateTotalXP(habits, today) {
  const baseXP = habits.reduce(
    (sum, habit) => sum + habit.checkIns.filter((date) => date <= today).length * XP_PER_CHECKIN,
    0,
  );
  const bonusXP = countCompletedQuestDays(habits, today) * DAILY_QUEST_BONUS_XP;
  return baseXP + bonusXP;
}

export function calculateTodayXP(habits, today) {
  const totalHabits = habits.length;
  const completedToday = habits.filter((habit) => habit.checkIns.includes(today)).length;
  const baseXP = completedToday * XP_PER_CHECKIN;
  const questComplete = totalHabits > 0 && completedToday === totalHabits;
  return {
    completedToday,
    totalHabits,
    baseXP,
    bonusXP: questComplete ? DAILY_QUEST_BONUS_XP : 0,
    totalXP: baseXP + (questComplete ? DAILY_QUEST_BONUS_XP : 0),
    questComplete,
  };
}

export function calculateLevel(totalXP) {
  const level = Math.floor(totalXP / XP_PER_LEVEL) + 1;
  const xpIntoLevel = totalXP % XP_PER_LEVEL;
  return { level, xpIntoLevel, xpPerLevel: XP_PER_LEVEL };
}

export { DAILY_QUEST_BONUS_XP, XP_PER_CHECKIN };

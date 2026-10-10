/**
 * Daily changing streak encouragement phrases.
 * Automatically changes every day based on the current date.
 */

export const STREAK_QUOTES = [
  "Don't break the chain!",
  "You are doing very well",
  "Think of how happy you would be tomorrow",
  "The drawings don't have to be perfect",
  "No pressure, just progress",
  "Don't think, just draw",
  "Don't reset to zero. You've got this!"
];

/**
 * Returns the streak phrase for today based on the calendar day.
 * Ensures the phrase rotates every day.
 */
export function getDailyStreakQuote(offsetDays: number = 0): string {
  const now = new Date();
  // Calculate day of the year or epoch day
  const startOfYear = new Date(now.getFullYear(), 0, 1);
  const diff = now.getTime() - startOfYear.getTime();
  const oneDay = 1000 * 60 * 60 * 24;
  const dayOfYear = Math.floor(diff / oneDay) + offsetDays;

  // Modulo index ensures consistent daily rotation
  const index = Math.abs(dayOfYear) % STREAK_QUOTES.length;
  return STREAK_QUOTES[index];
}

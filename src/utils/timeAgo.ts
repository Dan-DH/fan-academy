import { ETurnTimer } from "../enums/gameEnums";

// NOTE: not used atm
export function timeAgo(dateString: Date): string {
  const now = new Date();
  const lastPlayed = new Date(dateString);
  return getGameListTimerText(now.getTime() - lastPlayed.getTime());
}

export function getTimeLeft(lastPlayedAt: Date, turnTimer: ETurnTimer): number {
  const timerMap = {
    [ETurnTimer.DAILY]: 24 * 60 * 60 * 1000,
    [ETurnTimer.THREE_DAYS]: 3 * 24 * 60 * 60 * 1000,
    [ETurnTimer.WEEKLY]: 7 * 24 * 60 * 60 * 1000
  };
  const now = new Date();
  const turnDeadline = new Date(lastPlayedAt).getTime() + timerMap[turnTimer];
  return turnDeadline - now.getTime();
}

export function getGameListTimerText(timeLeft: number): string {
  let seconds = timeLeft / 1000;

  const intervals = {
    year: 31536000,
    month: 2592000,
    day: 86400,
    hour: 3600,
    minute: 60,
    second: 1
  };

  const result = [];

  for (const [unit, value] of Object.entries(intervals)) {
    const count = Math.floor(seconds / value);
    if (count > 0) {
      result.push(`${count} ${unit}${count !== 1 ? "s" : ""}`);
      seconds -= count * value;
      if (result.length === 2) break; // Limit to two parts like "1 day and 6 hours"
    }
  }

  return result.join(" and ") + " left";
}

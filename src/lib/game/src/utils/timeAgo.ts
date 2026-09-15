export function timeAgo(dateString: Date) {
  const now = new Date();
  const lastPlayed = new Date(dateString);
  let seconds = Math.floor((now.getTime() - lastPlayed.getTime()) / 1000);

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

  return result.length ? result.join(" and ") + " ago" : "just now";
}

import { formatNextAwardDate } from "./award-date";

export const CONTEST_2027 = {
  fund: 3_000_000,
  months: 6,
  monthlyFund: 500_000,
  prizes: [300_000, 150_000, 50_000],
  scrambleInterval: 3000,
  headlineEndings: ["великой снова", "интересной", "эффективной"],
} as const;

export function formatContest2027AwardDate(now = new Date()) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: "Europe/Moscow", year: "numeric", month: "numeric",
  }).formatToParts(now);
  const year = Number(parts.find((part) => part.type === "year")?.value);
  const month = Number(parts.find((part) => part.type === "month")?.value);
  // No award before January 2027; on January 1 the next award becomes February 1.
  const calendar = new Date(year, month - 1, 15);
  return formatNextAwardDate(calendar < new Date(2026, 11, 1) ? new Date(2026, 11, 15) : calendar);
}
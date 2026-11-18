export const CONTEST_2026 = {
  fund: 6_300_000,
  months: 7,
  monthlyFund: 900_000,
  endsOn: "2026-12-31",
} as const;

export function formatContest2026EndDate() {
  const date = new Date(`${CONTEST_2026.endsOn}T00:00:00Z`);
  const dayMonth = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric", month: "long", timeZone: "UTC",
  }).format(date);
  return `${dayMonth} ${date.getUTCFullYear()} года`;
}
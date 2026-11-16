export function formatNextAwardDate(now = new Date()) {
  const year = now.getFullYear();
  const month = now.getMonth();
  const next = new Date(year, month + 1, 1);
  const formatted = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(next);
  return formatted.replace(" г.", " года");
}

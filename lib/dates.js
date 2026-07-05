const DAY_MS = 24 * 60 * 60 * 1000;

export function toISODate(date) {
  return date.toLocaleDateString("en-CA"); // YYYY-MM-DD, local timezone
}

export function addDays(date, n) {
  return new Date(date.getTime() + n * DAY_MS);
}

/** Monday of the week containing `date` (week view mockup runs Mon-Sun). */
export function startOfWeek(date) {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  const day = d.getDay(); // 0 = Sun
  const diff = day === 0 ? -6 : 1 - day;
  return addDays(d, diff);
}

/** Sunday on/before the 1st of `date`'s month (month grid mockup runs Sun-Sat). */
export function startOfMonthGrid(date) {
  const first = new Date(date.getFullYear(), date.getMonth(), 1);
  const day = first.getDay();
  return addDays(first, -day);
}

export function formatMonthYear(date) {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export function formatWeekRange(start, end) {
  const sameMonth = start.getMonth() === end.getMonth();
  const startStr = start.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  const endStr = end.toLocaleDateString("en-US", {
    month: sameMonth ? undefined : "short",
    day: "numeric",
    year: "numeric",
  });
  return `${startStr} - ${endStr}`;
}

import MonthCalendar from "@/components/MonthCalendar";
import { listEventsBetween } from "@/lib/calendar";
import { addDays, startOfMonthGrid, toISODate } from "@/lib/dates";

export const dynamic = "force-dynamic";

export default async function CalendarPage({ searchParams }) {
  const params = await searchParams;
  const anchor = params.month ? new Date(`${params.month}T00:00:00`) : new Date();
  const monthStart = new Date(anchor.getFullYear(), anchor.getMonth(), 1);
  const gridStart = startOfMonthGrid(monthStart);
  const gridEnd = addDays(gridStart, 41);
  const events = listEventsBetween(toISODate(gridStart), toISODate(gridEnd));

  return <MonthCalendar monthISO={toISODate(monthStart)} events={events} />;
}

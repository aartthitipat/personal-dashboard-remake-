import StatCard from "@/components/StatCard";
import WeeklyTimetable from "@/components/WeeklyTimetable";
import { getMonthOverMonthChange, getSummary } from "@/lib/summarizer";
import { listEventsBetween } from "@/lib/calendar";
import { addDays, startOfWeek, toISODate } from "@/lib/dates";

export const dynamic = "force-dynamic";

function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function changeFooter(change) {
  if (!change) return null;
  const positive = change.pctChange >= 0;
  return (
    <p className={positive ? "text-success" : "text-error"}>
      {positive ? "▲" : "▼"} {Math.abs(change.pctChange).toFixed(1)}% from last month
    </p>
  );
}

export default async function Home({ searchParams }) {
  const params = await searchParams;
  const summary = await getSummary();
  const incomeChange = getMonthOverMonthChange(summary.monthlyBreakdown, "income");
  const expenseChange = getMonthOverMonthChange(summary.monthlyBreakdown, "expense");

  const anchor = params.week ? new Date(`${params.week}T00:00:00`) : new Date();
  const weekStart = startOfWeek(anchor);
  const weekEnd = addDays(weekStart, 6);
  const events = await listEventsBetween(toISODate(weekStart), toISODate(weekEnd));

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-2">
        <StatCard
          label="Total Income"
          value={currency(summary.totalIncome)}
          footer={changeFooter(incomeChange)}
        />
        <StatCard
          label="Total Expenses"
          value={currency(summary.totalExpense)}
          footer={changeFooter(expenseChange)}
        />
      </div>

      <WeeklyTimetable weekStartISO={toISODate(weekStart)} events={events} />
    </div>
  );
}

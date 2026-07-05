"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { addDays, formatMonthYear, startOfMonthGrid, toISODate } from "@/lib/dates";
import CreateEventModal from "./CreateEventModal";

const WEEKDAYS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

const TYPE_STYLE = {
  session: "bg-primary text-on-primary",
  exam: "bg-secondary-container text-on-secondary-container",
  deadline: "bg-secondary-container text-on-secondary-container",
  task: "bg-tertiary-container text-on-tertiary-container",
};

/**
 * Month navigation goes through the URL (?month=YYYY-MM-DD) so the Server
 * Component page re-fetches events for the requested range — see
 * WeeklyTimetable for why this replaces a client-side fetch effect.
 */
export default function MonthCalendar({ monthISO, events }) {
  const router = useRouter();
  const [modalDate, setModalDate] = useState(null);
  const monthDate = new Date(`${monthISO}T00:00:00`);
  const todayISO = toISODate(new Date());

  const gridStart = startOfMonthGrid(monthDate);
  const cells = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i));

  function changeMonth(delta) {
    const next = new Date(monthDate.getFullYear(), monthDate.getMonth() + delta, 1);
    router.push(`/calendar?month=${toISODate(next)}`);
  }

  function eventsForDay(iso) {
    return events.filter((e) => e.date === iso);
  }

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <h1 className="font-heading text-2xl font-semibold text-primary">Calendar</h1>
          <div className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-2 py-1.5">
            <button
              onClick={() => changeMonth(-1)}
              aria-label="Previous month"
              className="px-1 text-on-surface-variant hover:text-on-surface"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-on-surface">{formatMonthYear(monthDate)}</span>
            <button
              onClick={() => changeMonth(1)}
              aria-label="Next month"
              className="px-1 text-on-surface-variant hover:text-on-surface"
            >
              ›
            </button>
          </div>
        </div>
        <button
          onClick={() => setModalDate(todayISO)}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
        >
          + Create Event
        </button>
      </div>

      <div className="overflow-hidden rounded-lg border border-outline-variant bg-surface-container-lowest">
        <div className="grid grid-cols-7 border-b border-outline-variant">
          {WEEKDAYS.map((w) => (
            <div key={w} className="py-3 text-center text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              {w}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-7">
          {cells.map((d) => {
            const iso = toISODate(d);
            const inMonth = d.getMonth() === monthDate.getMonth();
            const isToday = iso === todayISO;
            const dayEvents = eventsForDay(iso);

            return (
              <div
                key={iso}
                onClick={() => setModalDate(iso)}
                className={`min-h-[110px] cursor-pointer border-b border-l border-outline-variant p-2 first:border-l-0 hover:bg-surface-container-low/50 ${
                  isToday ? "bg-secondary-container/20" : ""
                }`}
              >
                <span
                  className={`text-sm ${
                    inMonth ? (isToday ? "font-bold text-primary" : "text-on-surface") : "text-on-surface-variant/50"
                  }`}
                >
                  {d.getDate()}
                </span>
                <div className="mt-1 flex flex-col gap-1">
                  {dayEvents.map((ev) => (
                    <span
                      key={ev.id}
                      onClick={(e) => e.stopPropagation()}
                      className={`truncate rounded px-1.5 py-0.5 text-xs font-medium ${
                        TYPE_STYLE[ev.type] || TYPE_STYLE.session
                      }`}
                      title={ev.title}
                    >
                      {ev.title}
                    </span>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {modalDate && (
        <CreateEventModal
          defaultDate={modalDate}
          onClose={() => setModalDate(null)}
          onCreated={() => {
            setModalDate(null);
            router.refresh();
          }}
        />
      )}
    </div>
  );
}

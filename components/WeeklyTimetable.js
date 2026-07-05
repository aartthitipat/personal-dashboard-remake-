"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { addDays, formatWeekRange, toISODate } from "@/lib/dates";
import CreateEventModal from "./CreateEventModal";

const START_HOUR = 7;
const END_HOUR = 21;
const HOURS = Array.from({ length: END_HOUR - START_HOUR }, (_, i) => START_HOUR + i);
const HOUR_HEIGHT = 64;

const TYPE_STYLE = {
  session: "border-primary bg-primary-container/10 text-primary",
  exam: "border-tertiary bg-tertiary-container/10 text-tertiary",
  deadline: "border-tertiary bg-tertiary-container/10 text-tertiary",
  task: "border-secondary bg-secondary-container/10 text-secondary",
};

function minutesFromMidnight(hhmm) {
  const [h, m] = hhmm.split(":").map(Number);
  return h * 60 + m;
}

/**
 * Week navigation goes through the URL (?week=YYYY-MM-DD) so the Server
 * Component page re-fetches events for the requested range — no client-side
 * effect/fetch loop needed, which keeps this component compliant with the
 * React Compiler's set-state-in-effect rule.
 */
export default function WeeklyTimetable({ weekStartISO, events }) {
  const router = useRouter();
  const [modalDate, setModalDate] = useState(null);
  const weekStart = new Date(`${weekStartISO}T00:00:00`);
  const days = Array.from({ length: 7 }, (_, i) => addDays(weekStart, i));
  const todayISO = toISODate(new Date());

  function goToWeek(offsetDays) {
    router.push(`/?week=${toISODate(addDays(weekStart, offsetDays))}`);
  }

  function eventsForDay(dateISO) {
    return events.filter((e) => e.date === dateISO);
  }

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <h2 className="font-heading text-2xl font-semibold text-on-surface">Study Timetable</h2>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex rounded-md border border-outline-variant bg-surface p-0.5 text-sm">
            <span className="cursor-not-allowed rounded px-3 py-1.5 text-on-surface-variant opacity-50">
              Day
            </span>
            <span className="rounded bg-primary px-3 py-1.5 font-medium text-on-primary">Week</span>
            <Link
              href="/calendar"
              className="rounded px-3 py-1.5 text-on-surface-variant hover:bg-surface-container"
            >
              Month
            </Link>
          </div>
          <div className="flex items-center gap-2 rounded-md border border-outline-variant bg-surface px-2 py-1.5">
            <button
              onClick={() => goToWeek(-7)}
              aria-label="Previous week"
              className="px-1 text-on-surface-variant hover:text-on-surface"
            >
              ‹
            </button>
            <span className="text-sm font-semibold text-on-surface">
              {formatWeekRange(days[0], days[6])}
            </span>
            <button
              onClick={() => goToWeek(7)}
              aria-label="Next week"
              className="px-1 text-on-surface-variant hover:text-on-surface"
            >
              ›
            </button>
          </div>
        </div>
      </div>

      <div className="overflow-x-auto rounded-lg border border-outline-variant bg-surface-container-lowest">
        <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)] border-b border-outline-variant">
          <div />
          {days.map((d) => {
            const iso = toISODate(d);
            const isToday = iso === todayISO;
            return (
              <div key={iso} className="border-l border-outline-variant py-3 text-center">
                <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
                  {d.toLocaleDateString("en-US", { weekday: "short" })}
                </p>
                <p className={`text-lg font-semibold ${isToday ? "text-primary" : "text-on-surface"}`}>
                  {d.getDate()}
                </p>
              </div>
            );
          })}
        </div>

        <div className="grid min-w-[720px] grid-cols-[56px_repeat(7,1fr)]">
          <div className="relative">
            {HOURS.map((h) => (
              <div
                key={h}
                style={{ height: HOUR_HEIGHT }}
                className="border-t border-outline-variant px-2 text-right text-xs text-on-surface-variant"
              >
                <span className="relative -top-2">{String(h).padStart(2, "0")}:00</span>
              </div>
            ))}
          </div>

          {days.map((d) => {
            const iso = toISODate(d);
            const isToday = iso === todayISO;
            const nowMinutes = new Date().getHours() * 60 + new Date().getMinutes();
            const showNowLine =
              isToday && nowMinutes >= START_HOUR * 60 && nowMinutes <= END_HOUR * 60;

            return (
              <div
                key={iso}
                onClick={() => setModalDate(iso)}
                className="relative cursor-pointer border-l border-outline-variant hover:bg-surface-container-low/50"
                style={{ height: HOUR_HEIGHT * HOURS.length }}
              >
                {HOURS.map((h) => (
                  <div key={h} style={{ height: HOUR_HEIGHT }} className="border-t border-outline-variant" />
                ))}

                {showNowLine && (
                  <div
                    className="pointer-events-none absolute left-0 right-0 border-t-2 border-primary"
                    style={{ top: ((nowMinutes - START_HOUR * 60) / 60) * HOUR_HEIGHT }}
                  >
                    <span className="absolute -left-1 -top-1 h-2 w-2 rounded-full bg-primary" />
                  </div>
                )}

                {eventsForDay(iso).map((ev) => {
                  if (!ev.start_time) return null;
                  const startMin = minutesFromMidnight(ev.start_time) - START_HOUR * 60;
                  const endMin = ev.end_time
                    ? minutesFromMidnight(ev.end_time) - START_HOUR * 60
                    : startMin + 60;
                  const top = (startMin / 60) * HOUR_HEIGHT;
                  const height = Math.max(((endMin - startMin) / 60) * HOUR_HEIGHT, 32);
                  const style = TYPE_STYLE[ev.type] || TYPE_STYLE.session;

                  return (
                    <div
                      key={ev.id}
                      onClick={(e) => e.stopPropagation()}
                      className={`absolute left-1 right-1 overflow-hidden rounded-md border-l-4 px-2 py-1 text-xs ${style}`}
                      style={{ top, height }}
                    >
                      <p className="font-semibold text-on-surface">
                        {ev.start_time}
                        {ev.end_time ? ` - ${ev.end_time}` : ""}
                      </p>
                      <p className="font-medium text-on-surface">{ev.title}</p>
                      {ev.location && <p className="text-on-surface-variant">{ev.location}</p>}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
      </div>

      <button
        onClick={() => setModalDate(todayISO)}
        aria-label="Create event"
        className="fixed bottom-8 right-8 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-2xl text-on-primary shadow-lg hover:opacity-90"
      >
        +
      </button>

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

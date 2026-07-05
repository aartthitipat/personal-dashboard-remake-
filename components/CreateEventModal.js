"use client";

import { useState } from "react";

const TYPES = [
  { value: "session", label: "Study Session" },
  { value: "exam", label: "Exam" },
  { value: "deadline", label: "Deadline" },
  { value: "task", label: "Task" },
];

export default function CreateEventModal({ defaultDate, onClose, onCreated }) {
  const [form, setForm] = useState({
    title: "",
    type: "session",
    date: defaultDate,
    start_time: "09:00",
    end_time: "10:00",
    location: "",
  });
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/events", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create event");
      onCreated();
    } catch (err) {
      setError(err.message);
      setSaving(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4">
      <div className="w-full max-w-md rounded-lg border border-outline-variant bg-surface-container-lowest p-6 shadow-xl">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-heading text-lg font-semibold text-on-surface">Create Event</h2>
          <button onClick={onClose} className="text-on-surface-variant hover:text-on-surface">
            ✕
          </button>
        </div>

        {error && (
          <p className="mb-4 rounded-md bg-error-container px-3 py-2 text-sm text-on-error-container">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="grid grid-cols-2 gap-3">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="col-span-2 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="col-span-2 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            {TYPES.map((t) => (
              <option key={t.value} value={t.value}>
                {t.label}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="col-span-2 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={form.start_time}
            onChange={(e) => setForm({ ...form, start_time: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            type="time"
            value={form.end_time}
            onChange={(e) => setForm({ ...form, end_time: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            placeholder="Location"
            value={form.location}
            onChange={(e) => setForm({ ...form, location: e.target.value })}
            className="col-span-2 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            disabled={saving}
            className="col-span-2 mt-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90 disabled:opacity-60"
          >
            {saving ? "Saving…" : "Save Event"}
          </button>
        </form>
      </div>
    </div>
  );
}

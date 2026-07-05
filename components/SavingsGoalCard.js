"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function SavingsGoalCard({ goal }) {
  const router = useRouter();
  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState({
    label: goal?.label || "Savings Goal",
    target_amount: goal?.target_amount ?? "",
    current_amount: goal?.current_amount ?? "",
    target_date: goal?.target_date ?? "",
  });

  async function handleSave(e) {
    e.preventDefault();
    await fetch("/api/savings-goal", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        target_amount: Number(form.target_amount),
        current_amount: Number(form.current_amount) || 0,
      }),
    });
    setEditing(false);
    router.refresh();
  }

  if (editing || !goal) {
    return (
      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
        <form onSubmit={handleSave} className="flex flex-col gap-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            {goal ? "Edit Savings Goal" : "Set a Savings Goal"}
          </p>
          <input
            placeholder="Goal name (e.g. Semester Goal)"
            value={form.label}
            onChange={(e) => setForm({ ...form, label: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <div className="grid grid-cols-2 gap-3">
            <input
              required
              type="number"
              step="0.01"
              placeholder="Target amount"
              value={form.target_amount}
              onChange={(e) => setForm({ ...form, target_amount: e.target.value })}
              className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
            />
            <input
              type="number"
              step="0.01"
              placeholder="Saved so far"
              value={form.current_amount}
              onChange={(e) => setForm({ ...form, current_amount: e.target.value })}
              className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
            />
          </div>
          <input
            type="date"
            value={form.target_date || ""}
            onChange={(e) => setForm({ ...form, target_date: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary"
            >
              Save
            </button>
            {goal && (
              <button
                type="button"
                onClick={() => setEditing(false)}
                className="rounded-md border border-outline-variant px-3 py-1.5 text-xs text-on-surface-variant"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>
    );
  }

  const pct = Math.min(100, Math.round((goal.current_amount / goal.target_amount) * 100));

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
      <div className="mb-4 flex justify-end">
        <button
          onClick={() => setEditing(true)}
          className="rounded-full bg-surface-container px-3 py-1 text-xs font-medium text-on-surface-variant hover:bg-surface-container-high"
        >
          {goal.label}
        </button>
      </div>
      <p className="text-sm text-on-surface-variant">Savings Goal</p>
      <p className="mt-1 font-heading text-3xl font-semibold text-on-surface">
        {currency(goal.current_amount)}
        <span className="text-lg font-normal text-on-surface-variant"> / {currency(goal.target_amount)}</span>
      </p>
      <div className="mt-4 flex items-center gap-3">
        <div className="h-2 flex-1 overflow-hidden rounded-full bg-surface-container">
          <div className="h-full rounded-full bg-primary" style={{ width: `${pct}%` }} />
        </div>
        <span className="text-sm font-medium text-on-surface">{pct}%</span>
      </div>
      {goal.target_date && (
        <p className="mt-3 text-sm text-on-surface-variant">
          Target date: {new Date(`${goal.target_date}T00:00:00`).toLocaleDateString("en-US", {
            month: "short",
            year: "numeric",
          })}
        </p>
      )}
    </div>
  );
}

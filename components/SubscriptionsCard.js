"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

export default function SubscriptionsCard({ subscriptions }) {
  const router = useRouter();
  const [managing, setManaging] = useState(false);
  const [form, setForm] = useState({ name: "", plan: "", amount: "" });

  async function handleAdd(e) {
    e.preventDefault();
    await fetch("/api/subscriptions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setForm({ name: "", plan: "", amount: "" });
    router.refresh();
  }

  async function handleDelete(id) {
    await fetch(`/api/subscriptions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
      <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
        Active Subscriptions
      </h2>
      <ul className="space-y-4">
        {subscriptions.map((s) => (
          <li key={s.id} className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-3">
              <span className="flex h-9 w-9 items-center justify-center rounded-md bg-secondary-container text-sm font-semibold text-on-secondary-container">
                {s.name.charAt(0)}
              </span>
              <div>
                <p className="font-medium text-on-surface">{s.name}</p>
                {s.plan && <p className="text-on-surface-variant">{s.plan}</p>}
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="font-medium text-on-surface">{currency(s.amount)}</span>
              {managing && (
                <button
                  onClick={() => handleDelete(s.id)}
                  className="text-xs text-error hover:underline"
                >
                  Remove
                </button>
              )}
            </div>
          </li>
        ))}
        {subscriptions.length === 0 && (
          <p className="text-sm text-on-surface-variant">No subscriptions yet.</p>
        )}
      </ul>

      {managing && (
        <form onSubmit={handleAdd} className="mt-4 grid grid-cols-2 gap-2 border-t border-outline-variant pt-4">
          <input
            required
            placeholder="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            className="col-span-2 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            placeholder="Plan (optional)"
            value={form.plan}
            onChange={(e) => setForm({ ...form, plan: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            required
            type="number"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="col-span-2 rounded-md bg-primary px-3 py-1.5 text-xs font-medium text-on-primary"
          >
            Add Subscription
          </button>
        </form>
      )}

      <button
        onClick={() => setManaging((v) => !v)}
        className="mt-4 w-full rounded-md border border-outline-variant py-2 text-sm font-medium text-primary hover:bg-surface-container"
      >
        {managing ? "Done" : "Manage Subscriptions"}
      </button>
    </div>
  );
}

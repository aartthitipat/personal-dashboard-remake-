"use client";

import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import StatCard from "./StatCard";
import SpendingChart from "./SpendingChart";
import SavingsGoalCard from "./SavingsGoalCard";
import SubscriptionsCard from "./SubscriptionsCard";

const CATEGORIES = [
  "Food & Drink",
  "Groceries",
  "Housing",
  "Education",
  "Transport",
  "Subscriptions",
  "Salary",
  "Refund",
  "Other",
];

function currency(n) {
  return n.toLocaleString("en-US", { style: "currency", currency: "USD" });
}

function toChartData(monthlyBreakdown) {
  const months = new Map();
  for (const row of monthlyBreakdown) {
    if (!months.has(row.month)) months.set(row.month, { month: row.month, income: 0, expense: 0 });
    months.get(row.month)[row.type === "income" ? "income" : "expense"] += row.total;
  }
  return [...months.values()].sort((a, b) => a.month.localeCompare(b.month));
}

function exportTransactionsCsv(transactions) {
  const header = ["Date", "Vendor", "Category", "Type", "Status", "Amount"];
  const rows = transactions.map((t) => [t.date, t.vendor, t.category, t.type, t.status, t.amount]);
  const csv = [header, ...rows]
    .map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(","))
    .join("\n");
  const blob = new Blob([csv], { type: "text/csv" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `transactions-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function FinancesDashboard({ summary, transactions, savingsGoal, subscriptions }) {
  const router = useRouter();
  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({
    type: "expense",
    amount: "",
    vendor: "",
    category: CATEGORIES[0],
    date: new Date().toISOString().slice(0, 10),
  });

  async function handleUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    setUploadError(null);
    try {
      const body = new FormData();
      body.append("slip", file);
      const res = await fetch("/api/slips", { method: "POST", body });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Upload failed");
      router.refresh();
    } catch (err) {
      setUploadError(err.message);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  }

  async function handleAddTransaction(e) {
    e.preventDefault();
    await fetch("/api/transactions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form, amount: Number(form.amount) }),
    });
    setShowAddForm(false);
    setForm({ ...form, amount: "", vendor: "" });
    router.refresh();
  }

  async function confirmSlip(id) {
    await fetch(`/api/transactions/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status: "completed" }),
    });
    router.refresh();
  }

  async function deleteSlip(id) {
    await fetch(`/api/transactions/${id}`, { method: "DELETE" });
    router.refresh();
  }

  const chartData = toChartData(summary.monthlyBreakdown);

  return (
    <div className="mx-auto max-w-6xl px-6 py-10">
      <div className="mb-8 flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="font-heading text-3xl font-semibold text-on-surface">Financial Overview</h1>
          <p className="mt-1 text-sm text-on-surface-variant">
            Tracking your study budget and personal expenses.
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <label className="cursor-pointer rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container">
            {uploading ? "Reading slip…" : "Upload Slip"}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleUpload}
              disabled={uploading}
            />
          </label>
          <button
            onClick={() => exportTransactionsCsv(transactions)}
            className="rounded-md border border-outline-variant bg-surface-container-lowest px-4 py-2 text-sm font-medium text-on-surface hover:bg-surface-container"
          >
            ↓ Export
          </button>
          <button
            onClick={() => setShowAddForm((v) => !v)}
            className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary hover:opacity-90"
          >
            + New Transaction
          </button>
        </div>
      </div>

      {uploadError && (
        <p className="mb-6 rounded-md bg-error-container px-4 py-3 text-sm text-on-error-container">
          {uploadError}
        </p>
      )}

      {showAddForm && (
        <form
          onSubmit={handleAddTransaction}
          className="mb-8 grid grid-cols-2 gap-4 rounded-lg border border-outline-variant bg-surface-container-lowest p-6 md:grid-cols-5"
        >
          <select
            value={form.type}
            onChange={(e) => setForm({ ...form, type: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            <option value="expense">Expense</option>
            <option value="income">Income</option>
          </select>
          <input
            required
            type="number"
            step="0.01"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <input
            required
            placeholder="Vendor"
            value={form.vendor}
            onChange={(e) => setForm({ ...form, vendor: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          >
            {CATEGORIES.map((c) => (
              <option key={c} value={c}>
                {c}
              </option>
            ))}
          </select>
          <input
            required
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
            className="rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
          />
          <button
            type="submit"
            className="col-span-2 rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary md:col-span-1"
          >
            Save
          </button>
        </form>
      )}

      <div className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
        <StatCard label="Total Balance" value={currency(summary.totalBalance)} badge="Current" />
        <SavingsGoalCard goal={savingsGoal} />

        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
              Pending Slips
            </h2>
            {summary.pendingSlips.length > 0 && (
              <span className="rounded-full bg-error-container px-2 py-0.5 text-xs font-medium text-on-error-container">
                Action Required
              </span>
            )}
          </div>
          <p className="mb-4 font-heading text-2xl font-semibold text-on-surface">
            {summary.pendingSlips.length} Items
            <span className="ml-2 text-sm font-normal text-on-surface-variant">
              {currency(summary.pendingTotal)}
            </span>
          </p>
          <ul className="space-y-3">
            {summary.pendingSlips.map((slip) => (
              <li key={slip.id} className="flex items-center justify-between text-sm">
                <div>
                  <p className="font-medium text-on-surface">{slip.vendor}</p>
                  <p className="text-on-surface-variant">
                    {slip.type} · {currency(slip.amount)}
                  </p>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => confirmSlip(slip.id)}
                    className="rounded-md bg-primary px-2 py-1 text-xs text-on-primary"
                  >
                    Confirm
                  </button>
                  <button
                    onClick={() => deleteSlip(slip.id)}
                    className="rounded-md border border-outline-variant px-2 py-1 text-xs text-on-surface-variant"
                  >
                    Delete
                  </button>
                </div>
              </li>
            ))}
            {summary.pendingSlips.length === 0 && (
              <p className="text-sm text-on-surface-variant">Nothing pending review.</p>
            )}
          </ul>
        </div>
      </div>

      <div className="mb-8 grid grid-cols-1 gap-4 lg:grid-cols-3">
        <div className="rounded-lg border border-outline-variant bg-surface-container-lowest p-6 lg:col-span-2">
          <h2 className="mb-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
            Monthly Spending Breakdown
          </h2>
          <SpendingChart data={chartData} />
        </div>

        <SubscriptionsCard subscriptions={subscriptions} />
      </div>

      <div className="rounded-lg border border-outline-variant bg-surface-container-lowest">
        <h2 className="border-b border-outline-variant px-6 py-4 text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          Transaction History
        </h2>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-xs uppercase tracking-wide text-on-surface-variant">
              <th className="px-6 py-3 font-medium">Vendor</th>
              <th className="px-6 py-3 font-medium">Category</th>
              <th className="px-6 py-3 font-medium">Date</th>
              <th className="px-6 py-3 font-medium">Status</th>
              <th className="px-6 py-3 text-right font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((t) => (
              <tr key={t.id} className="border-t border-outline-variant">
                <td className="px-6 py-3 text-on-surface">{t.vendor}</td>
                <td className="px-6 py-3">
                  <span className="rounded-full bg-surface-container px-2 py-1 text-xs text-on-surface-variant">
                    {t.category}
                  </span>
                </td>
                <td className="px-6 py-3 text-on-surface-variant">{t.date}</td>
                <td className="px-6 py-3 text-on-surface-variant">{t.status}</td>
                <td
                  className={`px-6 py-3 text-right font-medium ${
                    t.type === "income" ? "text-success" : "text-on-surface"
                  }`}
                >
                  {t.type === "income" ? "+" : "-"}
                  {currency(t.amount)}
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={5} className="px-6 py-8 text-center text-on-surface-variant">
                  No transactions yet.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

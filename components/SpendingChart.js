"use client";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function SpendingChart({ data }) {
  if (data.length === 0) {
    return (
      <p className="flex h-64 items-center justify-center text-sm text-on-surface-variant">
        No completed transactions yet.
      </p>
    );
  }

  return (
    <ResponsiveContainer width="100%" height={280}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--color-outline-variant)" />
        <XAxis dataKey="month" stroke="var(--color-on-surface-variant)" fontSize={12} />
        <YAxis stroke="var(--color-on-surface-variant)" fontSize={12} />
        <Tooltip
          contentStyle={{
            background: "var(--color-surface-container-lowest)",
            border: "1px solid var(--color-outline-variant)",
            borderRadius: "0.5rem",
          }}
        />
        <Legend />
        <Bar dataKey="income" fill="var(--color-success)" radius={[4, 4, 0, 0]} />
        <Bar dataKey="expense" fill="var(--color-error)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
}

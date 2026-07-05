import getDb from "./db";

/**
 * The summarizer/reporter: turns raw transaction rows into the aggregate
 * numbers the dashboard displays. Only "completed" transactions count
 * towards totals — rows Rude flagged "pending_review" are excluded until
 * a human confirms them.
 */
export function getSummary() {
  const db = getDb();

  const { totalIncome = 0, totalExpense = 0 } = db
    .prepare(
      `SELECT
         COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) AS totalIncome,
         COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) AS totalExpense
       FROM transactions
       WHERE status = 'completed'`
    )
    .get();

  const totalBalance = totalIncome - totalExpense;

  const monthlyBreakdown = db
    .prepare(
      `SELECT
         strftime('%Y-%m', date) AS month,
         category,
         type,
         SUM(amount) AS total
       FROM transactions
       WHERE status = 'completed'
       GROUP BY month, category, type
       ORDER BY month ASC`
    )
    .all();

  const pendingSlips = db
    .prepare(
      `SELECT id, amount, vendor, type, date
       FROM transactions
       WHERE status = 'pending_review'
       ORDER BY created_at DESC`
    )
    .all();

  const pendingTotal = pendingSlips.reduce((sum, slip) => sum + slip.amount, 0);

  return {
    totalBalance,
    totalIncome,
    totalExpense,
    monthlyBreakdown,
    pendingSlips,
    pendingTotal,
  };
}

/**
 * Compares the most recent month present in monthlyBreakdown against the
 * one before it for a given transaction type. Returns null when there
 * isn't at least two months of history to compare.
 */
export function getMonthOverMonthChange(monthlyBreakdown, type) {
  const totalsByMonth = new Map();
  for (const row of monthlyBreakdown) {
    if (row.type !== type) continue;
    totalsByMonth.set(row.month, (totalsByMonth.get(row.month) || 0) + row.total);
  }
  const months = [...totalsByMonth.keys()].sort();
  if (months.length < 2) return null;

  const current = totalsByMonth.get(months[months.length - 1]);
  const previous = totalsByMonth.get(months[months.length - 2]);
  if (!previous) return null;

  return { current, previous, pctChange: ((current - previous) / previous) * 100 };
}

export function listTransactions({ limit = 50 } = {}) {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, type, amount, vendor, category, date, status
       FROM transactions
       ORDER BY date DESC, id DESC
       LIMIT ?`
    )
    .all(limit);
}

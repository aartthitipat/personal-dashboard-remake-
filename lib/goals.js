import getDb from "./db";

export function getSavingsGoal() {
  const db = getDb();
  const goal = db
    .prepare(`SELECT label, target_amount, current_amount, target_date FROM savings_goal WHERE id = 1`)
    .get();
  return goal || null;
}

export function setSavingsGoal({ label, target_amount, current_amount, target_date }) {
  const db = getDb();
  db.prepare(
    `INSERT INTO savings_goal (id, label, target_amount, current_amount, target_date, updated_at)
     VALUES (1, ?, ?, ?, ?, datetime('now'))
     ON CONFLICT (id) DO UPDATE SET
       label = excluded.label,
       target_amount = excluded.target_amount,
       current_amount = excluded.current_amount,
       target_date = excluded.target_date,
       updated_at = datetime('now')`
  ).run(label || "Savings Goal", target_amount, current_amount || 0, target_date || null);
}

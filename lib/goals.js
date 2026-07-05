import getDb from "./db";

export async function getSavingsGoal() {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT label, target_amount, current_amount, target_date FROM savings_goal WHERE id = 1`
  );
  return rows[0] || null;
}

export async function setSavingsGoal({ label, target_amount, current_amount, target_date }) {
  const db = getDb();
  await db.query(
    `INSERT INTO savings_goal (id, label, target_amount, current_amount, target_date, updated_at)
     VALUES (1, $1, $2, $3, $4, now())
     ON CONFLICT (id) DO UPDATE SET
       label = excluded.label,
       target_amount = excluded.target_amount,
       current_amount = excluded.current_amount,
       target_date = excluded.target_date,
       updated_at = now()`,
    [label || "Savings Goal", target_amount, current_amount || 0, target_date || null]
  );
}

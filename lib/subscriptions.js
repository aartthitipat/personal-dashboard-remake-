import getDb from "./db";

export async function listSubscriptions() {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, name, plan, amount FROM subscriptions ORDER BY created_at DESC`
  );
  return rows;
}

export async function createSubscription({ name, plan, amount }) {
  const db = getDb();
  const { rows } = await db.query(
    `INSERT INTO subscriptions (name, plan, amount) VALUES ($1, $2, $3) RETURNING id`,
    [name, plan || null, amount]
  );
  return rows[0].id;
}

export async function deleteSubscription(id) {
  const db = getDb();
  await db.query(`DELETE FROM subscriptions WHERE id = $1`, [id]);
}

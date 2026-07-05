import getDb from "./db";

export function listSubscriptions() {
  const db = getDb();
  return db
    .prepare(`SELECT id, name, plan, amount FROM subscriptions ORDER BY created_at DESC`)
    .all();
}

export function createSubscription({ name, plan, amount }) {
  const db = getDb();
  const result = db
    .prepare(`INSERT INTO subscriptions (name, plan, amount) VALUES (?, ?, ?)`)
    .run(name, plan || null, amount);
  return result.lastInsertRowid;
}

export function deleteSubscription(id) {
  const db = getDb();
  db.prepare(`DELETE FROM subscriptions WHERE id = ?`).run(id);
}

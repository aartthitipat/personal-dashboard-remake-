import getDb from "./db";

export function listEventsBetween(startDate, endDate) {
  const db = getDb();
  return db
    .prepare(
      `SELECT id, title, type, date, start_time, end_time, location
       FROM events
       WHERE date BETWEEN ? AND ?
       ORDER BY date ASC, start_time ASC`
    )
    .all(startDate, endDate);
}

export function createEvent({ title, type = "session", date, start_time, end_time, location }) {
  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO events (title, type, date, start_time, end_time, location)
       VALUES (?, ?, ?, ?, ?, ?)`
    )
    .run(title, type, date, start_time || null, end_time || null, location || null);
  return result.lastInsertRowid;
}

const UPDATABLE_FIELDS = new Set(["title", "type", "date", "start_time", "end_time", "location"]);

export function updateEvent(id, patch) {
  const db = getDb();
  const fields = Object.keys(patch).filter((f) => UPDATABLE_FIELDS.has(f));
  if (fields.length === 0) return;
  const setClause = fields.map((f) => `${f} = ?`).join(", ");
  db.prepare(`UPDATE events SET ${setClause} WHERE id = ?`).run(...fields.map((f) => patch[f]), id);
}

export function deleteEvent(id) {
  const db = getDb();
  db.prepare(`DELETE FROM events WHERE id = ?`).run(id);
}

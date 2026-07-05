import getDb from "./db";

export async function listEventsBetween(startDate, endDate) {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, title, type, date, start_time, end_time, location
     FROM events
     WHERE date BETWEEN $1 AND $2
     ORDER BY date ASC, start_time ASC`,
    [startDate, endDate]
  );
  return rows;
}

export async function createEvent({ title, type = "session", date, start_time, end_time, location }) {
  const db = getDb();
  const { rows } = await db.query(
    `INSERT INTO events (title, type, date, start_time, end_time, location)
     VALUES ($1, $2, $3, $4, $5, $6)
     RETURNING id`,
    [title, type, date, start_time || null, end_time || null, location || null]
  );
  return rows[0].id;
}

const UPDATABLE_FIELDS = new Set(["title", "type", "date", "start_time", "end_time", "location"]);

export async function updateEvent(id, patch) {
  const db = getDb();
  const fields = Object.keys(patch).filter((f) => UPDATABLE_FIELDS.has(f));
  if (fields.length === 0) return;
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  await db.query(
    `UPDATE events SET ${setClause} WHERE id = $${fields.length + 1}`,
    [...fields.map((f) => patch[f]), id]
  );
}

export async function deleteEvent(id) {
  const db = getDb();
  await db.query(`DELETE FROM events WHERE id = $1`, [id]);
}

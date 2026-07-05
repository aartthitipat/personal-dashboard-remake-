import { NextResponse } from "next/server";
import getDb from "@/lib/db";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const updates = await request.json();

  const allowed = ["type", "amount", "vendor", "category", "date", "status"];
  const fields = Object.keys(updates).filter((key) => allowed.includes(key));

  if (fields.length === 0) {
    return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
  }

  const db = getDb();
  const setClause = fields.map((field) => `${field} = ?`).join(", ");
  const values = fields.map((field) => updates[field]);

  db.prepare(`UPDATE transactions SET ${setClause} WHERE id = ?`).run(...values, id);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const db = getDb();
  db.prepare(`DELETE FROM transactions WHERE id = ?`).run(id);
  return NextResponse.json({ ok: true });
}

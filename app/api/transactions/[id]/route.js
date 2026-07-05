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
  const setClause = fields.map((field, i) => `${field} = $${i + 1}`).join(", ");
  const values = fields.map((field) => updates[field]);

  await db.query(`UPDATE transactions SET ${setClause} WHERE id = $${fields.length + 1}`, [...values, id]);

  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  const db = getDb();
  await db.query(`DELETE FROM transactions WHERE id = $1`, [id]);
  return NextResponse.json({ ok: true });
}

import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { listTransactions } from "@/lib/summarizer";

export async function GET() {
  return NextResponse.json(await listTransactions());
}

export async function POST(request) {
  const body = await request.json();
  const { type, amount, vendor, category, date } = body;

  if (!["income", "expense"].includes(type) || !amount || !vendor || !category || !date) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const db = getDb();
  const { rows } = await db.query(
    `INSERT INTO transactions (type, amount, vendor, category, date, status)
     VALUES ($1, $2, $3, $4, $5, 'completed')
     RETURNING id`,
    [type, amount, vendor, category, date]
  );

  return NextResponse.json({ id: rows[0].id }, { status: 201 });
}

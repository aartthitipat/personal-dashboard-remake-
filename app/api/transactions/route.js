import { NextResponse } from "next/server";
import getDb from "@/lib/db";
import { listTransactions } from "@/lib/summarizer";

export async function GET() {
  return NextResponse.json(listTransactions());
}

export async function POST(request) {
  const body = await request.json();
  const { type, amount, vendor, category, date } = body;

  if (!["income", "expense"].includes(type) || !amount || !vendor || !category || !date) {
    return NextResponse.json({ error: "Missing or invalid fields" }, { status: 400 });
  }

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO transactions (type, amount, vendor, category, date, status)
       VALUES (?, ?, ?, ?, ?, 'completed')`
    )
    .run(type, amount, vendor, category, date);

  return NextResponse.json({ id: result.lastInsertRowid }, { status: 201 });
}

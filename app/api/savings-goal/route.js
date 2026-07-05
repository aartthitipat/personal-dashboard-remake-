import { NextResponse } from "next/server";
import { getSavingsGoal, setSavingsGoal } from "@/lib/goals";

export async function GET() {
  return NextResponse.json(await getSavingsGoal());
}

export async function PUT(request) {
  const body = await request.json();
  const { target_amount, current_amount } = body;
  if (!target_amount) {
    return NextResponse.json({ error: "target_amount is required" }, { status: 400 });
  }
  await setSavingsGoal(body);
  return NextResponse.json(await getSavingsGoal());
}

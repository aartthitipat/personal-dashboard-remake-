import { NextResponse } from "next/server";
import { createSubscription, listSubscriptions } from "@/lib/subscriptions";

export async function GET() {
  return NextResponse.json(listSubscriptions());
}

export async function POST(request) {
  const body = await request.json();
  const { name, plan, amount } = body;
  if (!name || !amount) {
    return NextResponse.json({ error: "name and amount are required" }, { status: 400 });
  }
  const id = createSubscription({ name, plan, amount });
  return NextResponse.json({ id }, { status: 201 });
}

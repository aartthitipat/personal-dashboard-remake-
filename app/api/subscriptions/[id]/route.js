import { NextResponse } from "next/server";
import { deleteSubscription } from "@/lib/subscriptions";

export async function DELETE(request, { params }) {
  const { id } = await params;
  deleteSubscription(Number(id));
  return NextResponse.json({ ok: true });
}

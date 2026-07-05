import { NextResponse } from "next/server";
import { deleteSubscription } from "@/lib/subscriptions";

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteSubscription(Number(id));
  return NextResponse.json({ ok: true });
}

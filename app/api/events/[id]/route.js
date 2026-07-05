import { NextResponse } from "next/server";
import { deleteEvent, updateEvent } from "@/lib/calendar";

export async function PATCH(request, { params }) {
  const { id } = await params;
  const body = await request.json();
  await updateEvent(Number(id), body);
  return NextResponse.json({ ok: true });
}

export async function DELETE(request, { params }) {
  const { id } = await params;
  await deleteEvent(Number(id));
  return NextResponse.json({ ok: true });
}

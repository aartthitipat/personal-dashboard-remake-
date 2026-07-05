import { NextResponse } from "next/server";
import { createEvent, listEventsBetween } from "@/lib/calendar";

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const start = searchParams.get("start");
  const end = searchParams.get("end");
  if (!start || !end) {
    return NextResponse.json({ error: "start and end query params are required" }, { status: 400 });
  }
  return NextResponse.json(listEventsBetween(start, end));
}

export async function POST(request) {
  const body = await request.json();
  const { title, type, date, start_time, end_time, location } = body;

  if (!title || !date) {
    return NextResponse.json({ error: "title and date are required" }, { status: 400 });
  }

  const id = createEvent({ title, type, date, start_time, end_time, location });
  return NextResponse.json({ id }, { status: 201 });
}

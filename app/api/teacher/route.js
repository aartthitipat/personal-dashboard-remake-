import { NextResponse } from "next/server";
import { getHistory, sendMessage } from "@/lib/teacher";

export async function GET() {
  return NextResponse.json(getHistory());
}

export async function POST(request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const { id, reply } = await sendMessage(message.trim());
    return NextResponse.json({ id, reply }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: `tad couldn't respond: ${err.message}` }, { status: 502 });
  }
}

import { NextResponse } from "next/server";
import { getHistory, sendMessage } from "@/lib/researcher";

export async function GET() {
  return NextResponse.json(getHistory());
}

export async function POST(request) {
  const { message } = await request.json();

  if (!message || typeof message !== "string" || !message.trim()) {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  try {
    const { id, reply, sources } = await sendMessage(message.trim());
    return NextResponse.json({ id, reply, sources }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ error: `hee couldn't respond: ${err.message}` }, { status: 502 });
  }
}

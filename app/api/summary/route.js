import { NextResponse } from "next/server";
import { getSummary } from "@/lib/summarizer";

export async function GET() {
  return NextResponse.json(getSummary());
}

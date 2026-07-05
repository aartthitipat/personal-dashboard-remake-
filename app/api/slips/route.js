import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import path from "node:path";
import getDb from "@/lib/db";
import { extractSlipData, decideReviewStatus } from "@/lib/rude";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "slips");

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("slip");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No slip image uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  let extraction;
  try {
    extraction = await extractSlipData(buffer, file.type || "image/jpeg");
  } catch (err) {
    return NextResponse.json(
      { error: `Rude couldn't read this slip: ${err.message}` },
      { status: 502 }
    );
  }

  let status;
  try {
    status = decideReviewStatus(extraction);
  } catch (err) {
    return NextResponse.json(
      {
        error:
          "lib/rude.js:decideReviewStatus() isn't implemented yet, so slips can't be filed automatically.",
      },
      { status: 501 }
    );
  }

  await mkdir(UPLOAD_DIR, { recursive: true });
  const filename = `${Date.now()}-${file.name || "slip"}`.replace(/[^a-zA-Z0-9.\-_]/g, "_");
  await writeFile(path.join(UPLOAD_DIR, filename), buffer);
  const slipImagePath = `/uploads/slips/${filename}`;

  const db = getDb();
  const result = db
    .prepare(
      `INSERT INTO transactions (type, amount, vendor, category, date, status, slip_image_path, confidence)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`
    )
    .run(
      extraction.type,
      extraction.amount,
      extraction.vendor,
      extraction.category,
      extraction.date,
      status,
      slipImagePath,
      extraction.confidence
    );

  return NextResponse.json({ id: result.lastInsertRowid, ...extraction, status }, { status: 201 });
}

import { NextResponse } from "next/server";
import { mkdir, writeFile } from "node:fs/promises";
import { randomUUID } from "node:crypto";
import path from "node:path";
import getDb from "@/lib/db";
import { extractSlipData, decideReviewStatus } from "@/lib/rude";

const UPLOAD_DIR = path.join(process.cwd(), "public", "uploads", "slips");

// Signatures for the image types Claude's vision API accepts. We identify
// the file by these magic bytes rather than the client-supplied filename or
// Content-Type — both are attacker-controlled, and trusting either lets a
// malicious upload pick its own extension (e.g. ".svg"/".html") and get
// served back out of `public/` as executable content: stored XSS.
const IMAGE_SIGNATURES = [
  { mediaType: "image/png", ext: ".png", magic: [0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a] },
  { mediaType: "image/jpeg", ext: ".jpg", magic: [0xff, 0xd8, 0xff] },
  { mediaType: "image/gif", ext: ".gif", magic: [0x47, 0x49, 0x46, 0x38] },
  { mediaType: "image/webp", ext: ".webp", magic: [0x52, 0x49, 0x46, 0x46], magicAtOffset8: [0x57, 0x45, 0x42, 0x50] },
];

function sniffImageType(buffer) {
  for (const sig of IMAGE_SIGNATURES) {
    const headMatches = sig.magic.every((byte, i) => buffer[i] === byte);
    if (!headMatches) continue;
    if (sig.magicAtOffset8 && !sig.magicAtOffset8.every((byte, i) => buffer[8 + i] === byte)) continue;
    return sig;
  }
  return null;
}

export async function POST(request) {
  const formData = await request.formData();
  const file = formData.get("slip");

  if (!file || typeof file === "string") {
    return NextResponse.json({ error: "No slip image uploaded" }, { status: 400 });
  }

  const buffer = Buffer.from(await file.arrayBuffer());

  const signature = sniffImageType(buffer);
  if (!signature) {
    return NextResponse.json(
      { error: "Unsupported file type. Upload a JPEG, PNG, GIF, or WEBP image." },
      { status: 415 }
    );
  }

  let extraction;
  try {
    extraction = await extractSlipData(buffer, signature.mediaType);
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
  const filename = `${Date.now()}-${randomUUID()}${signature.ext}`;
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

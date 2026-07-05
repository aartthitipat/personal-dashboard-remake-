import Anthropic from "@anthropic-ai/sdk";

const MODEL = process.env.RUDE_MODEL || "claude-haiku-4-5-20251001";

const CATEGORIES = [
  "Food & Drink",
  "Groceries",
  "Housing",
  "Education",
  "Transport",
  "Subscriptions",
  "Salary",
  "Refund",
  "Other",
];

const RECORD_SLIP_TOOL = {
  name: "record_slip",
  description:
    "Record the transaction details read off a photographed receipt or transfer slip.",
  input_schema: {
    type: "object",
    properties: {
      type: {
        type: "string",
        enum: ["income", "expense"],
        description: "Whether money came in (income) or went out (expense).",
      },
      amount: {
        type: "number",
        description: "The transaction amount as a positive number.",
      },
      vendor: {
        type: "string",
        description: "The merchant, payer, or payee name printed on the slip.",
      },
      category: {
        type: "string",
        enum: CATEGORIES,
      },
      date: {
        type: "string",
        description: "Transaction date in YYYY-MM-DD format. Use today if illegible.",
      },
      confidence: {
        type: "number",
        description:
          "Your confidence that amount and type were read correctly, from 0 (illegible/guessed) to 1 (certain).",
      },
    },
    required: ["type", "amount", "vendor", "category", "date", "confidence"],
  },
};

/**
 * Rude reads a photographed slip and extracts the transaction it represents.
 * @param {Buffer} imageBuffer
 * @param {string} mediaType e.g. "image/jpeg"
 * @returns {Promise<{type: string, amount: number, vendor: string, category: string, date: string, confidence: number}>}
 */
export async function extractSlipData(imageBuffer, mediaType) {
  const client = new Anthropic();

  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 512,
    tools: [RECORD_SLIP_TOOL],
    tool_choice: { type: "tool", name: "record_slip" },
    messages: [
      {
        role: "user",
        content: [
          {
            type: "image",
            source: {
              type: "base64",
              media_type: mediaType,
              data: imageBuffer.toString("base64"),
            },
          },
          {
            type: "text",
            text: "This is a receipt or transfer slip. Read it and call record_slip with the transaction details.",
          },
        ],
      },
    ],
  });

  const toolUse = response.content.find((block) => block.type === "tool_use");
  if (!toolUse) {
    throw new Error("Rude could not read a transaction from this slip.");
  }
  return toolUse.input;
}

// Below this confidence, Rude isn't sure it read the amount/type correctly.
const CONFIDENCE_THRESHOLD = 0.85;

// Above this amount, a misread costs enough that it's worth a human glance
// even when Rude is confident.
const LARGE_AMOUNT_THRESHOLD = 100;

/**
 * Decides what happens after Rude reads a slip:
 *   - "completed"      -> trusted immediately, counts toward totals right away
 *   - "pending_review" -> shown in the "Pending Slips" card until a human confirms it
 *
 * Low confidence always goes to review, regardless of amount, since Rude
 * itself isn't sure it read the slip correctly. Large amounts go to review
 * even when Rude is confident, since a mistake there is more expensive to
 * miss than a mistake on a $4 coffee.
 *
 * @param {{ amount: number, confidence: number, type: string }} extraction
 * @returns {"completed" | "pending_review"}
 */
export function decideReviewStatus({ amount, confidence }) {
  if (confidence < CONFIDENCE_THRESHOLD) return "pending_review";
  if (amount >= LARGE_AMOUNT_THRESHOLD) return "pending_review";
  return "completed";
}

export { CATEGORIES };

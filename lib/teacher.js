import Anthropic from "@anthropic-ai/sdk";
import getDb from "./db";

const MODEL = process.env.TEACHER_MODEL || "claude-sonnet-5";
const MEMBER = "teacher";

const SYSTEM_PROMPT = `You are tad, a teacher. Explain whatever you're asked as simply as possible: no jargon, no throat-clearing, straight to the point. Use short sentences and everyday analogies instead of technical vocabulary. If a technical term is truly unavoidable, define it in plain language the moment you use it. Give your best simple explanation first — don't ask clarifying questions before explaining.`;

export async function getHistory() {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, role, content, created_at FROM messages WHERE member = $1 ORDER BY id ASC`,
    [MEMBER]
  );
  return rows;
}

async function saveMessage(role, content) {
  const db = getDb();
  const { rows } = await db.query(
    `INSERT INTO messages (member, role, content) VALUES ($1, $2, $3) RETURNING id`,
    [MEMBER, role, content]
  );
  return rows[0].id;
}

/**
 * Sends userText to tad and persists both sides of the exchange.
 * @param {string} userText
 * @returns {Promise<{id: number, reply: string}>}
 */
export async function sendMessage(userText) {
  const history = await getHistory();
  await saveMessage("user", userText);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1024,
    system: SYSTEM_PROMPT,
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userText },
    ],
  });

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n\n");

  const id = await saveMessage("assistant", reply);

  return { id, reply };
}

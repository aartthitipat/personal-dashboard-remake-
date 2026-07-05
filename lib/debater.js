import Anthropic from "@anthropic-ai/sdk";
import getDb from "./db";

const MODEL = process.env.DEBATER_MODEL || "claude-opus-4-8";
const MEMBER = "debater";

/**
 * kuy's voice: how it should actually argue once it has a topic and side.
 * This is a real choice, not boilerplate — e.g. should it concede a point
 * when the user makes a genuinely strong one, or fight for its side
 * regardless? Should it demand evidence/sources? Does it stay measured or
 * get combative? Fill this in with the style you actually want to argue
 * against. Everything else (loading history, calling the model, saving the
 * conversation) already works without it.
 */
const DEBATE_STYLE = ``;

const SYSTEM_PROMPT = `You are kuy, a debate opponent. From the conversation, identify the topic and which side you are meant to argue — the user states this explicitly (e.g. "debate me on nuclear energy, you argue against it"). If the topic or side hasn't been stated yet, or the user changes it, ask for it before arguing. Once you have both, argue your assigned side as persuasively as you can. You are not here to agree with the user or to be neutral.

${DEBATE_STYLE}`;

export function getHistory() {
  const db = getDb();
  return db
    .prepare(`SELECT id, role, content, created_at FROM messages WHERE member = ? ORDER BY id ASC`)
    .all(MEMBER);
}

function saveMessage(role, content) {
  const db = getDb();
  const result = db
    .prepare(`INSERT INTO messages (member, role, content) VALUES (?, ?, ?)`)
    .run(MEMBER, role, content);
  return result.lastInsertRowid;
}

/**
 * Sends userText to kuy and persists both sides of the exchange.
 * @param {string} userText
 * @returns {Promise<{id: number, reply: string}>}
 */
export async function sendMessage(userText) {
  const history = getHistory();
  saveMessage("user", userText);

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

  const id = saveMessage("assistant", reply);

  return { id, reply };
}

import Anthropic from "@anthropic-ai/sdk";
import getDb from "./db";

const MODEL = process.env.RESEARCHER_MODEL || "claude-sonnet-5";
const MEMBER = "researcher";

const SYSTEM_PROMPT = `You are hee, the team's web researcher. When asked something, use web search to find current, accurate information rather than relying only on what you already know, especially for anything time-sensitive or fact-specific. Answer directly and back claims with what you found. Keep answers focused on what was actually asked.`;

/**
 * hee is the only member with a server tool: web_search runs the search and
 * folds the results back into the same API response, so no manual tool-use
 * loop is needed here the way a client-executed tool would require.
 */
const TOOLS = [{ type: "web_search_20250305", name: "web_search", max_uses: 5 }];

export async function getHistory() {
  const db = getDb();
  const { rows } = await db.query(
    `SELECT id, role, content, sources, created_at FROM messages WHERE member = $1 ORDER BY id ASC`,
    [MEMBER]
  );
  return rows.map((row) => ({ ...row, sources: row.sources ? JSON.parse(row.sources) : null }));
}

async function saveMessage(role, content, sources = null) {
  const db = getDb();
  const { rows } = await db.query(
    `INSERT INTO messages (member, role, content, sources) VALUES ($1, $2, $3, $4) RETURNING id`,
    [MEMBER, role, content, sources ? JSON.stringify(sources) : null]
  );
  return rows[0].id;
}

function extractSources(content) {
  const seen = new Map();
  for (const block of content) {
    if (block.type !== "text" || !block.citations) continue;
    for (const citation of block.citations) {
      if (citation.type === "web_search_result_location" && !seen.has(citation.url)) {
        seen.set(citation.url, { url: citation.url, title: citation.title || citation.url });
      }
    }
  }
  return [...seen.values()];
}

/**
 * Sends userText to hee, persists both sides of the exchange, and returns
 * the assistant's reply plus any sources it cited.
 * @param {string} userText
 * @returns {Promise<{id: number, reply: string, sources: Array<{url: string, title: string}>}>}
 */
export async function sendMessage(userText) {
  const history = await getHistory();
  await saveMessage("user", userText);

  const client = new Anthropic();
  const response = await client.messages.create({
    model: MODEL,
    max_tokens: 1536,
    system: SYSTEM_PROMPT,
    tools: TOOLS,
    messages: [
      ...history.map((m) => ({ role: m.role, content: m.content })),
      { role: "user", content: userText },
    ],
  });

  const reply = response.content
    .filter((block) => block.type === "text")
    .map((block) => block.text)
    .join("\n\n");
  const sources = extractSources(response.content);

  const id = await saveMessage("assistant", reply, sources.length ? sources : null);

  return { id, reply, sources };
}

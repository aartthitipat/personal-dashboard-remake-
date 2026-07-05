"use client";

import { useState } from "react";

export default function StudyChat({ member, initialMessages }) {
  const [messages, setMessages] = useState(initialMessages);
  const [input, setInput] = useState("");
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);

  async function handleSubmit(e) {
    e.preventDefault();
    const text = input.trim();
    if (!text || sending) return;

    setMessages((prev) => [
      ...prev,
      { id: `pending-${prev.length}`, role: "user", content: text, sources: null },
    ]);
    setInput("");
    setSending(true);
    setError(null);

    try {
      const res = await fetch(`/api/${member.key}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: text }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Something went wrong");
      setMessages((prev) => [
        ...prev,
        { id: data.id, role: "assistant", content: data.reply, sources: data.sources || null },
      ]);
    } catch (err) {
      setError(err.message);
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="rounded-lg border border-outline-variant bg-surface-container-lowest">
      <div className="border-b border-outline-variant px-6 py-4">
        <p className="text-xs font-semibold uppercase tracking-wide text-on-surface-variant">
          {member.name} · {member.role}
        </p>
        <p className="mt-1 text-sm text-on-surface-variant">{member.tagline}</p>
      </div>

      <div className="max-h-[28rem] space-y-4 overflow-y-auto px-6 py-4">
        {messages.length === 0 && (
          <p className="text-sm text-on-surface-variant">No messages yet — say hello.</p>
        )}
        {messages.map((m) => (
          <div key={m.id} className={m.role === "user" ? "text-right" : "text-left"}>
            <div
              className={`inline-block max-w-[85%] rounded-lg px-4 py-2 text-left text-sm ${
                m.role === "user" ? "bg-primary text-on-primary" : "bg-surface-container text-on-surface"
              }`}
            >
              <p className="whitespace-pre-wrap">{m.content}</p>
            </div>
            {m.sources?.length > 0 && (
              <ul className="mt-2 space-y-1 text-left text-xs text-on-surface-variant">
                {m.sources.map((s) => (
                  <li key={s.url}>
                    <a
                      href={s.url}
                      target="_blank"
                      rel="noreferrer"
                      className="underline hover:text-primary"
                    >
                      {s.title}
                    </a>
                  </li>
                ))}
              </ul>
            )}
          </div>
        ))}
        {sending && <p className="text-sm text-on-surface-variant">{member.name} is thinking…</p>}
      </div>

      {error && (
        <p className="mx-6 mb-4 rounded-md bg-error-container px-4 py-2 text-sm text-on-error-container">
          {error}
        </p>
      )}

      <form onSubmit={handleSubmit} className="flex gap-3 border-t border-outline-variant px-6 py-4">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder={`Message ${member.name}...`}
          disabled={sending}
          className="flex-1 rounded-md border border-outline-variant bg-surface px-3 py-2 text-sm"
        />
        <button
          type="submit"
          disabled={sending || !input.trim()}
          className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-on-primary disabled:opacity-50"
        >
          Send
        </button>
      </form>
    </div>
  );
}

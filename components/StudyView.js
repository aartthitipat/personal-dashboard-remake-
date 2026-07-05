"use client";

import { useState } from "react";
import StudyChat from "./StudyChat";

export default function StudyView({ members, histories }) {
  const [activeKey, setActiveKey] = useState(members[0].key);

  return (
    <div className="mx-auto max-w-4xl px-6 py-10">
      <div className="mb-8">
        <h1 className="font-heading text-3xl font-semibold text-on-surface">Study</h1>
        <p className="mt-1 text-sm text-on-surface-variant">Your study team.</p>
      </div>

      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {members.map((m) => (
          <button
            key={m.key}
            onClick={() => setActiveKey(m.key)}
            className={`rounded-md border px-4 py-3 text-left transition ${
              activeKey === m.key
                ? "border-primary bg-primary-container text-on-primary-container"
                : "border-outline-variant bg-surface-container-lowest text-on-surface hover:bg-surface-container"
            }`}
          >
            <span className="block text-sm font-semibold">{m.name}</span>
            <span className="block text-xs opacity-80">{m.role}</span>
          </button>
        ))}
      </div>

      {members.map((m) => (
        <div key={m.key} className={activeKey === m.key ? "block" : "hidden"}>
          <StudyChat member={m} initialMessages={histories[m.key]} />
        </div>
      ))}
    </div>
  );
}

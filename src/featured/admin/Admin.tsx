"use client";

import { useState } from "react";

export default function AdminPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState("");

  async function save() {
    setStatus("saving...");

    const res = await fetch("/api/admin/save", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text }),
    });

    const json = await res.json();

    setStatus(json.ok ? "saved, redeploying..." : "error");
  }

  return (
    <main>
      <h2>Edit text</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
      />

      <button onClick={save}>Save</button>

      <p>{status}</p>
    </main>
  );
}

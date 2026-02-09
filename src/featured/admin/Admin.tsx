"use client";

import { useState } from "react";

export default function AdminPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function save() {
    if (loading) return;

    setLoading(true);
    setStatus("saving...");

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text }),
      });

      let json: unknown;

      try {
        json = await res.json();
      } catch {
        throw new Error("Server returned invalid JSON");
      }

      if (!res.ok) {
        const message =
          typeof json === "object" &&
          json !== null &&
          "error" in json &&
          typeof (json as { error: string }).error === "string"
            ? (json as { error: string }).error
            : "Save failed";

        console.error("❌ Save failed:", json);

        setStatus(`error: ${message}`);
        return;
      }

      setStatus("saved, redeploying...");
    } catch (err) {
      console.error("🔥 Request crashed:", err);

      const message =
        err instanceof Error ? err.message : "Unknown network error";

      setStatus(`error: ${message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2>Edit text</h2>

      <input
        value={text}
        onChange={(e) => setText(e.target.value)}
        disabled={loading}
      />

      <button onClick={save} disabled={loading}>
        {loading ? "Saving..." : "Save"}
      </button>

      {status && <p>{status}</p>}
    </main>
  );
}

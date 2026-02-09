"use client";

import { useState, useEffect } from "react";
import data from "@/content/message.json"

export default function AdminPage() {
  const [text, setText] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [update, setUpdate] = useState({})

  useEffect(()=>{
   function FetchingData(){
      console.log(data)
    }
    FetchingData()
  })
  async function save() {
    if (loading) return;
    setLoading(true);
    setStatus("saving...");

    try {
      const res = await fetch("/api/admin/save", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET!,
        },
        body: JSON.stringify({ text }),
      });

      const json = await res.json();

      function handleUpdate(){
        const newData = {
          
        }
        setUpdate((prev) => ({
          newData,
          ...prev
        }))
      }

      if (!res.ok) {
        setStatus(`error: ${json.error ?? "save failed"}`);
        return;
      }

      setStatus("saved & redploying, wait 5 to 10 minutes for changes");
    } catch (err) {
      setStatus("network error contact nikodola@gmail.com for more informations.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main>
      <h2>Admin CMS</h2>
      <input
        value={text}
        placeholder={data.text}
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

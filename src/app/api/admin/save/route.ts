import { NextResponse } from "next/server";
import { z } from "zod";

// ---------------- CONFIG ----------------
const OWNER = "NikoDola";
const REPO = "gmunchies";
const FILE_PATH = "src/content/message.json";
const GITHUB_API = "https://api.github.com";

// ---------------- VALIDATION ----------------
const MessageSchema = z.object({
  text: z.string().min(1).max(500),
});

// ---------------- HELPERS ----------------
function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Unauthorized" },
    { status: 401 }
  );
}

function serverError(message = "Server error") {
  return NextResponse.json(
    { ok: false, error: message },
    { status: 500 }
  );
}

function checkAuth(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers.get("x-admin-secret");
  return Boolean(secret && header === secret);
}

// ---------------- GET ----------------
export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const token = process.env.GITHUB_TOKEN;
  if (!token) return serverError("Missing GITHUB_TOKEN");

  const res = await fetch(
    `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      cache: "no-store",
    }
  );

  if (!res.ok) return serverError("Failed to fetch file");

  const data = await res.json();

  const decoded = JSON.parse(
    Buffer.from(data.content, "base64").toString("utf-8")
  );

  return NextResponse.json({ ok: true, data: decoded });
}

// ---------------- POST ----------------
export async function POST(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  const token = process.env.GITHUB_TOKEN;
  if (!token) return serverError("Missing GITHUB_TOKEN");

  try {
    const body = await req.json();
    const parsed = MessageSchema.parse(body);

    const fileRes = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );

    if (!fileRes.ok) return serverError("Failed to fetch file");

    const fileData = await fileRes.json();
    if (!fileData.sha) return serverError("Missing SHA");

    const encoded = Buffer.from(
      JSON.stringify({ text: parsed.text }, null, 2)
    ).toString("base64");

    const updateRes = await fetch(
      `${GITHUB_API}/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        body: JSON.stringify({
          message: "cms: update homepage message",
          content: encoded,
          sha: fileData.sha,
        }),
      }
    );

    if (!updateRes.ok) return serverError("Failed to update file");

    return NextResponse.json({ ok: true, committed: true });
  } catch {
    return NextResponse.json(
      { ok: false, error: "Invalid request" },
      { status: 400 }
    );
  }
}

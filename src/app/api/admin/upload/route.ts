import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";

// ---------------- CONFIG ----------------
const OWNER = "NikoDola";
const REPO = "gmunchies";
const UPLOAD_DIR = "public/uploads";
const GITHUB_API = "https://api.github.com";

// ---------------- HELPERS ----------------
function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function badRequest(message = "Invalid request") {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function serverError(message = "Server error") {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

function safeFilename(name: string) {
  const cleaned = name
    .toLowerCase()
    .replace(/[^a-z0-9._-]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "upload";
}

function extAllowed(filename: string) {
  const ext = filename.split(".").pop()?.toLowerCase();
  return Boolean(ext && ["png", "jpg", "jpeg", "webp", "svg", "avif"].includes(ext));
}

async function githubFetch(pathname: string, init?: RequestInit) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN");

  const res = await fetch(`${GITHUB_API}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });

  return res;
}

export async function POST(req: Request) {
  if (!(await requireSession())) return unauthorized();

  try {
    const form = await req.formData();
    const file = form.get("file");
    if (!(file instanceof File)) return badRequest("Missing file");

    if (!extAllowed(file.name)) return badRequest("Unsupported file type");

    const buf = Buffer.from(await file.arrayBuffer());
    // keep uploads reasonably sized; adjust as needed
    if (buf.length > 6 * 1024 * 1024) return badRequest("File too large (max 6MB)");

    const base = safeFilename(file.name);
    const unique = `${Date.now()}-${base}`;
    const repoPath = `${UPLOAD_DIR}/${unique}`;

    const encoded = buf.toString("base64");

    const updateRes = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${repoPath}`, {
      method: "PUT",
      body: JSON.stringify({
        message: `cms: upload ${unique}`,
        content: encoded,
      }),
    });

    if (!updateRes.ok) {
      const text = await updateRes.text().catch(() => "");
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to upload file to GitHub",
          details: { status: updateRes.status, statusText: updateRes.statusText, bodyText: text.slice(0, 2000) },
        },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, path: `/uploads/${unique}` });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : "Server error");
  }
}


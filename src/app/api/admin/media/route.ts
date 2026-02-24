import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { githubApiFetch } from "@/lib/github";

const OWNER = "NikoDola";
const REPO = "gmunchies";
const DIR_PATH = "public/uploads";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function serverError(message = "Server error") {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

export async function GET(req: Request) {
  if (!(await requireSession())) return unauthorized();

  try {
    const res = await githubApiFetch(`/repos/${OWNER}/${REPO}/contents/${DIR_PATH}`);
    if (!res.ok) return serverError("Failed to list media files");

    const items = await res.json();
    const files: string[] = Array.isArray(items)
      ? items
          .filter((it) => it && it.type === "file" && typeof it.name === "string")
          .map((it) => `/uploads/${it.name}`)
      : [];

    return NextResponse.json({ ok: true, items: files });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : "Server error");
  }
}


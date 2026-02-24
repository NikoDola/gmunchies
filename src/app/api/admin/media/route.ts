import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { githubApiFetch } from "@/lib/github";
import fs from "fs/promises";
import path from "path";

const OWNER = "NikoDola";
const REPO = "gmunchies";
const DIR_PATH = "public/uploads";
const LOCAL_ONLY = process.env.CMS_LOCAL_ONLY === "1" || process.env.LOCAL_CMS_ONLY === "1";

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
    const listLocal = async () => {
      const dir = path.join(process.cwd(), "public", "uploads");
      const names = await fs.readdir(dir).catch(() => []);
      const files = names
        .filter((n) => typeof n === "string" && !n.startsWith("."))
        .map((n) => `/uploads/${n}`);
      return files;
    };

    if (LOCAL_ONLY) {
      const files = await listLocal();
      return NextResponse.json({ ok: true, items: files, warning: "Local-only CMS mode enabled (CMS_LOCAL_ONLY=1)." });
    }

    let res: Response;
    try {
      res = await githubApiFetch(`/repos/${OWNER}/${REPO}/contents/${DIR_PATH}`);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        const files = await listLocal();
        return NextResponse.json({ ok: true, items: files, warning: "GitHub media list failed; showing local uploads (dev)." });
      }
      throw e;
    }

    if (!res.ok) {
      if (process.env.NODE_ENV !== "production") {
        const files = await listLocal();
        return NextResponse.json({ ok: true, items: files, warning: "GitHub media list unauthorized; showing local uploads (dev)." });
      }
      return serverError("Failed to list media files");
    }

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


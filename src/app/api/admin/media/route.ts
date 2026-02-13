import { NextResponse } from "next/server";

const OWNER = "NikoDola";
const REPO = "gmunchies";
const DIR_PATH = "public/uploads";
const GITHUB_API = "https://api.github.com";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function serverError(message = "Server error") {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

function checkAuth(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers.get("x-admin-secret");
  return Boolean(secret && header === secret);
}

async function githubFetch(pathname: string) {
  const token = process.env.GITHUB_TOKEN;
  if (!token) throw new Error("Missing GITHUB_TOKEN");

  return await fetch(`${GITHUB_API}${pathname}`, {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
    },
    cache: "no-store",
  });
}

export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  try {
    const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${DIR_PATH}`);
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


import { NextResponse } from "next/server";
import { cmsSchema } from "@/lib/schemas";
import fs from "fs/promises";
import path from "path";

// ---------------- CONFIG ----------------
const OWNER = "NikoDola";
const REPO = "gmunchies";
const FILE_PATH = "src/content/data.json";
const GITHUB_API = "https://api.github.com";

// ---------------- HELPERS ----------------
function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

function serverError(message = "Server error") {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

function badRequest(message = "Invalid request") {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function checkAuth(req: Request) {
  const secret = process.env.ADMIN_SECRET;
  const header = req.headers.get("x-admin-secret");
  return Boolean(secret && header === secret);
}

async function getErrorDetails(res: Response) {
  const status = res.status;
  const statusText = res.statusText;
  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {
    bodyText = "";
  }
  return { status, statusText, bodyText: bodyText.slice(0, 2000) };
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

async function readLocalCms() {
  const filePath = path.join(process.cwd(), "src", "content", "data.json");
  const raw = await fs.readFile(filePath, "utf8");
  const decoded = JSON.parse(raw);
  return cmsSchema.parse(decoded);
}

// ---------------- GET ----------------
export async function GET(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  try {
    const res = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`);
    if (!res.ok) {
      const details = await getErrorDetails(res);
      if (details.status === 404) {
        // File doesn't exist in GitHub yet (common on preview / before first commit)
        const local = await readLocalCms();
        return NextResponse.json({
          ok: true,
          data: local,
          warning: "GitHub CMS file not found. Loaded local data.json; Save will create it in GitHub.",
        });
      }
      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch CMS content",
          details,
        },
        { status: 500 },
      );
    }

    const data = await res.json();
    const decoded = JSON.parse(Buffer.from(data.content, "base64").toString("utf-8"));
    const parsed = cmsSchema.safeParse(decoded);

    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "CMS content failed validation", issues: parsed.error.issues },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, data: parsed.data });
  } catch (e) {
    return serverError(e instanceof Error ? e.message : "Server error");
  }
}

// ---------------- PUT ----------------
export async function PUT(req: Request) {
  if (!checkAuth(req)) return unauthorized();

  try {
    const body = await req.json();
    const parsed = cmsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation error", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    const fileRes = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`);
    let sha: string | undefined;
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    } else {
      const details = await getErrorDetails(fileRes);
      // If missing, we can create it by omitting sha.
      if (details.status !== 404) {
        return NextResponse.json(
          { ok: false, error: "Failed to fetch CMS file", details },
          { status: 500 },
        );
      }
    }

    const encoded = Buffer.from(JSON.stringify(parsed.data, null, 2)).toString("base64");

    const updateRes = await githubFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "cms: update site content",
        content: encoded,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!updateRes.ok) {
      const details = await getErrorDetails(updateRes);
      return NextResponse.json(
        { ok: false, error: "Failed to update CMS file", details },
        { status: 500 },
      );
    }

    return NextResponse.json({ ok: true, committed: true });
  } catch (e) {
    if (e instanceof SyntaxError) return badRequest("Invalid JSON");
    return serverError(e instanceof Error ? e.message : "Server error");
  }
}


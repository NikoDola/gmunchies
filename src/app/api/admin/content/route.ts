import { NextResponse } from "next/server";
import { cmsSchema } from "@/lib/schemas";
import fs from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getGithubTokenMeta, githubApiFetch } from "@/lib/github";

// ---------------- CONFIG ----------------
const OWNER = "NikoDola";
const REPO = "gmunchies";
const FILE_PATH = "src/content/data.json";
const LOCAL_ONLY = process.env.CMS_LOCAL_ONLY === "1" || process.env.LOCAL_CMS_ONLY === "1";

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

async function requireSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

async function getErrorDetails(res: Response) {
  const status = res.status;
  const statusText = res.statusText;
  const githubRequestId = res.headers.get("x-github-request-id");
  const githubCorrelationId = res.headers.get("x-github-correlation-id");
  const wwwAuthenticate = res.headers.get("www-authenticate");
  const rateLimitRemaining = res.headers.get("x-ratelimit-remaining");
  const rateLimitLimit = res.headers.get("x-ratelimit-limit");
  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {
    bodyText = "";
  }
  return {
    status,
    statusText,
    githubRequestId,
    githubCorrelationId,
    wwwAuthenticate,
    rateLimitRemaining,
    rateLimitLimit,
    bodyText: bodyText.slice(0, 2000),
  };
}

async function readLocalCms() {
  const filePath = path.join(process.cwd(), "src", "content", "data.json");
  const raw = await fs.readFile(filePath, "utf8");
  const decoded = JSON.parse(raw);
  return cmsSchema.parse(decoded);
}

async function writeLocalCms(data: unknown) {
  const filePath = path.join(process.cwd(), "src", "content", "data.json");
  await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf8");
}

// ---------------- GET ----------------
export async function GET(req: Request) {
  if (!(await requireSession())) return unauthorized();

  try {
    if (LOCAL_ONLY) {
      const local = await readLocalCms();
      return NextResponse.json({
        ok: true,
        data: local,
        warning: "Local-only CMS mode enabled (CMS_LOCAL_ONLY=1). GitHub sync is disabled.",
      });
    }

    let res: Response;
    try {
      res = await githubApiFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        const local = await readLocalCms();
        return NextResponse.json({
          ok: true,
          data: local,
          warning:
            "GitHub CMS fetch failed (token missing/invalid). Loaded local data.json; fix your GitHub token to enable sync.",
        });
      }
      throw e;
    }
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
      if ((details.status === 401 || details.status === 403) && process.env.NODE_ENV !== "production") {
        const local = await readLocalCms();
        return NextResponse.json({
          ok: true,
          data: local,
          warning:
            "GitHub token unauthorized. Loaded local data.json; update your GitHub token to enable sync.",
          details,
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
  if (!(await requireSession())) return unauthorized();

  try {
    const body = await req.json();
    const parsed = cmsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { ok: false, error: "Validation error", issues: parsed.error.issues },
        { status: 400 },
      );
    }

    if (LOCAL_ONLY) {
      await writeLocalCms(parsed.data);
      return NextResponse.json({
        ok: true,
        committed: false,
        warning: "Local-only CMS mode enabled (CMS_LOCAL_ONLY=1). Saved locally only.",
      });
    }

    let fileRes: Response;
    try {
      fileRes = await githubApiFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`);
    } catch (e) {
      if (process.env.NODE_ENV !== "production") {
        try {
          await writeLocalCms(parsed.data);
        } catch {
          // ignore local write errors in dev
        }
        return NextResponse.json({
          ok: true,
          committed: false,
          warning: "GitHub sync failed (token missing/invalid). Saved locally only.",
        });
      }
      throw e;
    }
    let sha: string | undefined;
    if (fileRes.ok) {
      const fileData = await fileRes.json();
      sha = fileData.sha;
    } else {
      const details = await getErrorDetails(fileRes);
      // If missing, we can create it by omitting sha.
      if (details.status !== 404) {
        if ((details.status === 401 || details.status === 403) && process.env.NODE_ENV !== "production") {
          try {
            await writeLocalCms(parsed.data);
          } catch {
            // ignore local write errors in dev
          }
          return NextResponse.json({
            ok: true,
            committed: false,
            warning: "GitHub token unauthorized. Saved locally only; update GitHub token to enable sync.",
            details,
          });
        }
        return NextResponse.json(
          { ok: false, error: "Failed to fetch CMS file", details },
          { status: 500 },
        );
      }
    }

    const encoded = Buffer.from(JSON.stringify(parsed.data, null, 2)).toString("base64");

    const updateRes = await githubApiFetch(`/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`, {
      method: "PUT",
      body: JSON.stringify({
        message: "cms: update site content",
        content: encoded,
        ...(sha ? { sha } : {}),
      }),
    });

    if (!updateRes.ok) {
      const details = await getErrorDetails(updateRes);
      if ((details.status === 401 || details.status === 403) && process.env.NODE_ENV !== "production") {
        try {
          await writeLocalCms(parsed.data);
        } catch {
          // ignore local write errors in dev
        }
        return NextResponse.json({
          ok: true,
          committed: false,
          warning: "GitHub token unauthorized. Saved locally only; update GitHub token to enable sync.",
          details,
        });
      }
      return NextResponse.json(
        { ok: false, error: "Failed to update CMS file", details },
        { status: 500 },
      );
    }

    // GitHub returns commit info; expose it (no secrets) so we can verify deploy triggers.
    let commitSha: string | undefined;
    let commitUrl: string | undefined;
    try {
      const updateJson = await updateRes.json();
      commitSha = updateJson?.commit?.sha;
      commitUrl = updateJson?.commit?.html_url;
    } catch {
      commitSha = undefined;
      commitUrl = undefined;
    }

    // Dev convenience: keep local file in sync so refresh shows changes
    if (process.env.NODE_ENV !== "production") {
      try {
        await writeLocalCms(parsed.data);
      } catch {
        // ignore local write errors in dev
      }
    }

    return NextResponse.json({
      ok: true,
      committed: true,
      commit: { sha: commitSha, url: commitUrl },
      tokenMeta: getGithubTokenMeta(),
    });
  } catch (e) {
    if (e instanceof SyntaxError) return badRequest("Invalid JSON");
    return serverError(e instanceof Error ? e.message : "Server error");
  }
}


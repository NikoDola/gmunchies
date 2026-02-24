import { NextResponse } from "next/server";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/authOptions";
import { getGithubTokenMeta, githubApiFetch } from "@/lib/github";

const OWNER = "NikoDola";
const REPO = "gmunchies";

function unauthorized() {
  return NextResponse.json({ ok: false, error: "Unauthorized" }, { status: 401 });
}

async function requireSession() {
  const session = await getServerSession(authOptions);
  return Boolean(session);
}

async function getErrorDetails(res: Response) {
  const status = res.status;
  const statusText = res.statusText;
  const githubRequestId = res.headers.get("x-github-request-id");
  const wwwAuthenticate = res.headers.get("www-authenticate");
  let bodyText = "";
  try {
    bodyText = await res.text();
  } catch {
    bodyText = "";
  }
  return { status, statusText, githubRequestId, wwwAuthenticate, bodyText: bodyText.slice(0, 2000) };
}

export async function GET() {
  if (!(await requireSession())) return unauthorized();

  const tokenMeta = (() => {
    try {
      return getGithubTokenMeta();
    } catch (e) {
      return { error: e instanceof Error ? e.message : "Missing/invalid GitHub token" };
    }
  })();

  try {
    const who = await githubApiFetch("/user");
    if (!who.ok) {
      const details = await getErrorDetails(who);
      return NextResponse.json(
        { ok: false, error: "GitHub auth failed", tokenMeta, details },
        { status: details.status || 500 },
      );
    }
    const whoJson = await who.json();

    const repoRes = await githubApiFetch(`/repos/${OWNER}/${REPO}`);
    if (!repoRes.ok) {
      const details = await getErrorDetails(repoRes);
      return NextResponse.json(
        { ok: false, error: "GitHub repo access failed", tokenMeta, details },
        { status: details.status || 500 },
      );
    }
    const repoJson = await repoRes.json();

    return NextResponse.json({
      ok: true,
      tokenMeta,
      user: { login: whoJson?.login, id: whoJson?.id },
      repo: {
        full_name: repoJson?.full_name,
        private: repoJson?.private,
        permissions: repoJson?.permissions,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { ok: false, error: e instanceof Error ? e.message : "Server error", tokenMeta },
      { status: 500 },
    );
  }
}


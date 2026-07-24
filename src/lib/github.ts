const GITHUB_API = "https://api.github.com";

function normalizeEnvValue(raw: string) {
  return raw.trim().replace(/^['"]|['"]$/g, "");
}

// CMS commit target. Set GITHUB_REPO="owner/name" in the environment.
// Left empty in local/demo mode (CMS_LOCAL_ONLY=1), where GitHub is never called.
function resolveRepo(): { owner: string; name: string } {
  const raw = normalizeEnvValue(process.env.GITHUB_REPO ?? "");
  const slash = raw.indexOf("/");
  if (slash === -1) return { owner: "", name: "" };
  return { owner: raw.slice(0, slash), name: raw.slice(slash + 1) };
}

export const { owner: REPO_OWNER, name: REPO_NAME } = resolveRepo();

type GithubTokenMeta = {
  token: string;
  source: "GITHUB_TOKEN" | "GH_TOKEN" | "GITHUB_PAT" | "GITHUB_ACCESS_TOKEN";
  kind: "classic" | "fine-grained" | "unknown";
  authScheme: "token" | "Bearer";
};

function resolveGithubToken(): GithubTokenMeta {
  const candidates: Array<[GithubTokenMeta["source"], string | undefined]> = [
    ["GITHUB_TOKEN", process.env.GITHUB_TOKEN],
    ["GH_TOKEN", process.env.GH_TOKEN],
    ["GITHUB_PAT", process.env.GITHUB_PAT],
    ["GITHUB_ACCESS_TOKEN", process.env.GITHUB_ACCESS_TOKEN],
  ];

  const found = candidates.find(([, v]) => Boolean(v && v.trim().length > 0));
  const source = found?.[0] ?? "GITHUB_TOKEN";
  const raw = found?.[1] ?? "";

  const token = normalizeEnvValue(raw);

  if (!token) {
    throw new Error("Missing GitHub token env (GITHUB_TOKEN / GH_TOKEN / GITHUB_PAT / GITHUB_ACCESS_TOKEN)");
  }

  // Common misconfig: pasting a full JSON credential blob instead of the token string.
  if (token.startsWith("{") || token.startsWith("[")) {
    throw new Error("GitHub token env looks like JSON; expected a token string");
  }

  const kind: GithubTokenMeta["kind"] = token.startsWith("github_pat_")
    ? "fine-grained"
    : token.startsWith("ghp_")
      ? "classic"
      : "unknown";

  // GitHub accepts both in many cases, but prefer the canonical scheme.
  const authScheme: GithubTokenMeta["authScheme"] = kind === "classic" ? "token" : "Bearer";

  return { token, source, kind, authScheme };
}

export function getGithubTokenMeta() {
  const { source, kind } = resolveGithubToken();
  return { source, kind };
}

export async function githubApiFetch(pathname: string, init?: RequestInit) {
  const { token, authScheme } = resolveGithubToken();
  return await fetch(`${GITHUB_API}${pathname}`, {
    ...init,
    headers: {
      Authorization: `${authScheme} ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      "User-Agent": "nextjs-cms-admin",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}


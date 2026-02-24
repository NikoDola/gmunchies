const GITHUB_API = "https://api.github.com";

function normalizeEnvValue(raw: string) {
  return raw.trim().replace(/^['"]|['"]$/g, "");
}

export function getGithubToken() {
  const raw =
    process.env.GITHUB_TOKEN ??
    process.env.GH_TOKEN ??
    process.env.GITHUB_PAT ??
    process.env.GITHUB_ACCESS_TOKEN ??
    "";

  const token = normalizeEnvValue(raw);

  if (!token) {
    throw new Error("Missing GitHub token env (GITHUB_TOKEN / GH_TOKEN / GITHUB_PAT / GITHUB_ACCESS_TOKEN)");
  }

  // Common misconfig: pasting a full JSON credential blob instead of the token string.
  if (token.startsWith("{") || token.startsWith("[")) {
    throw new Error("GitHub token env looks like JSON; expected a token string");
  }

  return token;
}

export async function githubApiFetch(pathname: string, init?: RequestInit) {
  const token = getGithubToken();
  return await fetch(`${GITHUB_API}${pathname}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: "application/vnd.github+json",
      "X-GitHub-Api-Version": "2022-11-28",
      ...(init?.headers ?? {}),
    },
    cache: "no-store",
  });
}


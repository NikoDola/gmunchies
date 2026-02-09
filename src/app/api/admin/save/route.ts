import { NextResponse } from "next/server";

const OWNER = "YOUR_GITHUB_NAME";
const REPO = "YOUR_REPO";
const FILE_PATH = "src/content/message.json";

export async function POST(req: Request) {
  const { text } = await req.json();

  const token = process.env.GITHUB_TOKEN;

  if (!token) {
    return NextResponse.json({ ok: false }, { status: 500 });
  }

  // get existing file SHA
  const fileRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
    }
  );

  const fileData = await fileRes.json();

  const content = Buffer.from(
    JSON.stringify({ text }, null, 2)
  ).toString("base64");

  const updateRes = await fetch(
    `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
    {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${token}`,
        Accept: "application/vnd.github+json",
      },
      body: JSON.stringify({
        message: "cms: update homepage text",
        content,
        sha: fileData.sha,
      }),
    }
  );

  return NextResponse.json({ ok: updateRes.ok });
}

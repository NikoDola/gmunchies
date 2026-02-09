import { NextResponse } from "next/server";
import { z } from "zod";

const OWNER = "NikoDola";
const REPO = "gmunchies";
const FILE_PATH = "src/content/message.json";

const schema = z.object({
  text: z.string().min(1).max(500),
});

export async function POST(req: Request) {
  try {
    const token = process.env.GITHUB_TOKEN;

    if (!token) {
      console.error("Missing GITHUB_TOKEN");

      return NextResponse.json(
        { ok: false, error: "Server misconfigured" },
        { status: 500 }
      );
    }

    const body = await req.json();

    const parsed = schema.safeParse(body);

    if (!parsed.success) {
      console.error("Validation failed:", parsed.error.flatten());

      return NextResponse.json(
        {
          ok: false,
          error: "Validation failed",
          details: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    // -----------------------------
    // Fetch current file from GitHub
    // -----------------------------

    const fileRes = await fetch(
      `https://api.github.com/repos/${OWNER}/${REPO}/contents/${FILE_PATH}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: "application/vnd.github+json",
        },
        cache: "no-store",
      }
    );

    const fileData = await fileRes.json();

    if (!fileRes.ok || !fileData.sha) {
      console.error("GitHub get-file failed:", fileData);

      return NextResponse.json(
        {
          ok: false,
          error: "Failed to fetch content file",
        },
        { status: 500 }
      );
    }

    // -----------------------------
    // Update file
    // -----------------------------

    const content = Buffer.from(
      JSON.stringify({ text: parsed.data.text }, null, 2)
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

    const updateData = await updateRes.json();

    if (!updateRes.ok) {
      console.error("GitHub update failed:", updateData);

      return NextResponse.json(
        {
          ok: false,
          error: "Failed to update GitHub file",
        },
        { status: 500 }
      );
    }

    // -----------------------------
    // Success
    // -----------------------------

    return NextResponse.json({
      ok: true,
      committed: true,
    });
  } catch (err) {
    console.error("CMS route crashed:", err);

    return NextResponse.json(
      {
        ok: false,
        error: "Unexpected server error",
      },
      { status: 500 }
    );
  }
}

import fs from "fs/promises";
import path from "path";
import type { z } from "zod";
import { cmsSchema } from "@/lib/schemas";

export type CmsContent = z.infer<typeof cmsSchema>;

export async function getCmsContent(): Promise<CmsContent> {
  const filePath = path.join(process.cwd(), "src", "content", "data.json");
  const raw = await fs.readFile(filePath, "utf8");
  const json = JSON.parse(raw);
  return cmsSchema.parse(json);
}


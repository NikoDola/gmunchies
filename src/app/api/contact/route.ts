import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import { renderContactEmail, renderContactEmailText, type ContactEmailParams } from "@/lib/contactEmail";

export const runtime = "nodejs";

const contactSchema = z.object({
  name: z.string().min(1).max(120),
  lastName: z.string().max(120).optional().default(""),
  company: z.string().max(200).optional().default(""),
  email: z.string().email().max(200),
  phone: z.string().max(60).optional().default(""),
  service: z.string().max(120).optional().default(""),
  location: z.string().max(120).optional().default(""),
  description: z.string().min(1).max(4000),
  source: z.enum(["request-service", "contact-us"]).optional().default("request-service"),
});

async function sendViaGmail(params: ContactEmailParams) {
  const user = process.env.GMAIL_USER;
  const pass = process.env.GMAIL_APP_PASSWORD;
  // Where inquiries land; defaults to the sending account itself.
  const to = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    throw new Error("Email is not configured (missing GMAIL_USER / GMAIL_APP_PASSWORD on server)");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  const subject =
    params.source === "contact-us"
      ? `GMunchies: New contact-us inquiry from ${params.name}${params.lastName ? ` ${params.lastName}` : ""}`
      : `GMunchies: New service request from ${params.name}`;

  await transporter.sendMail({
    from: `"GMunchies Website" <${user}>`,
    to,
    replyTo: params.email,
    subject,
    text: renderContactEmailText(params),
    html: renderContactEmail(params),
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Validation error", issues: parsed.error.issues }, { status: 400 });
    }

    await sendViaGmail(parsed.data);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

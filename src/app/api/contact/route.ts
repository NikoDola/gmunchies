import { NextResponse } from "next/server";
import { z } from "zod";
import nodemailer from "nodemailer";
import {
  renderConfirmationEmail,
  renderConfirmationText,
  renderNotificationEmail,
  renderNotificationText,
  type ContactEmailParams,
} from "@/lib/contactEmail";

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

async function sendEmails(params: ContactEmailParams) {
  const user = process.env.GMAIL_USER;
  // App passwords are displayed with spaces (e.g. "abcd efgh ijkl mnop"); SMTP needs them stripped.
  const pass = process.env.GMAIL_APP_PASSWORD?.replace(/\s+/g, "");
  // Where the owner notification is delivered; defaults to the sending account.
  const owner = process.env.CONTACT_TO || user;

  if (!user || !pass) {
    throw new Error("Email is not configured (missing GMAIL_USER / GMAIL_APP_PASSWORD on server)");
  }

  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: { user, pass },
  });

  // 1) Confirmation back to the person who submitted the form (the main flow).
  await transporter.sendMail({
    from: `"GMunchies Vending" <${user}>`,
    to: params.email,
    replyTo: owner,
    subject: "Thanks for contacting GMunchies Vending",
    text: renderConfirmationText(params),
    html: renderConfirmationEmail(params),
  });

  // 2) Notification to the owner so submissions are visible. Best-effort:
  //    a failure here must not fail the user's confirmation.
  try {
    await transporter.sendMail({
      from: `"GMunchies Website" <${user}>`,
      to: owner,
      replyTo: params.email,
      subject:
        params.source === "contact-us"
          ? `GMunchies: New contact-us inquiry from ${params.name}${params.lastName ? ` ${params.lastName}` : ""}`
          : `GMunchies: New service request from ${params.name}`,
      text: renderNotificationText(params),
      html: renderNotificationEmail(params),
    });
  } catch {
    // ignore: the submitter already got their confirmation
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = contactSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ ok: false, error: "Validation error", issues: parsed.error.issues }, { status: 400 });
    }

    await sendEmails(parsed.data);

    return NextResponse.json({ ok: true });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Server error";
    return NextResponse.json({ ok: false, error: message }, { status: 500 });
  }
}

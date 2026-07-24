const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://gmunchiesvending.com";

export type ContactEmailParams = {
  name: string;
  lastName: string;
  company: string;
  email: string;
  phone: string;
  service: string;
  location: string;
  description: string;
  source: "request-service" | "contact-us";
};

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function infoRows(params: ContactEmailParams): string {
  const rows: Array<[string, string]> = [
    ["👤 Name", `${params.name}${params.lastName ? ` ${params.lastName}` : ""}`],
    ["✉️ Email", params.email],
    ["📞 Phone", params.phone || "-"],
    ["🏢 Company", params.company || "-"],
    ["📍 Location", params.location || "-"],
    ["🛠️ Service", params.service || "-"],
  ];
  return rows
    .map(
      ([label, value]) => `<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">${label}</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${escapeHtml(value)}</strong></td>
</tr>`,
    )
    .join("\n");
}

function shell(inner: string): string {
  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background:#FCE9D4;font-family:Arial,Helvetica,sans-serif;">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#FCE9D4;padding:30px 0;">
<tr><td align="center">
<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">
<tr>
<td align="center" style="background:#ffffff;padding:28px 25px 20px 25px;border-bottom:1px solid #f2eee8;">
<img src="${siteUrl}/branding/full-logo.png" width="150" alt="GMunchies Vending" style="display:block;">
</td>
</tr>
${inner}
<tr>
<td style="background:#232121;color:#ffffff;padding:24px 40px;text-align:center;">
<p style="margin:0;font-size:14px;line-height:1.6;">GMunchies Vending Team</p>
</td>
</tr>
</table>
</td></tr>
</table>
</body>
</html>`;
}

/** Confirmation email sent TO the person who submitted the form. */
export function renderConfirmationEmail(params: ContactEmailParams): string {
  const name = escapeHtml(params.name);
  const message = escapeHtml(params.description).replace(/\n/g, "<br>");
  return shell(`<tr>
<td style="padding:30px 40px 15px 40px;text-align:left;">
<h2 style="margin:0 0 12px 0;color:#232121;font-size:25px;line-height:1.3;">Hello ${name},</h2>
<p style="margin:0 0 10px 0;color:#3d3835;font-size:16px;line-height:1.6;">Thank you for your interest in our vending services.</p>
<p style="margin:0;color:#3d3835;font-size:16px;line-height:1.6;">We received your message and will get back to you soon.</p>
</td>
</tr>
<tr>
<td style="padding:10px 40px 20px 40px;">
<p style="margin:0 0 8px 0;color:#232121;font-size:15px;font-weight:700;">Your message:</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-left:4px solid #d7d2cb;border-radius:4px;">
<tr><td style="padding:14px 16px;color:#7f7670;font-style:italic;font-size:15px;line-height:1.6;">"${message}"</td></tr>
</table>
</td>
</tr>
<tr>
<td style="padding:0 40px 20px 40px;">
<p style="margin:0 0 10px 0;color:#232121;font-size:15px;font-weight:700;">Your info:</p>
<table width="100%" cellpadding="0" cellspacing="0">
${infoRows(params)}
</table>
</td>
</tr>`);
}

/** Notification email sent TO the business owner when a form is submitted. */
export function renderNotificationEmail(params: ContactEmailParams): string {
  const fullName = escapeHtml(`${params.name}${params.lastName ? ` ${params.lastName}` : ""}`);
  const message = escapeHtml(params.description).replace(/\n/g, "<br>");
  const sourceLabel = params.source === "contact-us" ? "Contact Us page" : "Request Service form";
  return shell(`<tr>
<td style="padding:30px 40px 15px 40px;text-align:left;">
<h2 style="margin:0 0 12px 0;color:#232121;font-size:25px;line-height:1.3;">New inquiry from ${fullName}</h2>
<p style="margin:0;color:#3d3835;font-size:16px;line-height:1.6;">Submitted through the ${sourceLabel} on the website.</p>
</td>
</tr>
<tr>
<td style="padding:10px 40px 20px 40px;">
<p style="margin:0 0 8px 0;color:#232121;font-size:15px;font-weight:700;">Message:</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-left:4px solid #d7d2cb;border-radius:4px;">
<tr><td style="padding:14px 16px;color:#7f7670;font-style:italic;font-size:15px;line-height:1.6;">"${message}"</td></tr>
</table>
</td>
</tr>
<tr>
<td style="padding:0 40px 20px 40px;">
<p style="margin:0 0 10px 0;color:#232121;font-size:15px;font-weight:700;">Contact info:</p>
<table width="100%" cellpadding="0" cellspacing="0">
${infoRows(params)}
</table>
</td>
</tr>`);
}

function textBlock(title: string, params: ContactEmailParams): string {
  const fullName = `${params.name}${params.lastName ? ` ${params.lastName}` : ""}`;
  return [
    title,
    "",
    "Message:",
    params.description,
    "",
    `Name: ${fullName}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone || "-"}`,
    `Company: ${params.company || "-"}`,
    `Location: ${params.location || "-"}`,
    `Service: ${params.service || "-"}`,
  ].join("\n");
}

export function renderConfirmationText(params: ContactEmailParams): string {
  return textBlock(`Hello ${params.name}, thank you for your interest in our vending services. We will get back to you soon.`, params);
}

export function renderNotificationText(params: ContactEmailParams): string {
  return textBlock(`New inquiry from ${params.name}${params.lastName ? ` ${params.lastName}` : ""}`, params);
}

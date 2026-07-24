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

/** Branded HTML for the inquiry notification email (table layout for email-client compatibility). */
export function renderContactEmail(params: ContactEmailParams): string {
  const fullName = escapeHtml(`${params.name}${params.lastName ? ` ${params.lastName}` : ""}`);
  const email = escapeHtml(params.email);
  const phone = escapeHtml(params.phone || "-");
  const company = escapeHtml(params.company || "-");
  const service = escapeHtml(params.service || "-");
  const location = escapeHtml(params.location || "-");
  const message = escapeHtml(params.description).replace(/\n/g, "<br>");
  const sourceLabel = params.source === "contact-us" ? "Contact Us page" : "Request Service form";

  return `<!DOCTYPE html>
<html>
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>New Inquiry</title>
</head>
<body style="margin:0;padding:0;background:#FCE9D4;font-family:Arial,Helvetica,sans-serif;">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#FCE9D4;padding:30px 0;">
<tr>
<td align="center">

<table width="100%" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:8px;overflow:hidden;max-width:600px;">

<!-- HEADER -->
<tr>
<td align="center" style="background:#ffffff;padding:28px 25px 20px 25px;border-bottom:1px solid #f2eee8;">
<img src="${siteUrl}/branding/full-logo.png" width="150" alt="GMunchies Vending" style="display:block;">
</td>
</tr>

<!-- INTRO -->
<tr>
<td style="padding:30px 40px 15px 40px;text-align:left;">
<h2 style="margin:0 0 12px 0;color:#232121;font-size:25px;line-height:1.3;">
New inquiry from ${fullName}
</h2>
<p style="margin:0;color:#3d3835;font-size:16px;line-height:1.6;">
Someone submitted the ${sourceLabel} on the website.
</p>
</td>
</tr>

<!-- MESSAGE -->
<tr>
<td style="padding:20px 40px 20px 40px;">
<p style="margin:0 0 8px 0;color:#232121;font-size:15px;font-weight:700;">
Message:
</p>
<table width="100%" cellpadding="0" cellspacing="0" style="background:#f8f8f8;border-left:4px solid #d7d2cb;border-radius:4px;">
<tr>
<td style="padding:14px 16px;color:#7f7670;font-style:italic;font-size:15px;line-height:1.6;">
"${message}"
</td>
</tr>
</table>
</td>
</tr>

<!-- CONTACT INFO -->
<tr>
<td style="padding:8px 40px 20px 40px;">
<p style="margin:0 0 10px 0;color:#232121;font-size:15px;font-weight:700;">
Contact info:
</p>
<table width="100%" cellpadding="0" cellspacing="0">
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">👤 Name</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${fullName}</strong></td>
</tr>
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">✉️ Email</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${email}</strong></td>
</tr>
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">📞 Phone</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${phone}</strong></td>
</tr>
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">🏢 Company</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${company}</strong></td>
</tr>
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">📍 Location</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${location}</strong></td>
</tr>
<tr>
<td style="padding:7px 0;color:#90857B;font-size:15px;">🛠️ Service</td>
<td style="padding:7px 0;color:#232121;font-size:15px;"><strong>${service}</strong></td>
</tr>
</table>
</td>
</tr>

<!-- FOOTER -->
<tr>
<td style="background:#232121;color:#ffffff;padding:24px 40px;text-align:center;">
<p style="margin:0;font-size:14px;line-height:1.6;">
GMunchies Vending, website contact form
</p>
</td>
</tr>

</table>

</td>
</tr>
</table>

</body>
</html>`;
}

/** Plain-text fallback for clients that don't render HTML. */
export function renderContactEmailText(params: ContactEmailParams): string {
  const fullName = `${params.name}${params.lastName ? ` ${params.lastName}` : ""}`;
  return [
    `New inquiry from ${fullName}`,
    "",
    `Message:`,
    params.description,
    "",
    `Name: ${fullName}`,
    `Email: ${params.email}`,
    `Phone: ${params.phone || "-"}`,
    `Company: ${params.company || "-"}`,
    `Location: ${params.location || "-"}`,
    `Service: ${params.service || "-"}`,
    `Source: ${params.source}`,
  ].join("\n");
}

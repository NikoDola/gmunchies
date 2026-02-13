import type { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";

function parseAllowlist(raw: string | undefined) {
  return (raw ?? "")
    .split(",")
    .map((s) => s.trim().replace(/^['"]|['"]$/g, "").toLowerCase())
    .filter(Boolean);
}

export const authOptions: NextAuthOptions = {
  // Support both env var names (some setups generate AUTH_SECRET).
  secret: process.env.NEXTAUTH_SECRET ?? process.env.AUTH_SECRET,
  debug: process.env.NODE_ENV !== "production",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile, user }) {
      // Allow only explicitly listed admin emails.
      const email =
        user?.email?.toLowerCase() ??
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        (((profile as any)?.email as string | undefined)?.toLowerCase() ?? undefined);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const emailVerified = Boolean((profile as any)?.email_verified ?? true);

      const allowlist = parseAllowlist(process.env.ADMIN_EMAILS);
      const allowed =
        Boolean(email && emailVerified) && allowlist.length > 0 && allowlist.includes(email!);

      // Helpful debug logs (no secrets), visible in server logs.
      if (process.env.NODE_ENV !== "production") {
        // eslint-disable-next-line no-console
        console.warn("[auth] signIn attempt", {
          email,
          emailVerified,
          allowlistCount: allowlist.length,
          allowed,
        });
      }

      return allowed;
    },
  },
};


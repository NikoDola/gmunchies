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
  debug: process.env.NEXTAUTH_DEBUG === "1",
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID ?? "",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async signIn({ profile, user }) {
      const p = profile as { email?: string; email_verified?: boolean } | undefined;
      // Allow only explicitly listed admin emails.
      const email = user?.email?.toLowerCase() ?? p?.email?.toLowerCase();
      const emailVerified = Boolean(p?.email_verified ?? true);

      const allowlist = parseAllowlist(process.env.ADMIN_EMAILS);
      const allowed =
        Boolean(email && emailVerified) && allowlist.length > 0 && allowlist.includes(email!);

      // Helpful debug logs (no secrets), visible in server logs.
      if (process.env.NODE_ENV !== "production") {
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


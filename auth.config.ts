import type { NextAuthConfig } from "next-auth";
import type { Role, Tier } from "@/lib/constants";

// Database-free half of the auth setup, so proxy.ts can verify sessions
// without pulling Mongoose into the request proxy.
export const authConfig = {
  pages: { signIn: "/login" },
  session: { strategy: "jwt" },
  providers: [],
  callbacks: {
    jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.role = user.role;
        token.tier = user.tier;
        token.companyName = user.companyName;
      }
      return token;
    },
    session({ session, token }) {
      session.user.id = token.id as string;
      session.user.role = token.role as Role;
      session.user.tier = token.tier as Tier;
      session.user.companyName = token.companyName as string;
      return session;
    },
  },
} satisfies NextAuthConfig;

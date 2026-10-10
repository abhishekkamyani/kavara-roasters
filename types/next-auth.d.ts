import type { DefaultSession } from "next-auth";
import type { Role, Tier } from "@/lib/constants";

declare module "next-auth" {
  interface User {
    role: Role;
    tier: Tier;
    companyName: string;
  }

  interface Session {
    user: {
      id: string;
      role: Role;
      tier: Tier;
      companyName: string;
    } & DefaultSession["user"];
  }
}

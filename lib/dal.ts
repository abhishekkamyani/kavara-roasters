import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export const getSessionUser = cache(async () => {
  const session = await auth();
  if (!session?.user) return null;

  // The session token is minted at sign-in. Re-read what an admin can change
  // afterwards, so a new tier applies on the next page load, not the next login.
  await connectDB();
  const account = await User.findById(session.user.id)
    .select("companyName role tier")
    .lean();
  if (!account) return null;

  return {
    ...session.user,
    companyName: account.companyName,
    role: account.role,
    tier: account.tier,
  };
});

/** For Server Actions, which report a failure instead of redirecting. */
export async function isAdmin() {
  const user = await getSessionUser();
  return user?.role === "ADMIN";
}

/** Session user for client-portal pages; bounces everyone else. */
export async function requireClient() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "CLIENT") redirect("/admin/orders");
  return user;
}

/** Session user for admin pages; bounces everyone else. */
export async function requireAdmin() {
  const user = await getSessionUser();
  if (!user) redirect("/login");
  if (user.role !== "ADMIN") redirect("/dashboard");
  return user;
}

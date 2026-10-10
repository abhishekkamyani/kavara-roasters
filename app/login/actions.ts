"use server";

import { AuthError } from "next-auth";
import { signIn, signOut } from "@/auth";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export type LoginState = { error?: string; email?: string };

export async function authenticate(
  _prevState: LoginState,
  formData: FormData,
): Promise<LoginState> {
  const email = String(formData.get("email") ?? "");
  try {
    // Pick the landing page up front: a Server Action redirect renders its
    // target directly, so proxy.ts never gets the chance to reroute admins.
    await connectDB();
    const account = await User.findOne({ email: email.trim().toLowerCase() })
      .select("role")
      .lean();

    await signIn("credentials", {
      email,
      password: formData.get("password"),
      redirectTo: account?.role === "ADMIN" ? "/admin/orders" : "/dashboard",
    });
  } catch (error) {
    if (error instanceof AuthError) {
      return {
        email,
        error:
          error.type === "CredentialsSignin"
            ? "That email and password don't match an account."
            : "We couldn't sign you in. Please try again.",
      };
    }
    throw error;
  }
  return {};
}

export async function signOutAction() {
  await signOut({ redirectTo: "/login" });
}

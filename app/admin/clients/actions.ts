"use server";

import bcrypt from "bcryptjs";
import { isValidObjectId } from "mongoose";
import { refresh } from "next/cache";
import { MIN_PASSWORD_LENGTH, TIERS, type Tier } from "@/lib/constants";
import { isAdmin } from "@/lib/dal";
import { connectDB } from "@/lib/mongodb";
import { User } from "@/models/User";

export type ClientResult =
  | { ok: true; companyName: string }
  | { ok: false; error: string };

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isTier(value: string): value is Tier {
  return (TIERS as readonly string[]).includes(value);
}

export async function createClient(formData: FormData): Promise<ClientResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can add clients." };
  }

  const companyName = String(formData.get("companyName") ?? "").trim();
  const email = String(formData.get("email") ?? "")
    .trim()
    .toLowerCase();
  const password = String(formData.get("password") ?? "");
  const tier = String(formData.get("tier") ?? "");

  if (!companyName) {
    return { ok: false, error: "Company name is required." };
  }
  if (!EMAIL_PATTERN.test(email)) {
    return { ok: false, error: "Enter a valid email address." };
  }
  if (password.length < MIN_PASSWORD_LENGTH) {
    return {
      ok: false,
      error: `The password must be at least ${MIN_PASSWORD_LENGTH} characters.`,
    };
  }
  if (!isTier(tier)) {
    return { ok: false, error: "Choose a tier." };
  }

  await connectDB();
  if (await User.exists({ email })) {
    return { ok: false, error: `An account for ${email} already exists.` };
  }

  await User.create({
    companyName,
    email,
    password: await bcrypt.hash(password, 10),
    role: "CLIENT",
    tier,
  });

  return { ok: true, companyName };
}

export async function updateClientTier(
  clientId: string,
  tier: Tier
): Promise<ClientResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can change tiers." };
  }
  if (!isValidObjectId(clientId) || !isTier(tier)) {
    return { ok: false, error: "Invalid tier change." };
  }

  await connectDB();
  const client = await User.findOneAndUpdate(
    { _id: clientId, role: "CLIENT" },
    { tier }
  );
  if (!client) {
    return { ok: false, error: "That client no longer exists." };
  }

  refresh();
  return { ok: true, companyName: client.companyName };
}

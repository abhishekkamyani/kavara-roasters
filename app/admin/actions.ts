"use server";

import { isValidObjectId } from "mongoose";
import { refresh } from "next/cache";
import { isAdmin } from "@/lib/dal";
import { connectDB } from "@/lib/mongodb";
import {
  ORDER_STATUSES,
  ROAST_LEVELS,
  UPLOADTHING_HOST_PATTERN,
  type OrderStatus,
  type RoastLevel,
} from "@/lib/constants";
import { roundMoney } from "@/lib/pricing";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";

function isRoastLevel(value: string): value is RoastLevel {
  return (ROAST_LEVELS as readonly string[]).includes(value);
}

function isUploadThingUrl(value: string) {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" && UPLOADTHING_HOST_PATTERN.test(url.hostname)
    );
  } catch {
    return false;
  }
}

export type ProductResult =
  | { ok: true; name: string }
  | { ok: false; error: string };

type ProductFields = {
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  basePrice: number;
  moqKg: number;
  imageUrl: string;
};

/**
 * Validates the product form. `currentImageUrl` is the image an existing
 * product already has, which is accepted as-is when it wasn't replaced.
 */
function parseProductForm(
  formData: FormData,
  currentImageUrl?: string
): { fields: ProductFields } | { error: string } {
  const name = String(formData.get("name") ?? "").trim();
  const origin = String(formData.get("origin") ?? "").trim();
  const roastLevel = String(formData.get("roastLevel") ?? "");
  const basePrice = Number(formData.get("basePrice"));
  const moqKg = Number(formData.get("moqKg"));
  const imageUrl = String(formData.get("imageUrl") ?? "");

  if (!name || !origin) {
    return { error: "Name and origin are required." };
  }
  if (!isRoastLevel(roastLevel)) {
    return { error: "Choose a roast level." };
  }
  if (!Number.isFinite(basePrice) || basePrice <= 0) {
    return { error: "Base price must be greater than zero." };
  }
  if (!Number.isInteger(moqKg) || moqKg < 1) {
    return {
      error: "Minimum order must be a whole number of kg (1 or more).",
    };
  }
  if (imageUrl !== currentImageUrl && !isUploadThingUrl(imageUrl)) {
    return { error: "Upload a product image before saving." };
  }

  return {
    fields: {
      name,
      origin,
      roastLevel,
      basePrice: roundMoney(basePrice),
      moqKg,
      imageUrl,
    },
  };
}

export async function createProduct(formData: FormData): Promise<ProductResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can add products." };
  }

  const parsed = parseProductForm(formData);
  if ("error" in parsed) return { ok: false, error: parsed.error };
  const { fields } = parsed;

  await connectDB();
  if (await Product.exists({ name: fields.name })) {
    return {
      ok: false,
      error: `A product named "${fields.name}" already exists.`,
    };
  }

  await Product.create(fields);
  return { ok: true, name: fields.name };
}

export async function updateProduct(
  productId: string,
  formData: FormData
): Promise<ProductResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can edit products." };
  }
  if (!isValidObjectId(productId)) {
    return { ok: false, error: "That product no longer exists." };
  }

  await connectDB();
  const product = await Product.findById(productId);
  if (!product) {
    return { ok: false, error: "That product no longer exists." };
  }

  const parsed = parseProductForm(formData, product.imageUrl);
  if ("error" in parsed) return { ok: false, error: parsed.error };
  const { fields } = parsed;

  if (await Product.exists({ name: fields.name, _id: { $ne: product._id } })) {
    return {
      ok: false,
      error: `A product named "${fields.name}" already exists.`,
    };
  }

  product.set(fields);
  await product.save();
  return { ok: true, name: fields.name };
}

/**
 * Removes a product from the catalog. Past orders keep their quantities and
 * prices; their lines for this product show as "Discontinued product".
 */
export async function deleteProduct(productId: string): Promise<ProductResult> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can delete products." };
  }
  if (!isValidObjectId(productId)) {
    return { ok: false, error: "That product no longer exists." };
  }

  await connectDB();
  const deleted = await Product.findByIdAndDelete(productId);
  if (!deleted) {
    return { ok: false, error: "That product no longer exists." };
  }

  refresh();
  return { ok: true, name: deleted.name };
}

export async function updateOrderStatus(
  orderId: string,
  status: OrderStatus
): Promise<{ ok: boolean; error?: string }> {
  if (!(await isAdmin())) {
    return { ok: false, error: "Only admins can update orders." };
  }
  if (!isValidObjectId(orderId) || !ORDER_STATUSES.includes(status)) {
    return { ok: false, error: "Invalid order update." };
  }

  await connectDB();
  const updated = await Order.findByIdAndUpdate(orderId, { status });
  if (!updated) {
    return { ok: false, error: "That order no longer exists." };
  }

  refresh();
  return { ok: true };
}

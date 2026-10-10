"use server";

import { isValidObjectId } from "mongoose";
import { getSessionUser } from "@/lib/dal";
import { connectDB } from "@/lib/mongodb";
import { CHECKOUT_MOQ_KG } from "@/lib/constants";
import { kgShortOfMoq, priceForTier, roundMoney } from "@/lib/pricing";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";

export type PlaceOrderResult =
  | { ok: true; orderId: string; totalAmount: number }
  | { ok: false; error: string };

type OrderLine = { productId: string; quantity: number };

export async function placeOrder(lines: OrderLine[]): Promise<PlaceOrderResult> {
  const sessionUser = await getSessionUser();
  if (!sessionUser || sessionUser.role !== "CLIENT") {
    return { ok: false, error: "Sign in with a client account to order." };
  }

  if (!Array.isArray(lines) || lines.length === 0) {
    return { ok: false, error: "Your cart is empty." };
  }

  // Merge duplicate lines and reject anything that isn't a whole-kg quantity.
  const quantities = new Map<string, number>();
  for (const line of lines) {
    if (
      !line ||
      !isValidObjectId(line.productId) ||
      !Number.isInteger(line.quantity) ||
      line.quantity < 1
    ) {
      return { ok: false, error: "Your cart contains an invalid item." };
    }
    quantities.set(
      line.productId,
      (quantities.get(line.productId) ?? 0) + line.quantity
    );
  }

  const totalKg = [...quantities.values()].reduce((sum, kg) => sum + kg, 0);
  const shortBy = kgShortOfMoq(totalKg);
  if (shortBy > 0) {
    return {
      ok: false,
      error: `You must add ${shortBy} more kg to reach the ${CHECKOUT_MOQ_KG}kg minimum.`,
    };
  }

  await connectDB();

  // Price from the database, never from the client or a possibly stale session.
  const [client, products] = await Promise.all([
    User.findById(sessionUser.id).lean(),
    Product.find({ _id: { $in: [...quantities.keys()] } }).lean(),
  ]);
  if (!client || client.role !== "CLIENT") {
    return { ok: false, error: "Your account could not be found." };
  }
  if (products.length !== quantities.size) {
    return {
      ok: false,
      error: "A product in your cart is no longer available. Please refresh.",
    };
  }

  const items = [];
  for (const product of products) {
    const quantity = quantities.get(product._id.toString())!;
    if (quantity < product.moqKg) {
      return {
        ok: false,
        error: `${product.name} has a minimum of ${product.moqKg}kg per order.`,
      };
    }
    items.push({
      productId: product._id,
      quantity,
      priceAtPurchase: priceForTier(product.basePrice, client.tier),
    });
  }

  const totalAmount = roundMoney(
    items.reduce((sum, item) => sum + item.priceAtPurchase * item.quantity, 0)
  );

  const order = await Order.create({
    clientId: client._id,
    items,
    totalAmount,
    status: "PENDING",
  });

  return { ok: true, orderId: order._id.toString(), totalAmount };
}

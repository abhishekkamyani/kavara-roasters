import "server-only";
import { isValidObjectId } from "mongoose";
import { connectDB } from "@/lib/mongodb";
import { requireAdmin, requireClient } from "@/lib/dal";
import { Order } from "@/models/Order";
import { Product } from "@/models/Product";
import { User } from "@/models/User";
import type { OrderStatus, RoastLevel, Tier } from "@/lib/constants";

export type ProductDTO = {
  id: string;
  name: string;
  origin: string;
  roastLevel: RoastLevel;
  basePrice: number;
  moqKg: number;
  imageUrl: string;
};

export type OrderItemDTO = {
  productId: string;
  name: string;
  origin: string;
  quantity: number;
  priceAtPurchase: number;
};

export type OrderDTO = {
  id: string;
  createdAt: string;
  status: OrderStatus;
  totalAmount: number;
  totalKg: number;
  items: OrderItemDTO[];
  client: { companyName: string; email: string; tier: Tier } | null;
};

type PopulatedOrder = {
  _id: { toString(): string };
  createdAt: Date;
  status: OrderStatus;
  totalAmount: number;
  clientId: { companyName: string; email: string; tier: Tier } | null;
  items: {
    productId: {
      _id: { toString(): string };
      name: string;
      origin: string;
    } | null;
    quantity: number;
    priceAtPurchase: number;
  }[];
};

function toOrderDTO(order: PopulatedOrder): OrderDTO {
  return {
    id: order._id.toString(),
    createdAt: order.createdAt.toISOString(),
    status: order.status,
    totalAmount: order.totalAmount,
    totalKg: order.items.reduce((sum, item) => sum + item.quantity, 0),
    items: order.items.map((item) => ({
      productId: item.productId?._id.toString() ?? "",
      name: item.productId?.name ?? "Discontinued product",
      origin: item.productId?.origin ?? "",
      quantity: item.quantity,
      priceAtPurchase: item.priceAtPurchase,
    })),
    client: order.clientId
      ? {
          companyName: order.clientId.companyName,
          email: order.clientId.email,
          tier: order.clientId.tier,
        }
      : null,
  };
}

async function findOrders(filter: Record<string, unknown>) {
  await connectDB();
  const orders = await Order.find(filter)
    .sort({ createdAt: -1 })
    .populate("clientId", "companyName email tier")
    .populate("items.productId", "name origin")
    .lean<PopulatedOrder[]>();
  return orders.map(toOrderDTO);
}

type LeanProduct = Omit<ProductDTO, "id"> & { _id: { toString(): string } };

function toProductDTO(product: LeanProduct): ProductDTO {
  return {
    id: product._id.toString(),
    name: product.name,
    origin: product.origin,
    roastLevel: product.roastLevel,
    basePrice: product.basePrice,
    moqKg: product.moqKg,
    imageUrl: product.imageUrl,
  };
}

export async function getProducts(): Promise<ProductDTO[]> {
  await connectDB();
  const products = await Product.find().sort({ name: 1 }).lean();
  return products.map(toProductDTO);
}

export async function getProduct(id: string): Promise<ProductDTO | null> {
  if (!isValidObjectId(id)) return null;
  await connectDB();
  const product = await Product.findById(id).lean();
  return product ? toProductDTO(product) : null;
}

export type ClientDTO = {
  id: string;
  companyName: string;
  email: string;
  tier: Tier;
  createdAt: string;
  orderCount: number;
};

/** Every client account, with how many orders each has placed. Admins only. */
export async function getClients(): Promise<ClientDTO[]> {
  await requireAdmin();
  await connectDB();

  const [clients, orderCounts] = await Promise.all([
    User.find({ role: "CLIENT" })
      .sort({ companyName: 1 })
      .select("companyName email tier createdAt")
      .lean(),
    Order.aggregate<{ _id: { toString(): string }; count: number }>([
      { $group: { _id: "$clientId", count: { $sum: 1 } } },
    ]),
  ]);
  const countByClient = new Map(
    orderCounts.map((entry) => [entry._id.toString(), entry.count])
  );

  return clients.map((client) => ({
    id: client._id.toString(),
    companyName: client.companyName,
    email: client.email,
    tier: client.tier,
    createdAt: client.createdAt.toISOString(),
    orderCount: countByClient.get(client._id.toString()) ?? 0,
  }));
}

/** Orders belonging to the signed-in client. */
export async function getMyOrders() {
  const user = await requireClient();
  return findOrders({ clientId: user.id });
}

/** Every order in the system. Admins only. */
export async function getAllOrders() {
  await requireAdmin();
  return findOrders({});
}

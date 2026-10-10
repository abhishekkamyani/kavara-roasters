import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ORDER_STATUSES } from "../lib/constants";

const orderItemSchema = new Schema(
  {
    productId: { type: Schema.Types.ObjectId, ref: "Product", required: true },
    // Kilograms ordered.
    quantity: { type: Number, required: true, min: 1 },
    // Tier-discounted USD per kg at the moment the order was placed.
    priceAtPurchase: { type: Number, required: true, min: 0 },
  },
  { _id: false }
);

const orderSchema = new Schema(
  {
    clientId: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: (items: unknown[]) => items.length > 0,
    },
    totalAmount: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      required: true,
      default: "PENDING",
    },
  },
  { timestamps: true }
);

export type OrderDoc = InferSchemaType<typeof orderSchema>;

export const Order: Model<OrderDoc> =
  (models.Order as Model<OrderDoc>) ?? model<OrderDoc>("Order", orderSchema);

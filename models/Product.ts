import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ROAST_LEVELS } from "../lib/constants";

const productSchema = new Schema(
  {
    name: { type: String, required: true, unique: true, trim: true },
    origin: { type: String, required: true, trim: true },
    roastLevel: { type: String, enum: ROAST_LEVELS, required: true },
    // Wholesale base price in USD per kg, before tier discounts.
    basePrice: { type: Number, required: true, min: 0 },
    // Smallest quantity of this product a single order line may contain.
    moqKg: { type: Number, required: true, min: 1, default: 1 },
    imageUrl: { type: String, required: true },
  },
  { timestamps: true }
);

export type ProductDoc = InferSchemaType<typeof productSchema>;

export const Product: Model<ProductDoc> =
  (models.Product as Model<ProductDoc>) ??
  model<ProductDoc>("Product", productSchema);

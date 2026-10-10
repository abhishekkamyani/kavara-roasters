import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";
import { ROLES, TIERS } from "../lib/constants";

const userSchema = new Schema(
  {
    companyName: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    password: { type: String, required: true },
    role: { type: String, enum: ROLES, required: true, default: "CLIENT" },
    tier: { type: String, enum: TIERS, required: true, default: "BRONZE" },
  },
  { timestamps: true }
);

export type UserDoc = InferSchemaType<typeof userSchema>;

export const User: Model<UserDoc> =
  (models.User as Model<UserDoc>) ?? model<UserDoc>("User", userSchema);

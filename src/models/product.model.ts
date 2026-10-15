import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  PRODUCT_STATUSES,
  type ProductStatus,
} from "@/src/types/domain";

export interface IProduct {
  _id: Types.ObjectId;
  shop: Types.ObjectId;
  name: string;
  slug: string;
  description: string;
  category: string;
  imageUrls: string[];
  priceInMinorUnits: number;
  currency: "PKR";
  status: ProductStatus;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  tags: string[];
  createdAt: Date;
  updatedAt: Date;
}

const productSchema = new Schema<IProduct>(
  {
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 150,
    },
    slug: {
      type: String,
      required: true,
      lowercase: true,
      trim: true,
      match: /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
    },
    description: {
      type: String,
      required: true,
      trim: true,
      maxlength: 3000,
    },
    category: {
      type: String,
      required: true,
      trim: true,
      maxlength: 80,
    },
    imageUrls: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (urls: string[]) => urls.length <= 10,
        message: "A product can have at most 10 images.",
      },
    },
    priceInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isSafeInteger,
        message: "Product price must be a safe integer in minor units.",
      },
    },
    currency: {
      type: String,
      enum: ["PKR"],
      default: "PKR",
      required: true,
    },
    status: {
      type: String,
      enum: PRODUCT_STATUSES,
      default: "active",
      required: true,
    },
    isAvailable: {
      type: Boolean,
      default: true,
      required: true,
    },
    preparationTimeMinutes: {
      type: Number,
      default: 20,
      min: 0,
      max: 1440,
    },
    tags: {
      type: [{ type: String, trim: true }],
      default: [],
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ shop: 1, slug: 1 }, { unique: true });
productSchema.index({ shop: 1, status: 1, isAvailable: 1 });
productSchema.index({ category: 1, status: 1 });

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
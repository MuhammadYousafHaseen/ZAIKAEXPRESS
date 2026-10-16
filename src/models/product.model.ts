import mongoose, { Schema, type Model, type Types } from "mongoose";

import {
  PRODUCT_CATEGORIES,
  PRODUCT_STATUSES,
  type ProductCategory,
  type ProductStatus,
} from "@/src/types/domain";

export interface IProduct {
  _id: Types.ObjectId;
  shop: Types.ObjectId;

  name: string;
  slug: string;
  description: string;
  category: ProductCategory;

  imageUrls: string[];

  /** Product price directly in PKR (whole rupees). */
  price: number;
  currency: "PKR";

  status: ProductStatus;
  isAvailable: boolean;

  preparationTimeMinutes: number;
  tags: string[];

  /** Updated by the review/rating service, not directly by shopkeepers. */
  ratingAverage: number;
  ratingCount: number;

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
      enum: PRODUCT_CATEGORIES,
      required: true,
      trim: true,
      index: true,
    },

    imageUrls: {
      type: [{ type: String, trim: true }],
      default: [],
      validate: {
        validator: (urls: string[]) => urls.length <= 10,
        message: "A product can have at most 10 images.",
      },
    },

    price: {
      type: Number,
      required: true,
      min: 1,
      validate: {
        validator: (value: number) =>
          Number.isSafeInteger(value),
        message: "Product price must be a positive whole amount in PKR.",
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

    ratingAverage: {
      type: Number,
      default: 0,
      min: 0,
      max: 5,
      required: true,
    },

    ratingCount: {
      type: Number,
      default: 0,
      min: 0,
      validate: {
        validator: (value: number) =>
          Number.isSafeInteger(value),
        message: "Rating count must be a non-negative integer.",
      },
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

productSchema.index({ shop: 1, slug: 1 }, { unique: true });

productSchema.index({
  shop: 1,
  status: 1,
  isAvailable: 1,
});

productSchema.index({
  category: 1,
  status: 1,
  isAvailable: 1,
});

productSchema.index({
  ratingAverage: -1,
  ratingCount: -1,
});

const Product: Model<IProduct> =
  mongoose.models.Product ||
  mongoose.model<IProduct>("Product", productSchema);

export default Product;
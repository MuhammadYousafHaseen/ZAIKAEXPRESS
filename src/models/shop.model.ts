import mongoose, { Schema, type Model, type Types } from "mongoose";

import {
  SHOP_STATUSES,
  type ShopStatus,
} from "@/src/types/domain";

export interface IShop {
  _id: Types.ObjectId;
  owner: Types.ObjectId;

  name: string;
  slug: string;
  description: string;

  logoUrl?: string;
  coverImageUrl?: string;

  cuisineTypes: string[];
  phone: string;

  address: {
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
  };

  status: ShopStatus;
  rejectionReason?: string;

  deliveryRadiusKm: number;
  acceptsOrders: boolean;

  createdAt: Date;
  updatedAt: Date;
}

const shopSchema = new Schema<IShop>(
  {
    owner: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },

    name: {
      type: String,
      required: true,
      trim: true,
      minlength: 2,
      maxlength: 100,
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
      maxlength: 2000,
    },

    logoUrl: {
      type: String,
      trim: true,
    },

    coverImageUrl: {
      type: String,
      trim: true,
    },

    cuisineTypes: {
      type: [{ type: String, trim: true }],
      default: [],
    },

    phone: {
      type: String,
      required: true,
      trim: true,
      maxlength: 30,
    },

    address: {
      addressLine1: {
        type: String,
        required: true,
        trim: true,
      },

      addressLine2: {
        type: String,
        trim: true,
      },

      city: {
        type: String,
        required: true,
        trim: true,
      },

      state: {
        type: String,
        trim: true,
      },

      postalCode: {
        type: String,
        trim: true,
      },

      country: {
        type: String,
        required: true,
        trim: true,
      },
    },

    status: {
      type: String,
      enum: SHOP_STATUSES,
      default: "pending",
      required: true,
    },

    rejectionReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },

    deliveryRadiusKm: {
      type: Number,
      default: 5,
      min: 1,
      max: 100,
    },

    acceptsOrders: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

shopSchema.index({ slug: 1 }, { unique: true });

shopSchema.index({
  status: 1,
  acceptsOrders: 1,
});

const Shop: Model<IShop> =
  mongoose.models.Shop ||
  mongoose.model<IShop>("Shop", shopSchema);

export default Shop;
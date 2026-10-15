import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  ORDER_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type OrderStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/types/domain";

export interface IOrderItem {
  product: Types.ObjectId;
  name: string;
  imageUrl?: string;
  unitPriceInMinorUnits: number;
  quantity: number;
  lineTotalInMinorUnits: number;
}

export interface IOrder {
  _id: Types.ObjectId;
  checkout: Types.ObjectId;
  customer: Types.ObjectId;
  shop: Types.ObjectId;
  items: IOrderItem[];
  deliveryAddress: {
    recipientName: string;
    phone: string;
    addressLine1: string;
    addressLine2?: string;
    city: string;
    state?: string;
    postalCode?: string;
    country: string;
    location?: {
      lat: number;
      lng: number;
    };
  };
  currency: "PKR";
  subtotalInMinorUnits: number;
  deliveryFeeInMinorUnits: number;
  totalInMinorUnits: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: OrderStatus;
  cancellationReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

const orderItemSchema = new Schema<IOrderItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    name: {
      type: String,
      required: true,
      trim: true,
    },
    imageUrl: {
      type: String,
      trim: true,
    },
    unitPriceInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      validate: Number.isSafeInteger,
    },
    lineTotalInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
  },
  { _id: false }
);

const deliveryAddressSchema = new Schema(
  {
    recipientName: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    addressLine1: { type: String, required: true, trim: true },
    addressLine2: { type: String, trim: true },
    city: { type: String, required: true, trim: true },
    state: { type: String, trim: true },
    postalCode: { type: String, trim: true },
    country: { type: String, required: true, trim: true },
    location: {
      lat: { type: Number, min: -90, max: 90 },
      lng: { type: Number, min: -180, max: 180 },
    },
  },
  { _id: false }
);

const orderSchema = new Schema<IOrder>(
  {
    checkout: {
      type: Schema.Types.ObjectId,
      ref: "Checkout",
      required: true,
      index: true,
    },
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    shop: {
      type: Schema.Types.ObjectId,
      ref: "Shop",
      required: true,
      index: true,
    },
    items: {
      type: [orderItemSchema],
      required: true,
      validate: {
        validator: (items: IOrderItem[]) => items.length > 0,
        message: "An order must contain at least one item.",
      },
    },
    deliveryAddress: {
      type: deliveryAddressSchema,
      required: true,
    },
    currency: {
      type: String,
      enum: ["PKR"],
      default: "PKR",
      required: true,
    },
    subtotalInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    deliveryFeeInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    totalInMinorUnits: {
      type: Number,
      required: true,
      min: 0,
      validate: Number.isSafeInteger,
    },
    paymentMethod: {
      type: String,
      enum: PAYMENT_METHODS,
      default: "cod",
      required: true,
    },
    paymentStatus: {
      type: String,
      enum: PAYMENT_STATUSES,
      default: "pending",
      required: true,
    },
    status: {
      type: String,
      enum: ORDER_STATUSES,
      default: "pending",
      required: true,
    },
    cancellationReason: {
      type: String,
      trim: true,
      maxlength: 1000,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ shop: 1, status: 1, createdAt: -1 });

const Order: Model<IOrder> =
  mongoose.models.Order ||
  mongoose.model<IOrder>("Order", orderSchema);

export default Order;
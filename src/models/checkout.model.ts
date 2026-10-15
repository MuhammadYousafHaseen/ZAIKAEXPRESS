import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  CHECKOUT_STATUSES,
  PAYMENT_METHODS,
  PAYMENT_STATUSES,
  type CheckoutStatus,
  type PaymentMethod,
  type PaymentStatus,
} from "@/src/types/domain";

export interface ICheckout {
  _id: Types.ObjectId;
  customer: Types.ObjectId;
  orderIds: Types.ObjectId[];
  idempotencyKey: string;
  currency: "PKR";
  subtotalInMinorUnits: number;
  deliveryFeeInMinorUnits: number;
  totalInMinorUnits: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  status: CheckoutStatus;
  createdAt: Date;
  updatedAt: Date;
}

const checkoutSchema = new Schema<ICheckout>(
  {
    customer: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index: true,
    },
    orderIds: {
      type: [{ type: Schema.Types.ObjectId, ref: "Order" }],
      default: [],
    },
    idempotencyKey: {
      type: String,
      required: true,
      trim: true,
      maxlength: 128,
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
      enum: CHECKOUT_STATUSES,
      default: "placed",
      required: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

checkoutSchema.index(
  { customer: 1, idempotencyKey: 1 },
  { unique: true }
);

const Checkout: Model<ICheckout> =
  mongoose.models.Checkout ||
  mongoose.model<ICheckout>("Checkout", checkoutSchema);

export default Checkout;
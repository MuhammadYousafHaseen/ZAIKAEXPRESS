import mongoose, { Schema, type Model, type Types } from "mongoose";
import {
  USER_ROLES,
  ACCOUNT_STATUSES,
  EMAIL_DELIVERY_STATUSES,
  type UserRole,
  type AccountStatus,
  type EmailDeliveryStatus,
} from "@/src/types/domain";

export interface IUser {
  _id: Types.ObjectId;
  name: string;
  email: string;
  passwordHash: string;
  phone?: string;
  avatarUrl?: string;
  roles: UserRole[];
  status: AccountStatus;
  welcomeEmailStatus: EmailDeliveryStatus;
  welcomeEmailLastAttemptAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: 2,
      maxlength: 80,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      maxlength: 254,
    },
    passwordHash: {
      type: String,
      required: true,
      select: false,
    },
    phone: {
      type: String,
      trim: true,
      maxlength: 30,
    },
    avatarUrl: {
      type: String,
      trim: true,
    },
    roles: {
      type: [
        {
          type: String,
          enum: USER_ROLES,
        },
      ],
      default: ["customer"],
      validate: {
        validator: (roles: UserRole[]) =>
          roles.length > 0 && new Set(roles).size === roles.length,
        message: "A user must have unique role assignments.",
      },
    },
    status: {
      type: String,
      enum: ACCOUNT_STATUSES,
      default: "active",
      required: true,
    },
    welcomeEmailStatus: {
      type: String,
      enum: EMAIL_DELIVERY_STATUSES,
      default: "pending",
      required: true,
    },
    welcomeEmailLastAttemptAt: {
      type: Date,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const User: Model<IUser> =
  mongoose.models.User ||
  mongoose.model<IUser>("User", userSchema);

export default User;
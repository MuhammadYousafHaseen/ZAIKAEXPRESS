import mongoose, { Schema, Document, Model } from "mongoose";

// Defining the User interface
export interface IUser extends Document {
  name: string;
  email: string;
  password: string;
  image?: string;
  phone: string;
  address: string;
  city: string;
  country?: string;
  state?: string;
  isAdmin: boolean;
  isVerified: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  cart: mongoose.Types.ObjectId[];
  orders: mongoose.Types.ObjectId[];
  liveLocation:{ lat:number, lng:number} // You can define a specific type if needed for orders
}

// Defining the User schema
const userSchema: Schema<IUser> = new Schema(
  {
    name: { type: String, required: [true, "Name is required"], unique: true },
    email: { type: String, required: [true, "Email is required"], unique: true },
    password: { type: String, required: [true, "Password is required"] },
    image: { type: String },
    phone: { type: String, required: [true, "Phone is required"] },
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"] },
    country: { type: String },
    state: { type: String },
    isAdmin: { type: Boolean, default: false },
    isVerified: { type: Boolean, default: false },
    verifyCode: {
      type: String,
      required: [true, "Verify code is required!"],
    },
    verifyCodeExpiry: {
      type: Date,
      required: [true, "Verify code expiry is required!"],
    },
    cart: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
    orders: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      }
    ],
    liveLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
    
  },
  { timestamps: true }
);

// Defining the User model
const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>("User", userSchema);

export default User;

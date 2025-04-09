import mongoose, { Schema, Document, Model } from "mongoose";

// Defining the Owner 
interface IOwner extends Document {
  name: string;
  email: string;
  phone: string;
  address?: string;
  productsCategory: string;
  isApprovedOwner: boolean;
  requestForApproval?:string,
  password: string;
  image?: string;
  products: mongoose.Types.ObjectId[]; 
  liveLocation:{ lat:number, lng:number} // Array of product IDs, referencing Product model
}

// Defining the owner schema
const ownerSchema: Schema<IOwner> = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], unique: true },
    email: { type: String, required: [true, 'Email is required'], unique: true },
    phone: { type: String, required: [true, 'Phone number is required'], unique: true },
    address: { type: String, required: [true, 'Address is required'] },
    requestForApproval: { type: String },
    productsCategory: { type: String, required: [true, 'Products category is required'] },
    isApprovedOwner: { type: Boolean, default: false },
    password: { type: String, required: [true, 'Password is required'] },
    image: { type: String },
    products: [
      { type: mongoose.Schema.Types.ObjectId, ref: 'Product' } // Array of product IDs referencing Product
    ],
    liveLocation: {
      lat: { type: Number, default: 0 },
      lng: { type: Number, default: 0 },
    },
  },
  { timestamps: true }
);

// Defining the Owner model
const Owner: Model<IOwner> = mongoose.models.Owner || mongoose.model<IOwner>("Owner", ownerSchema);

export default Owner;

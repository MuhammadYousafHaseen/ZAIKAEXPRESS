import mongoose, { Schema, Document, Model } from "mongoose";

// Defining the Product interface
interface IProduct extends Document {
  name: string;
  image: string;
  price: number;
  discount: number;
  description: string;
  owner: mongoose.Types.ObjectId; // Referencing the Owner model
}

// Defining the product schema
const productSchema: Schema<IProduct> = new Schema(
  {
    name: { type: String, required: [true, 'Name is required'], unique: true },
    image: { type: String, required: [true, 'Image is required'] },
    description: { type: String, required: [true, 'Description is required'] },
    price: { 
      type: Number, 
      required: [true, 'Price is required'], 
      min: [0, 'Price must be greater than 0']
    },
    discount: { type: Number, default: 0 },
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'Owner' },
  },
  { timestamps: true }
);

// Defining the Product model
const Product: Model<IProduct> = mongoose.models.Product || mongoose.model<IProduct>("Product", productSchema);

export default Product;

import mongoose, { Schema, type Model, type Types } from "mongoose";

export interface ICartItem {
  product: Types.ObjectId;
  quantity: number;
}

export interface ICart {
  _id: Types.ObjectId;
  user: Types.ObjectId;
  items: ICartItem[];
  createdAt: Date;
  updatedAt: Date;
}

const cartItemSchema = new Schema<ICartItem>(
  {
    product: {
      type: Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },
    quantity: {
      type: Number,
      required: true,
      min: 1,
      max: 99,
      validate: {
        validator: Number.isSafeInteger,
        message: "Quantity must be a whole number.",
      },
    },
  },
  {
    _id: false,
  }
);

const cartSchema = new Schema<ICart>(
  {
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    items: {
      type: [cartItemSchema],
      default: [],
      validate: {
        validator: (items: ICartItem[]) => {
          const productIds = items.map((item) =>
            item.product.toString()
          );

          return new Set(productIds).size === productIds.length;
        },
        message: "A product can appear only once in a cart.",
      },
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

const Cart: Model<ICart> =
  mongoose.models.Cart ||
  mongoose.model<ICart>("Cart", cartSchema);

export default Cart;
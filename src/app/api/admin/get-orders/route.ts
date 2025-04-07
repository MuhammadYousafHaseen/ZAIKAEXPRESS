// /api/admin/get-orders-with-details/route.ts
import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import Product from "@/models/product.model";
import { NextResponse } from "next/server";

export async function GET() {
  await dbConnect();

  try {
    // Fetch users who have orders
    const users = await User.find({ "orders.0": { $exists: true } })
      .select("name email phone address city orders")
      .lean(); // Get plain JS objects

    // Get all product IDs from all users
    const allProductIds = users.flatMap(user => user.orders);

    // Fetch product details for all product IDs
    const products = await Product.find({ _id: { $in: allProductIds } })
      .select("name price image isDelivered")
      .lean();

    const productMap = new Map(products.map(prod => [prod._id.toString(), prod]));

    // Attach product details to each user's orders
    const enrichedUsers = users.map(user => {
      const detailedOrders = user.orders.map(productId => {
        const product = productMap.get(productId.toString());
        return product ? { ...product, _id: productId } : null;
      }).filter(Boolean); // Remove nulls

      return {
        ...user,
        orders: detailedOrders
      };
    });

    return NextResponse.json({ message: "Orders fetched",users: enrichedUsers }, { status: 200 });
  } catch (error) {
    console.error("Error fetching enriched order data:", error);
    return NextResponse.json({ message: "Error fetching orders" }, { status: 500 });
  }
}

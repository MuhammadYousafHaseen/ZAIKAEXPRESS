import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function POST() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.cart || user.cart.length === 0) {
      return Response.json({ error: "Cart is empty" }, { status: 400 });
    }

    // Add cart items to orders and clear the cart
    user.orders.push(...user.cart);
    const orderedProductIds = [...user.cart];
    user.cart = [];

    await user.save();

    // Get full product details
    const orderedProducts = await Product.find({ _id: { $in: orderedProductIds } });
    //console.log(orderedProducts);
    return Response.json({
      message: "Order placed successfully",
      orders: orderedProducts,
    }, { status: 200 });
  } catch (error) {
    console.error("Error placing order:", error);
    return Response.json({ message: "Error in Placing The Order: " + error }, { status: 500 });
  }
}

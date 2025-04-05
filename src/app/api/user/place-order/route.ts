import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
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

    // Add all cart items to orders
    user.orders.push(...user.cart);

    // Clear the cart
    user.cart = [];

    await user.save();

    return Response.json({ message: "Order placed successfully", orders: user.orders }, { status: 200 });
  } catch (error) {
    return Response.json({ message:"Error in Placing The Order" + error }, { status: 500 });
  }
}

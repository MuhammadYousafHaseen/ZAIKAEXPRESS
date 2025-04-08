import dbConnect from "@/lib/dbConnect";
import Order from "@/models/order.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    // Find orders for this user in the Order collection
    const orders = await Order.find({ user: session.user.id })
      .populate("products", "name price image isDelivered") // Populate the 'products' field with selected fields.
      .lean();

    if (!orders || orders.length === 0) {
      return Response.json(
        { message: "You have not placed any orders yet." },
        { status: 400 }
      );
    }

    return Response.json(
      { orders },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching orders:", error);
    return Response.json(
      { message: "Error fetching orders: "},
      { status: 500 }
    );
  }
}

// /api/owner/orders/route.ts
import dbConnect from "@/lib/dbConnect";
import Product from "@/models/product.model";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "../../auth/[...nextauth]/route";

export const GET = async () => {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ message: "Unauthorized" }, { status: 401 });
  }

  const ownerId = session.user.id;

  try {
    // Step 1: Get all products by the owner
    const ownerProducts = await Product.find({ owner: ownerId }).select("_id");
    const productIds = ownerProducts.map(p => p._id);

    // Step 2: Find users who have ordered these products
    const usersWithOrders = await User.find({ orders: { $in: productIds } })
      .select("name email orders phone address city")
      .populate({
        path: "orders",
        match: { _id: { $in: productIds } },
        select: "name price image",
      });

    return Response.json({ users: usersWithOrders });
  } catch (error) {
    console.error("Error fetching owner orders:", error);
    return Response.json({ message: "Server error" }, { status: 500 });
  }
};

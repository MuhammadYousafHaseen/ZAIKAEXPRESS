import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import Product from "@/models/product.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
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

    if (!user.orders || user.orders.length === 0) {
      return Response.json({ message: "You have not placed any orders yet." }, { status: 400 });
    }

    // Fetch full product details for each order
    const orderedProducts = await Product.find({ _id: { $in: user.orders } });

    return Response.json(
      { orders: orderedProducts },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error fetching order items:", error);
    return Response.json(
      { message: "Error fetching order items: " + error },
      { status: 500 }
    );
  }
}

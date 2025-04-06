import dbConnect from "@/lib/dbConnect";
import User from "@/models/user.model";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function GET() {
  await dbConnect();

  const session = await getServerSession(authOptions);
  if (!session || !session.user?.id) {
    return Response.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const user = await User.findById(session.user.id).populate("cart");
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }

    return Response.json(
      { cart: user.orders },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({message:"Error Fetching Cart Items" + error}, { status: 500 });
  }
}

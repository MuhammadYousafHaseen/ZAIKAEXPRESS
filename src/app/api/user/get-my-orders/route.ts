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
    const user = await User.findById(session.user.id);
    if (!user) {
      return Response.json({ error: "User not found" }, { status: 404 });
    }
    if(!user.orders){
      return Response.json({message:"You have not placed any orders yet."},{status:400})
    }
    return Response.json(
      { order: user.orders },
      { status: 200 }
    );
  } catch (error) {
    return Response.json({message:"Error Fetching Order Items" + error}, { status: 500 });
  }
}

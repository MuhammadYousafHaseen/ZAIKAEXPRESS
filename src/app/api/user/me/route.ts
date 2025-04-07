import User from "@/models/user.model";
import dbConnect from "@/lib/dbConnect";
import { NextRequest } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function  POST(request: NextRequest) {

    await dbConnect();

     // Get the current session. We assume that for an owner, the session includes an ownerId.
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ message: "Unauthorized or not an owner" }, { status: 401 });
  }
    
  const {userId} = await request.json();

  const user = await User.findById(userId);
  if (!user) {
    return Response.json({ message: "User not found" }, { status: 404 });
  }
  //console.log(user);

  return Response.json(user);



}
import dbConnect from "@/lib/dbConnect";
import Owner from "@/models/owner.model";

// Optional: You might want to import your auth middleware to verify that the requester is an admin
import { getServerSession } from "next-auth/next";
 import { authOptions } from "@/app/api/auth/[...nextauth]/route";

export async function PATCH(request: Request) {

  await dbConnect();
  // Optional: Admin authorization check (pseudo-code)
   const session = await getServerSession(authOptions);
   if (!session || session.user.isAdmin !== true) {
     return Response.json({ message: "Unauthorized" }, { status: 401 });
   }



  try {
    // Parse the request body to get the ownerId to approve
    const { ownerId } = await request.json();
    if (!ownerId) {
      return Response.json({ message: "Owner ID is required" }, { status: 400 });
    }

    // Update the owner's approval status
    const updatedOwner = await Owner.findByIdAndUpdate(
      ownerId,
      { isApprovedOwner: true },
      { new: true }
    );

    if (!updatedOwner) {
      return Response.json({ message: "Owner not found" }, { status: 404 });
    }

    return Response.json(
      { message: "Owner approved successfully", data: updatedOwner },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error approving owner:", error);
    return Response.json(
      { message: "Internal Server Error"+ error },
      { status: 500 }
    );
  }
}

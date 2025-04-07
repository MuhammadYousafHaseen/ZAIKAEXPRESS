import dbConnect from "@/lib/dbConnect";
import Owner from "@/models/owner.model";
import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";


export async function GET() {
  
   // Optional: Admin authorization check (pseudo-code)
   const session = await getServerSession(authOptions);
   //console.log(session)
   if (!session || session.user.isAdmin !== true) {
     return Response.json({ message: "Unauthorized" }, { status: 401 });
   }
   await dbConnect();

  const owners = await Owner.find({}).select('name email phone address city isApprovedOwner').lean();
    if (!owners) {
        return Response.json({success:false, message:"No Owners found"},{status:404})
    }
  return Response.json({success:true, message:"Owners fetched Successfully", owners:owners},{status:200})
}
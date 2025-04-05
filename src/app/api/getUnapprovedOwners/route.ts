import dbConnect from "@/lib/dbConnect";
import Owner from "@/models/owner.model";


export async function GET() {
  await dbConnect();
  // const { search } = request.query;
  // const searchQuery = search ? { name: { $regex: search, $options: 'i' } } : {};
  const owners = await Owner.find({ isApprovedOwner: false });
    if (!owners) {
        return Response.json({success:false, message:"No Unapproved Owners found"},{status:404})
    }
  return Response.json({success:true, message:"Unapproved Owners fetched Successfully", data:owners},{status:200})
}
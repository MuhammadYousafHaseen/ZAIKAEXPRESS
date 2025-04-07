import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product.model';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import Owner from '@/models/owner.model';
import { NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  await dbConnect();

  // Retrieve the owner's session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  //const ownerId = session.user.ownerId;

  try {
    const {ownerId} = await request.json();
    //console.log(ownerId);
    if(!ownerId) {
      return Response.json({ message: "Owner ID is required.Unauthorized Request" }, { status: 400 });
    }
    //CHECK OWNER APPROVAL STATUS 
    const owner = await Owner.findById(ownerId);
    if(!owner?.isApprovedOwner) {
      return Response.json({ message: "Owner is not approved" }, { status: 403 });
      
    }
    // Fetch products associated with the authenticated owner
    const products = await Product.find({ owner: ownerId });

    return Response.json({ success: true, products },{status:202});
  } catch (error) {
    console.error('Error fetching owner products:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

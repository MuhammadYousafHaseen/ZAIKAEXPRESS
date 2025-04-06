import { getServerSession } from 'next-auth';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product.model';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET() {
  await dbConnect();

  // Retrieve the owner's session
  const session = await getServerSession(authOptions);
  if (!session || !session.user) {
    return Response.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const ownerId = session.user.ownerId;

  try {
    // Fetch products associated with the authenticated owner
    const products = await Product.find({ owner: ownerId });

    return Response.json({ success: true, products });
  } catch (error) {
    console.error('Error fetching owner products:', error);
    return Response.json({ message: 'Server error' }, { status: 500 });
  }
}

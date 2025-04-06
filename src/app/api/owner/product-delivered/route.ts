import { NextRequest, NextResponse } from 'next/server';
import mongoose from 'mongoose';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product.model';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function PATCH(request: NextRequest) {
  await dbConnect();

  // Authenticate the user
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  const { productId } = await request.json();

  if (!productId || !mongoose.Types.ObjectId.isValid(productId)) {
    return NextResponse.json({ message: 'Invalid product ID' }, { status: 400 });
  }

  try {
    // Find the product and check if the authenticated user is the owner
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    if (product.owner.toString() !== session.user.ownerId) {
      return NextResponse.json({ message: 'Forbidden' }, { status: 403 });
    }

    // Update the delivered field to true
    product.isDelivered = true;
    await product.save();

    return NextResponse.json(
      { message: 'Product marked as delivered', product },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error marking product as delivered:', error);
    return NextResponse.json(
      { message: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

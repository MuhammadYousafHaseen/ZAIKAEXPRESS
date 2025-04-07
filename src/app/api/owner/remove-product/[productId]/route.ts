// src/app/api/owner/remove-product/[productId]/route.ts

import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/dbConnect';
import Product from '@/models/product.model';
import Owner from '@/models/owner.model';

export async function POST( req:NextRequest) {
  await dbConnect();

  const { productId } = await req.json();
  

  if (!productId) {
    return NextResponse.json({ message: 'Product ID is required' }, { status: 400 });
  }

  try {
    // 1. Find the product to get its ownerId
    const product = await Product.findById(productId);
    if (!product) {
      return NextResponse.json({ message: 'Product not found' }, { status: 404 });
    }

    const ownerId = product.owner.toString();

    // 2. Delete the product
    await Product.findByIdAndDelete(productId);

    // 3. Remove product from owner's product array
    await Owner.findByIdAndUpdate(ownerId, {
      $pull: { products: productId },
    });

    return NextResponse.json({ message: 'Product deleted successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error deleting product:', error);
    return NextResponse.json({ message: 'Server error' }, { status: 500 });
  }
}

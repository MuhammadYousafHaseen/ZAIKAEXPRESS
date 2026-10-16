
import { NextResponse } from "next/server";

import { AuthorizationError, requireShopkeeperWithShop } from "@/src/lib/auth/require-shopkeeper";

export async function GET() {
  try {
    const { userId, shop } = await requireShopkeeperWithShop();

    return NextResponse.json({
      success: true,
      shop: {
        id: String(shop._id),
        ownerId: userId,
        name: shop.name,
        slug: shop.slug,
        description: shop.description,
        logoUrl: shop.logoUrl,
        coverImageUrl: shop.coverImageUrl,
        cuisineTypes: shop.cuisineTypes,
        phone: shop.phone,
        address: shop.address,
        status: shop.status,
        rejectionReason: shop.rejectionReason,
        deliveryRadiusKm: shop.deliveryRadiusKm,
        acceptsOrders: shop.acceptsOrders,
        createdAt: shop.createdAt,
        updatedAt: shop.updatedAt,
      },
    });
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        { success: false, message: error.message },
        { status: error.statusCode },
      );
    }

    console.error("Fetch shop profile error:", error);

    return NextResponse.json(
      { success: false, message: "Unable to load your shop profile." },
      { status: 500 },
    );
  }
}

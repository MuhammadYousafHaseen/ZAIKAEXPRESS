import { connectToDatabase } from "@/src/lib/db/connect";
import Product from "@/src/models/product.model";
import Shop from "@/src/models/shop.model";
import type { ProductCategory } from "@/src/types/domain";

export interface CatalogProduct {
  id: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  imageUrl: string | null;
  price: number;
  preparationTimeMinutes: number;
  ratingAverage: number | null;
  ratingCount: number;
  shopName: string;
}

/**
 * Returns products that are active and available,
 * from approved shops that currently accept orders.
 *
 * Prices are stored directly in whole PKR.
 */
export async function getFeaturedProducts(): Promise<CatalogProduct[]> {
  await connectToDatabase();

  const products = await Product.find({
    status: "active",
    isAvailable: true,
  })
    .select(
      "name slug description category imageUrls price preparationTimeMinutes ratingAverage ratingCount shop",
    )
    .sort({ createdAt: -1 })
    .limit(12)
    .populate({
      path: "shop",
      model: Shop,
      match: {
        status: "approved",
        acceptsOrders: true,
      },
      select: "name",
    })
    .lean();

  return products.flatMap((product) => {
    const shop = product.shop;

    // populate() returns null when the shop doesn't match.
    if (!shop || typeof shop !== "object" || !("name" in shop)) {
      return [];
    }

    return [
      {
        id: String(product._id),
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        imageUrl: product.imageUrls?.[0] ?? null,
        price: product.price,
        preparationTimeMinutes: product.preparationTimeMinutes,
        ratingAverage:
          product.ratingCount > 0 ? product.ratingAverage : null,
        ratingCount: product.ratingCount,
        shopName: String(shop.name),
      },
    ];
  });
}

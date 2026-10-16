
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AuthorizationError,
  requireApprovedShopkeeper,
  requireShopkeeperWithShop,
} from "@/src/lib/auth/require-shopkeeper";
import { connectToDatabase } from "@/src/lib/db/connect";
import Product from "@/src/models/product.model";
import {
  createProductSchema,
} from "@/src/schemas/product.schema";

function errorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      { success: false, message: error.message },
      { status: error.statusCode },
    );
  }

  if (error instanceof ZodError) {
    return NextResponse.json(
      {
        success: false,
        message: "Please check the product details.",
        errors: error.issues,
      },
      { status: 400 },
    );
  }

  if (
    error &&
    typeof error === "object" &&
    "code" in error &&
    error.code === 11000
  ) {
    return NextResponse.json(
      {
        success: false,
        message: "A product with this name already exists in your shop.",
      },
      { status: 409 },
    );
  }

  console.error("Shop products API error:", error);

  return NextResponse.json(
    { success: false, message: "Unable to process the product request." },
    { status: 500 },
  );
}

function slugify(value: string) {
  return value
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 140)
    .replace(/-+$/g, "");
}

export async function GET() {
  try {
    const { shop } = await requireShopkeeperWithShop();
    await connectToDatabase();

    const products = await Product.find({ shop: shop._id })
      .sort({ createdAt: -1 })
      .lean()
      .exec();

    return NextResponse.json({
      success: true,
      products: products.map((product) => ({
        id: String(product._id),
        shopId: String(product.shop),
        name: product.name,
        slug: product.slug,
        description: product.description,
        category: product.category,
        imageUrls: product.imageUrls,
        price: product.price,
        currency: product.currency,
        status: product.status,
        isAvailable: product.isAvailable,
        preparationTimeMinutes: product.preparationTimeMinutes,
        tags: product.tags,
        ratingAverage: product.ratingAverage,
        ratingCount: product.ratingCount,
        createdAt: product.createdAt,
        updatedAt: product.updatedAt,
      })),
    });
  } catch (error) {
    return errorResponse(error);
  }
}

export async function POST(request: Request) {
  try {
    const { shop } = await requireApprovedShopkeeper();

    const body: unknown = await request.json();
    const parsed = createProductSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please check the product details.",
          errors: parsed.error.issues,
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const baseSlug = slugify(parsed.data.name);

    if (!baseSlug) {
      return NextResponse.json(
        { success: false, message: "Product name cannot generate a valid slug." },
        { status: 400 },
      );
    }

    // The unique database index remains the final protection against
    // concurrent requests creating the same slug.
    let slug = baseSlug;
    let suffix = 2;

    while (
      await Product.exists({
        shop: shop._id,
        slug,
      })
    ) {
      slug = `${baseSlug.slice(0, 135)}-${suffix}`;
      suffix += 1;
    }

    const product = await Product.create({
      ...parsed.data,
      shop: shop._id,
      slug,
      currency: "PKR",
      ratingAverage: 0,
      ratingCount: 0,
    });

    return NextResponse.json(
      {
        success: true,
        message: "Product created successfully.",
        product: {
          id: String(product._id),
          name: product.name,
          slug: product.slug,
          description: product.description,
          category: product.category,
          imageUrls: product.imageUrls,
          price: product.price,
          currency: product.currency,
          status: product.status,
          isAvailable: product.isAvailable,
          preparationTimeMinutes: product.preparationTimeMinutes,
          tags: product.tags,
          ratingAverage: product.ratingAverage,
          ratingCount: product.ratingCount,
          createdAt: product.createdAt,
          updatedAt: product.updatedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    return errorResponse(error);
  }
}


import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { ZodError } from "zod";

import {
  AuthorizationError,
  requireApprovedShopkeeper,
} from "@/src/lib/auth/require-shopkeeper";
import { connectToDatabase } from "@/src/lib/db/connect";
import Product from "@/src/models/product.model";
import { updateProductSchema } from "@/src/schemas/product.schema";

type RouteContext = {
  params: Promise<{ productId: string }>;
};

function handleError(error: unknown) {
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

  console.error("Shop product mutation error:", error);

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

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const { shop } = await requireApprovedShopkeeper();
    const { productId } = await context.params;

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 },
      );
    }

    const body: unknown = await request.json();
    const parsed = updateProductSchema.safeParse(body);

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

    const updates = { ...parsed.data };

    // Keep the slug in sync when the product name changes.
    if (updates.name) {
      const baseSlug = slugify(updates.name);

      if (!baseSlug) {
        return NextResponse.json(
          { success: false, message: "Product name cannot generate a valid slug." },
          { status: 400 },
        );
      }

      let slug = baseSlug;
      let suffix = 2;

      while (
        await Product.exists({
          shop: shop._id,
          slug,
          _id: { $ne: productId },
        })
      ) {
        slug = `${baseSlug.slice(0, 135)}-${suffix}`;
        suffix += 1;
      }

      Object.assign(updates, { slug });
    }

    const product = await Product.findOneAndUpdate(
      { _id: productId, shop: shop._id },
      { $set: updates },
      { new: true, runValidators: true },
    )
      .lean()
      .exec();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found in your shop.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product updated successfully.",
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
    });
  } catch (error) {
    return handleError(error);
  }
}

export async function DELETE(_request: Request, context: RouteContext) {
  try {
    const { shop } = await requireApprovedShopkeeper();
    const { productId } = await context.params;

    if (!mongoose.isValidObjectId(productId)) {
      return NextResponse.json(
        { success: false, message: "Invalid product ID." },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const product = await Product.findOneAndDelete({
      _id: productId,
      shop: shop._id,
    }).exec();

    if (!product) {
      return NextResponse.json(
        {
          success: false,
          message: "Product not found in your shop.",
        },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Product deleted successfully.",
      productId: String(product._id),
    });
  } catch (error) {
    return handleError(error);
  }
}

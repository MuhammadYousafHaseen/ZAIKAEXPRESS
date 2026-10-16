
import { NextResponse } from "next/server";
import { Types } from "mongoose";

import {
  AuthorizationError,
  requireActiveUser,
} from "@/src/lib/auth/require-shopkeeper";
import { connectToDatabase } from "@/src/lib/db/connect";
import Shop from "@/src/models/shop.model";
import User from "@/src/models/user.model";
import { shopApplicationSchema } from "@/src/schemas/shop.schema";

function createSlug(name: string, userId: string) {
  const base = name
    .normalize("NFKD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80)
    .replace(/-+$/g, "");

  const safeBase = base || "shop";
  const userSuffix = userId.slice(-8).toLowerCase();

  return `${safeBase}-${userSuffix}`;
}

function getErrorMessage(error: unknown) {
  if (
    typeof error === "object" &&
    error !== null &&
    "code" in error &&
    error.code === 11000
  ) {
    return "A shop already exists for this account or the shop slug is already in use.";
  }

  return "Unable to submit the shop application.";
}

export async function POST(request: Request) {
  let createdShopId: Types.ObjectId | null = null;

  try {
    const { userId } = await requireActiveUser();

    let body: unknown;

    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          success: false,
          message: "Invalid JSON request body.",
        },
        { status: 400 },
      );
    }

    const parsed = shopApplicationSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        {
          success: false,
          message: "Please correct the submitted shop details.",
          errors: parsed.error.flatten().fieldErrors,
        },
        { status: 400 },
      );
    }

    await connectToDatabase();

    const existingShop = await Shop.findOne({ owner: userId })
      .select("_id status")
      .lean()
      .exec();

    if (existingShop) {
      return NextResponse.json(
        {
          success: false,
          message: "You already have a shop application or shop.",
          shopStatus: existingShop.status,
        },
        { status: 409 },
      );
    }

    const existingUser = await User.findById(userId)
      .select("_id roles status")
      .lean()
      .exec();

    if (!existingUser || existingUser.status !== "active") {
      throw new AuthorizationError(
        403,
        "Your account is not active.",
      );
    }

    const slug = createSlug(parsed.data.name, userId);
    const address = parsed.data.address;

    const shop = await Shop.create({
      owner: userId,
      name: parsed.data.name,
      slug,
      description: parsed.data.description,
      cuisineTypes: parsed.data.cuisineTypes,
      phone: parsed.data.phone,

      // Map the form/schema fields to the Mongoose address fields.
      address: {
        addressLine1: address.line1,
        addressLine2: address.line2,
        city: address.city,
        state: address.state,
        postalCode: address.postalCode,
        country: address.country,
      },

      deliveryRadiusKm: parsed.data.deliveryRadiusKm,
      status: "pending",
      acceptsOrders: false,
    });

    createdShopId = shop._id;

    const roleUpdate = await User.updateOne(
      {
        _id: userId,
        status: "active",
      },
      {
        $addToSet: { roles: "shopkeeper" },
      },
    ).exec();

    if (roleUpdate.matchedCount !== 1) {
      throw new AuthorizationError(
        403,
        "Your account is not active.",
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your shop application has been submitted for review.",
        shop: {
          id: String(shop._id),
          name: shop.name,
          slug: shop.slug,
          status: shop.status,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    if (error instanceof AuthorizationError) {
      return NextResponse.json(
        {
          success: false,
          message: error.message,
        },
        { status: error.statusCode },
      );
    }

    // Roll back the shop if role assignment failed after creation.
    if (createdShopId) {
      try {
        await Shop.deleteOne({ _id: createdShopId }).exec();
      } catch {
        console.error(
          "Failed to roll back incomplete shop application.",
        );
      }
    }

    console.error("Shop application error:", error);

    const duplicateKeyError =
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000;

    return NextResponse.json(
      {
        success: false,
        message: duplicateKeyError
          ? getErrorMessage(error)
          : "Unable to submit the shop application. Please try again.",
      },
      { status: duplicateKeyError ? 409 : 500 },
    );
  }
}

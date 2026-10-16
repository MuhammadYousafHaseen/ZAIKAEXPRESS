
import "server-only";

import { auth } from "@/src/auth";
import { connectToDatabase } from "@/src/lib/db/connect";
import Shop from "@/src/models/shop.model";
import type { IShop } from "@/src/models/shop.model";

export class AuthorizationError extends Error {
  constructor(
    public readonly statusCode: 401 | 403 | 404,
    message: string,
  ) {
    super(message);
    this.name = "AuthorizationError";
  }
}

/**
 * Requires an authenticated user with an active account.
 */
export async function requireActiveUser() {
  const session = await auth();

  if (!session?.user?.id) {
    throw new AuthorizationError(
      401,
      "Authentication required.",
    );
  }

  if (session.user.status !== "active") {
    throw new AuthorizationError(
      403,
      "Your account is not active.",
    );
  }

  return {
    userId: session.user.id,
    session,
  };
}

/**
 * Requires the shopkeeper role, but does not require a shop to exist.
 * Useful for authorization checks that precede shop lookup.
 */
export async function requireShopkeeperUser() {
  const result = await requireActiveUser();

  if (!result.session.user.roles.includes("shopkeeper")) {
    throw new AuthorizationError(
      403,
      "Shopkeeper access is required.",
    );
  }

  return result;
}

/**
 * Requires an active shopkeeper account and an associated shop.
 */
export async function requireShopkeeperWithShop(): Promise<{
  userId: string;
  shop: IShop;
}> {
  const { userId } = await requireShopkeeperUser();

  await connectToDatabase();

  const shop = await Shop.findOne({
    owner: userId,
  }).exec();

  if (!shop) {
    throw new AuthorizationError(
      404,
      "No shop is associated with this account.",
    );
  }

  return {
    userId,
    shop,
  };
}

/**
 * Requires the shop to be approved.
 * A shop can still manage its products when it is not accepting orders.
 */
export async function requireApprovedShopkeeper(): Promise<{
  userId: string;
  shop: IShop;
}> {
  const result = await requireShopkeeperWithShop();

  if (result.shop.status !== "approved") {
    throw new AuthorizationError(
      403,
      "Your shop must be approved before you can perform this operation.",
    );
  }

  return result;
}



import { NextResponse } from "next/server";

// Add this function inside require-shopkeeper.ts.
// Keep the existing imports and functions above.

export function authorizationErrorResponse(error: unknown) {
  if (error instanceof AuthorizationError) {
    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      { status: error.statusCode },
    );
  }

  return null;
}

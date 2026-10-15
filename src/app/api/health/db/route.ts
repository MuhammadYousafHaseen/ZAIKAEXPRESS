import { NextResponse } from "next/server";

import { connectToDatabase } from "@/src/lib/db/connect";


export async function GET() {
  try {
    await connectToDatabase();

    return NextResponse.json({
      success: true,
      database: "connected",
    });
  } catch (error) {
    console.error(
      "Database health check failed:",
      error instanceof Error ? error.message : "Unknown database error",
    );

    return NextResponse.json(
      {
        success: false,
        database: "disconnected",
      },
      { status: 503 },
    );
  }
}
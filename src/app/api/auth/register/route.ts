
import { NextResponse } from "next/server";

import { registerUser } from "@/src/services/auth/register.service";

export async function POST(request: Request) {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        message: "Invalid JSON request body.",
      },
      { status: 400 }
    );
  }

  try {
    const result = await registerUser(body);

    if (!result.success) {
      if (result.reason === "invalid_input") {
        return NextResponse.json(
          {
            success: false,
            message: "Please check your registration details.",
          },
          { status: 400 }
        );
      }

      return NextResponse.json(
        {
          success: false,
          message: "An account with this email already exists.",
        },
        { status: 409 }
      );
    }

    return NextResponse.json(
      {
        success: true,
        message: "Your account has been created successfully.",
        user: result.user,
        welcomeEmailSent: result.welcomeEmailSent,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Registration request failed:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Registration could not be completed. Please try again.",
      },
      { status: 500 }
    );
  }
}


import { hash } from "bcryptjs";

import { connectToDatabase } from "@/src/lib/db/connect";
import { sendWelcomeEmail } from "@/src/lib/email/send-welcome-email";
import { registerSchema } from "@/src/schemas/auth.schema";
import User from "@/src/models/user.model";

type RegisterResult =
  | {
      success: true;
      user: {
        id: string;
        name: string;
        email: string;
        roles: string[];
      };
      welcomeEmailSent: boolean;
    }
  | {
      success: false;
      reason: "invalid_input" | "email_exists";
    };

export async function registerUser(
  input: unknown
): Promise<RegisterResult> {
  const parsed = registerSchema.safeParse(input);

  if (!parsed.success) {
    return {
      success: false,
      reason: "invalid_input",
    };
  }

  const { name, email, password, phone } = parsed.data;

  await connectToDatabase();

  const existingUser = await User.exists({ email });

  if (existingUser) {
    return {
      success: false,
      reason: "email_exists",
    };
  }

  const passwordHash = await hash(password, 12);

  let user;

  try {
    user = await User.create({
      name,
      email,
      passwordHash,
      ...(phone ? { phone } : {}),
      roles: ["customer"],
      status: "active",
      welcomeEmailStatus: "pending",
    });
  } catch (error: unknown) {
    // Handles two simultaneous registrations for the same email.
    if (
      typeof error === "object" &&
      error !== null &&
      "code" in error &&
      error.code === 11000
    ) {
      return {
        success: false,
        reason: "email_exists",
      };
    }

    throw error;
  }

  // The account already exists at this point.
  // Email failure must not undo a successful registration.
  const welcomeEmailSent = await sendWelcomeEmail({
    name: user.name,
    email: user.email,
  });

  try {
    await User.updateOne(
      { _id: user._id },
      {
        $set: {
          welcomeEmailStatus: welcomeEmailSent ? "sent" : "failed",
          welcomeEmailLastAttemptAt: new Date(),
        },
      }
    );
  } catch (error) {
    console.error("Could not update welcome email status:", error);
  }

  return {
    success: true,
    user: {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      roles: user.roles,
    },
    welcomeEmailSent,
  };
}

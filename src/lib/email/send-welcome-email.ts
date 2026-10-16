
import nodemailer from "nodemailer";

import { env } from "@/src/lib/env";

interface SendWelcomeEmailInput {
  name: string;
  email: string;
}

export async function sendWelcomeEmail({
  name,
  email,
}: SendWelcomeEmailInput): Promise<boolean> {
  if (!env.SMTP_HOST || !env.SMTP_PORT || !env.SMTP_FROM) {
    console.warn("Welcome email skipped: SMTP is not configured.");
    return false;
  }

  const port = Number(env.SMTP_PORT);

  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    console.error("Welcome email failed: invalid SMTP port.");
    return false;
  }

  try {
    const transporter = nodemailer.createTransport({
      host: env.SMTP_HOST,
      port,
      secure: port === 465,
      ...(env.SMTP_USER && env.SMTP_PASS
        ? {
            auth: {
              user: env.SMTP_USER,
              pass: env.SMTP_PASS,
            },
          }
        : {}),
    });

    await transporter.sendMail({
      from: env.SMTP_FROM,
      to: email,
      subject: "Welcome to ZaikaExpress!",
      text: `Hi ${name},\n\nWelcome to ZaikaExpress! Your account has been created successfully.\n\nWe're glad to have you with us.\n\nThe ZaikaExpress Team`,
      html: `
        <div style="font-family: Arial, sans-serif; line-height: 1.6;">
          <h2>Welcome to ZaikaExpress!</h2>
          <p>Hi ${escapeHtml(name)},</p>
          <p>Your account has been created successfully.</p>
          <p>We're glad to have you with us.</p>
          <p>The ZaikaExpress Team</p>
        </div>
      `,
    });

    return true;
  } catch (error) {
    console.error("Welcome email delivery failed:", error);
    return false;
  }
}

function escapeHtml(value: string): string {
  return value.replace(/[&<>"']/g, (character) => {
    const entities: Record<string, string> = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };

    return entities[character] ?? character;
  });
}

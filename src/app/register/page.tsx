
"use client";

import { useState, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { AuthLayout } from "@/src/components/auth/auth-layout";
import { Button } from "@/src/components/ui/button";
import { FormField } from "@/src/components/ui/form-field";
import { Input } from "@/src/components/ui/input";
import { PasswordInput } from "@/src/components/ui/password-input";

type RegisterResponse = {
  success?: boolean;
  message?: string;
};

export default function RegisterPage() {
  const router = useRouter();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const form = event.currentTarget;
    const formData = new FormData(form);

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: String(formData.get("name") ?? "").trim(),
          email: String(formData.get("email") ?? "").trim(),
          password: String(formData.get("password") ?? ""),
          phone:
            String(formData.get("phone") ?? "").trim() || undefined,
        }),
      });

      const payload = (await response.json().catch(() => null)) as
        | RegisterResponse
        | null;

      if (!response.ok || !payload?.success) {
        if (response.status === 409) {
          setError("An account with this email already exists.");
        } else if (response.status === 400) {
          setError(
            payload?.message ??
              "Please check your details. Your password must contain at least 10 characters."
          );
        } else {
          setError(
            payload?.message ??
              "We couldn't create your account. Please try again."
          );
        }

        return;
      }

      // Registration succeeded. Send the user to the login page.
      router.replace("/login?registered=1");
    } catch {
      setError(
        "Unable to connect. Please check your internet connection and try again."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthLayout
      title="Create your account"
      description="Join ZaikaExpress to discover food and place orders."
      footer={
        <>
          Already have an account?{" "}
          <Link
            href="/login"
            className="font-medium text-primary underline-offset-4 hover:underline"
          >
            Sign in
          </Link>
        </>
      }
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <p
            role="alert"
            className="rounded-lg border border-red-200 bg-red-50 p-3 text-sm text-red-700 dark:border-red-900 dark:bg-red-950/40 dark:text-red-300"
          >
            {error}
          </p>
        )}

        <FormField label="Full name" htmlFor="name" required>
          <Input
            id="name"
            name="name"
            placeholder="Enter your full name"
            autoComplete="name"
            minLength={2}
            maxLength={80}
            required
            disabled={isSubmitting}
          />
        </FormField>

        <FormField label="Email address" htmlFor="email" required>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="you@example.com"
            autoComplete="email"
            maxLength={254}
            required
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Phone number"
          htmlFor="phone"
          hint="Optional"
        >
          <Input
            id="phone"
            name="phone"
            type="tel"
            placeholder="Enter your phone number"
            autoComplete="tel"
            maxLength={30}
            disabled={isSubmitting}
          />
        </FormField>

        <FormField
          label="Password"
          htmlFor="password"
          hint="Use at least 10 characters."
          required
        >
          <PasswordInput
            id="password"
            name="password"
            placeholder="Create a strong password"
            autoComplete="new-password"
            minLength={10}
            maxLength={128}
            required
            disabled={isSubmitting}
          />
        </FormField>

        <Button
          type="submit"
          size="lg"
          className="w-full"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Create account"}
        </Button>

        <p className="text-center text-xs leading-5 text-muted-foreground">
          By creating an account, you agree to use ZaikaExpress responsibly.
        </p>
      </form>
    </AuthLayout>
  );
}

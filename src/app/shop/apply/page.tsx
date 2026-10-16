
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ShopApplicationForm } from "@/src/components/shop/shop-application-form";
import { ThemeToggle } from "@/src/components/theme-toggle";

async function ShopApplyContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-8 flex items-center justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-primary">
            ZaikaExpress Partner Program
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Grow your food business with ZaikaExpress.
          </p>
        </div>
        <ThemeToggle />
      </div>

      <h1 className="text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
        Register your shop
      </h1>

      <p className="mt-4 leading-7 text-muted-foreground">
        Tell us about your shop, the food you serve, and your
        delivery area. Your application will be reviewed before
        your shop can start accepting orders.
      </p>

      <div className="mt-8">
        <ShopApplicationForm />
      </div>
    </div>
  );
}

function ShopApplyFallback() {
  return (
    <div
      className="mx-auto max-w-3xl animate-pulse"
      aria-busy="true"
      aria-label="Loading shop application"
    >
      <div className="mb-8 flex justify-between">
        <div className="h-10 w-56 rounded bg-muted" />
        <div className="size-10 rounded-lg bg-muted" />
      </div>
      <div className="h-9 max-w-md rounded bg-muted" />
      <div className="mt-4 h-12 max-w-2xl rounded bg-muted" />
      <div className="mt-8 h-96 rounded-2xl border border-border bg-card" />
    </div>
  );
}

export default function ShopApplyPage() {
  return (
    <main className="min-h-screen bg-background py-10 text-foreground transition-colors sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ShopApplyFallback />}>
          <ShopApplyContent />
        </Suspense>
      </div>
    </main>
  );
}

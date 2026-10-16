
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ShopApplicationForm } from "@/src/components/shop/shop-application-form";

async function ShopApplyContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-sm font-medium text-primary">
        ZaikaExpress Partner Program
      </p>

      <h1 className="mt-2 text-3xl font-bold tracking-tight text-foreground sm:text-4xl">
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
      <div className="h-4 w-48 rounded bg-muted" />
      <div className="mt-4 h-9 max-w-md rounded bg-muted" />
      <div className="mt-4 h-12 max-w-2xl rounded bg-muted" />
      <div className="mt-8 h-96 rounded-2xl border border-border bg-card" />
    </div>
  );
}

export default function ShopApplyPage() {
  return (
    <main className="min-h-screen bg-background py-10 sm:py-16">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Suspense fallback={<ShopApplyFallback />}>
          <ShopApplyContent />
        </Suspense>
      </div>
    </main>
  );
}

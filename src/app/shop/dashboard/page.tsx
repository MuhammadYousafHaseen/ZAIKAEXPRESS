
import { Suspense } from "react";
import { redirect } from "next/navigation";

import { auth } from "@/src/auth";
import { ShopDashboard } from "@/src/components/shop/shop-dashboard";

async function ShopDashboardContent() {
  const session = await auth();

  if (!session?.user?.id) {
    redirect("/login");
  }

  if (session.user.status !== "active") {
    redirect("/login");
  }

  return <ShopDashboard />;
}

function DashboardFallback() {
  return (
    <main className="min-h-screen bg-background p-6 text-foreground">
      <div
        className="mx-auto max-w-7xl animate-pulse space-y-6"
        aria-busy="true"
        aria-label="Loading shop dashboard"
      >
        <div className="flex items-center justify-between">
          <div className="h-8 w-64 rounded-lg bg-muted" />
          <div className="size-10 rounded-lg bg-muted" />
        </div>

        <div className="h-32 rounded-2xl border border-border bg-card" />

        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-2xl border border-border bg-card" />
          <div className="h-28 rounded-2xl border border-border bg-card" />
          <div className="h-28 rounded-2xl border border-border bg-card" />
        </div>
      </div>
    </main>
  );
}

export default function ShopDashboardPage() {
  return (
    <Suspense fallback={<DashboardFallback />}>
      <ShopDashboardContent />
    </Suspense>
  );
}

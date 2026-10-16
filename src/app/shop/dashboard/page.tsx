
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
    <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
      <div className="mx-auto max-w-7xl animate-pulse space-y-6">
        <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
        <div className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800" />
        <div className="grid gap-4 md:grid-cols-3">
          <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
          <div className="h-28 rounded-2xl bg-slate-200 dark:bg-slate-800" />
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

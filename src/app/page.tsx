
import Link from "next/link";
import { Suspense } from "react";
import { connection } from "next/server";

import { SiteHeader } from "@/src/components/site/site-header";
import { HomeHero } from "@/src/components/site/home-hero";
import { HomeCatalog } from "@/src/components/site/home-catalog";
import { getFeaturedProducts } from "@/src/services/catalog.service";

async function FeaturedFoodContent() {
  await connection();

  const products = await getFeaturedProducts();

  return <HomeCatalog products={products} />;
}

function FeaturedFoodFallback() {
  return (
    <section
      id="popular-food"
      className="scroll-mt-32 border-y border-border/70 bg-secondary/35 py-16 sm:py-20"
      aria-busy="true"
      aria-label="Loading food catalog"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
          Handpicked favourites
        </p>

        <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Popular on ZaikaExpress
        </h2>

        <p className="mt-3 text-sm text-muted-foreground">
          Loading available meals...
        </p>
      </div>
    </section>
  );
}

export default function HomePage() {
  return (
    <>
      <SiteHeader />

      <main className="flex-1">
        <HomeHero />

        <Suspense fallback={<FeaturedFoodFallback />}>
          <FeaturedFoodContent />
        </Suspense>

        <section className="px-4 py-16 sm:px-6 lg:px-8">
          <div className="mx-auto flex max-w-5xl flex-col items-center rounded-3xl border border-primary/20 bg-linear-to-br from-secondary to-card px-5 py-10 text-center sm:px-10 sm:py-14">
            <span className="text-4xl" role="img" aria-label="Food">
              🥘
            </span>

            <h2 className="mt-4 text-2xl font-extrabold tracking-tight text-foreground sm:text-3xl">
              Your next favourite meal is waiting.
            </h2>

            <p className="mt-3 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              Join ZaikaExpress and get ready to discover meals and local
              food businesses in one convenient place.
            </p>

            <Link
              href="/register"
              className="mt-6 inline-flex min-h-12 items-center justify-center rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground transition-opacity hover:opacity-90"
            >
              Create your account
            </Link>
          </div>
        </section>
      </main>

      <footer className="border-t border-border bg-card">
        <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-7 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <Link
            href="/"
            className="font-extrabold tracking-tight text-foreground"
          >
            Zaika<span className="text-primary">Express</span>
          </Link>

          <p className="text-sm text-muted-foreground">
            Good food. Easy ordering. More reasons to enjoy.
          </p>

          <div className="flex items-center gap-4 text-sm text-muted-foreground">
            <Link href="/login" className="hover:text-primary">
              Sign in
            </Link>
            <Link href="/register" className="hover:text-primary">
              Register
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}

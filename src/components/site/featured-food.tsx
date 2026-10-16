"use client";

import { useMemo } from "react";
import Link from "next/link";
import { ArrowRight, Clock3, Star } from "lucide-react";

import { formatPrice } from "@/src/lib/format-price";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
} from "@/src/types/domain";
import type { CatalogProduct } from "@/src/services/catalog.service";

interface FeaturedFoodProps {
  products: CatalogProduct[];
  selectedCategory: ProductCategory | "All";
  onSelectCategory: (category: ProductCategory | "All") => void;
}

const categoryStyles: Record<
  ProductCategory,
  { emoji: string; color: string }
> = {
  Biryani: {
    emoji: "🍛",
    color: "bg-amber-100 dark:bg-amber-950/40",
  },
  Burgers: {
    emoji: "🍔",
    color: "bg-orange-100 dark:bg-orange-950/40",
  },
  Pizza: {
    emoji: "🍕",
    color: "bg-rose-100 dark:bg-rose-950/40",
  },
  BBQ: {
    emoji: "🍗",
    color: "bg-emerald-100 dark:bg-emerald-950/40",
  },
  Chicken: {
    emoji: "🍗",
    color: "bg-amber-100 dark:bg-amber-950/40",
  },
  Seafood: {
    emoji: "🐟",
    color: "bg-sky-100 dark:bg-sky-950/40",
  },
  "Fast Food": {
    emoji: "🍟",
    color: "bg-orange-100 dark:bg-orange-950/40",
  },
  "Traditional Food": {
    emoji: "🥘",
    color: "bg-amber-100 dark:bg-amber-950/40",
  },
  Chinese: {
    emoji: "🍜",
    color: "bg-rose-100 dark:bg-rose-950/40",
  },
  Desserts: {
    emoji: "🍰",
    color: "bg-pink-100 dark:bg-pink-950/40",
  },
  Drinks: {
    emoji: "🥤",
    color: "bg-sky-100 dark:bg-sky-950/40",
  },
};

export function FeaturedFood({
  products,
  selectedCategory,
  onSelectCategory,
}: FeaturedFoodProps) {
  const filteredProducts = useMemo(() => {
    if (selectedCategory === "All") {
      return products;
    }

    return products.filter(
      (product) => product.category === selectedCategory,
    );
  }, [products, selectedCategory]);

  return (
    <section
      id="popular-food"
      className="scroll-mt-32 border-y border-border/70 bg-secondary/35 py-16 sm:py-20"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Handpicked favourites
            </p>

            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Popular on ZaikaExpress
            </h2>

            <p className="mt-2 text-sm leading-6 text-muted-foreground sm:text-base">
              Discover meals available from local food businesses.
            </p>
          </div>

          <Link
            href="/login"
            className="inline-flex w-fit items-center gap-2 rounded-lg border border-border bg-card px-4 py-2.5 text-sm font-semibold text-card-foreground transition-colors hover:bg-accent"
          >
            Start exploring
            <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>

        <div
          className="mb-6 flex flex-wrap gap-2"
          aria-label="Filter food by category"
        >
          <button
            type="button"
            onClick={() => onSelectCategory("All")}
            aria-pressed={selectedCategory === "All"}
            className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              selectedCategory === "All"
                ? "border-primary bg-primary text-primary-foreground"
                : "border-border bg-card text-card-foreground hover:bg-accent"
            }`}
          >
            All
          </button>

          {PRODUCT_CATEGORIES.map((category) => (
            <button
              key={category}
              type="button"
              onClick={() => onSelectCategory(category)}
              aria-pressed={selectedCategory === category}
              className={`rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
                selectedCategory === category
                  ? "border-primary bg-primary text-primary-foreground"
                  : "border-border bg-card text-card-foreground hover:bg-accent"
              }`}
            >
              {category}
            </button>
          ))}
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
            {filteredProducts.map((food) => {
              const style = categoryStyles[food.category];

              return (
                <article
                  key={food.id}
                  className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <div
                    className={`relative flex h-44 items-center justify-center overflow-hidden ${style.color}`}
                  >
                    {food.imageUrl ? (
                      <div
                        role="img"
                        aria-label={food.name}
                        className="absolute inset-0 bg-cover bg-center transition-transform duration-200 hover:scale-105"
                        style={{
                          backgroundImage: `url("${food.imageUrl.replace(/["\\\n\r]/g, "")}")`,
                        }}
                      />
                    ) : (
                      <span
                        className="select-none text-7xl transition-transform duration-200 hover:scale-110"
                        role="img"
                        aria-label={food.name}
                      >
                        {style.emoji}
                      </span>
                    )}

                    <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-card/90 px-2.5 py-1 text-xs font-semibold text-card-foreground backdrop-blur">
                      {food.ratingCount > 0 ? "Popular" : "New"}
                    </span>

                    <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-bold text-card-foreground">
                      {food.ratingCount > 0 &&
                      food.ratingAverage !== null ? (
                        <>
                          <Star
                            size={13}
                            className="fill-amber-400 text-amber-500"
                            aria-hidden="true"
                          />
                          {food.ratingAverage.toFixed(1)}
                        </>
                      ) : (
                        "No reviews"
                      )}
                    </span>
                  </div>

                  <div className="p-4">
                    <p className="text-xs font-medium text-muted-foreground">
                      {food.category} · {food.shopName}
                    </p>

                    <h3 className="mt-2 text-lg font-bold text-card-foreground">
                      {food.name}
                    </h3>

                    <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
                      {food.description}
                    </p>

                    <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                      <Clock3 size={14} aria-hidden="true" />
                      {food.preparationTimeMinutes > 0
                        ? `${food.preparationTimeMinutes} min preparation`
                        : "Preparation time varies"}
                    </div>

                    <div className="mt-4 flex items-center justify-between gap-3 border-t border-border pt-4">
                      <span className="font-extrabold text-foreground">
                        {formatPrice(food.price)}
                      </span>

                      <Link
                        href="/login"
                        aria-label={`Sign in to order ${food.name}`}
                        className="inline-flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-opacity hover:opacity-90"
                      >
                        <ArrowRight size={18} aria-hidden="true" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="rounded-2xl border border-border bg-card px-5 py-12 text-center">
            <p className="text-lg font-bold text-foreground">
              {products.length === 0
                ? "No meals available just yet"
                : `No ${
                    selectedCategory === "All"
                      ? ""
                      : `${selectedCategory.toLowerCase()} `
                  }meals available right now`}
            </p>

            <p className="mt-2 text-sm leading-6 text-muted-foreground">
              {products.length === 0
                ? "Meals from approved food businesses will appear here when they are available."
                : "Try another category to explore the available menu."}
            </p>

            {selectedCategory !== "All" && (
              <button
                type="button"
                onClick={() => onSelectCategory("All")}
                className="mt-5 rounded-xl bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90"
              >
                View all meals
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}

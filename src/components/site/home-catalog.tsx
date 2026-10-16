"use client";

import { useState } from "react";

import { FoodCategories } from "@/src/components/site/food-categories";
import { FeaturedFood } from "@/src/components/site/featured-food";
import type { CatalogProduct } from "@/src/services/catalog.service";
import type { ProductCategory } from "@/src/types/domain";

interface HomeCatalogProps {
  products: CatalogProduct[];
}

export function HomeCatalog({ products }: HomeCatalogProps) {
  const [selectedCategory, setSelectedCategory] =
    useState<ProductCategory | "All">("All");

  return (
    <>
      <FoodCategories
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />

      <FeaturedFood
        products={products}
        selectedCategory={selectedCategory}
        onSelectCategory={setSelectedCategory}
      />
    </>
  );
}
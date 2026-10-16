
import Link from "next/link";
import {
  Beef,
  Coffee,
  Drumstick,
  Fish,
  Pizza,
  Sandwich,
  Soup,
  Utensils,
} from "lucide-react";

const categories = [
  {
    name: "Biryani",
    description: "Desi rice favourites",
    icon: Soup,
    color: "bg-amber-100 text-amber-800 dark:bg-amber-950/50 dark:text-amber-200",
  },
  {
    name: "Burgers",
    description: "Juicy and satisfying",
    icon: Sandwich,
    color: "bg-orange-100 text-orange-800 dark:bg-orange-950/50 dark:text-orange-200",
  },
  {
    name: "Pizza",
    description: "Cheesy goodness",
    icon: Pizza,
    color: "bg-rose-100 text-rose-800 dark:bg-rose-950/50 dark:text-rose-200",
  },
  {
    name: "BBQ",
    description: "Smoky grilled bites",
    icon: Beef,
    color: "bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200",
  },
  {
    name: "Chicken",
    description: "Crispy and tender",
    icon: Drumstick,
    color: "bg-sky-100 text-sky-800 dark:bg-sky-950/50 dark:text-sky-200",
  },
  {
    name: "Seafood",
    description: "Fresh from the sea",
    icon: Fish,
    color: "bg-cyan-100 text-cyan-800 dark:bg-cyan-950/50 dark:text-cyan-200",
  },
  {
    name: "Fast Food",
    description: "Quick bites, big taste",
    icon: Utensils,
    color: "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-200",
  },
  {
    name: "Drinks",
    description: "Sip and refresh",
    icon: Coffee,
    color: "bg-fuchsia-100 text-fuchsia-800 dark:bg-fuchsia-950/50 dark:text-fuchsia-200",
  },
];

export function FoodCategories() {
  return (
    <section id="categories" className="scroll-mt-32 py-16 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.16em] text-primary">
              Find your flavour
            </p>
            <h2 className="mt-2 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
              Explore food categories
            </h2>
            <p className="mt-2 max-w-xl text-sm leading-6 text-muted-foreground sm:text-base">
              From comforting desi dishes to your favourite fast food,
              there is something for every craving.
            </p>
          </div>

          <Link
            href="#popular-food"
            className="inline-flex w-fit items-center gap-2 text-sm font-semibold text-primary hover:underline"
          >
            Explore popular food
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 sm:gap-4 lg:grid-cols-4">
          {categories.map((category) => {
            const Icon = category.icon;

            return (
              <Link
                key={category.name}
                href="#popular-food"
                className="group flex min-h-28 items-center gap-3 rounded-2xl border border-border bg-card p-3 transition-all hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-md sm:min-h-32 sm:gap-4 sm:p-5"
              >
                <span
                  className={`flex size-12 shrink-0 items-center justify-center rounded-xl sm:size-14 ${category.color}`}
                >
                  <Icon size={25} strokeWidth={1.8} aria-hidden="true" />
                </span>

                <span className="min-w-0">
                  <span className="block font-bold text-card-foreground">
                    {category.name}
                  </span>
                  <span className="mt-1 block text-xs leading-5 text-muted-foreground sm:text-sm">
                    {category.description}
                  </span>
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}

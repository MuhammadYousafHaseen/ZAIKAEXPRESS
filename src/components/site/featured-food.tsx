
import Link from "next/link";
import { ArrowRight, Clock3, Star } from "lucide-react";

const featuredFoods = [
  {
    id: "chicken-biryani",
    name: "Chicken Biryani",
    category: "Pakistani · Rice",
    description: "Aromatic rice with classic desi spices.",
    price: 450,
    emoji: "🍛",
    rating: "4.8",
    time: "25–35 min",
    color: "bg-amber-100 dark:bg-amber-950/40",
  },
  {
    id: "classic-burger",
    name: "Classic Beef Burger",
    category: "Burgers · Fast food",
    description: "A juicy burger with fresh, crisp toppings.",
    price: 650,
    emoji: "🍔",
    rating: "4.7",
    time: "20–30 min",
    color: "bg-orange-100 dark:bg-orange-950/40",
  },
  {
    id: "cheese-pizza",
    name: "Cheese Pizza",
    category: "Italian · Pizza",
    description: "Golden crust topped with melted cheese.",
    price: 850,
    emoji: "🍕",
    rating: "4.9",
    time: "25–40 min",
    color: "bg-rose-100 dark:bg-rose-950/40",
  },
  {
    id: "grilled-chicken",
    name: "Grilled Chicken",
    category: "BBQ · Chicken",
    description: "Smoky, flavourful chicken grilled to perfection.",
    price: 750,
    emoji: "🍗",
    rating: "4.6",
    time: "30–40 min",
    color: "bg-emerald-100 dark:bg-emerald-950/40",
  },
];

function formatPrice(price: number) {
  return new Intl.NumberFormat("en-PK", {
    style: "currency",
    currency: "PKR",
    maximumFractionDigits: 0,
  }).format(price);
}

export function FeaturedFood() {
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
              A preview of the delicious meals you will be able to discover.
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

        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {featuredFoods.map((food) => (
            <article
              key={food.id}
              className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div
                className={`relative flex h-44 items-center justify-center ${food.color}`}
              >
                <span
                  className="select-none text-7xl transition-transform duration-200 hover:scale-110"
                  role="img"
                  aria-label={food.name}
                >
                  {food.emoji}
                </span>

                <span className="absolute left-3 top-3 rounded-full border border-border/60 bg-card/90 px-2.5 py-1 text-xs font-semibold text-card-foreground backdrop-blur">
                  Popular
                </span>

                <span className="absolute right-3 top-3 flex items-center gap-1 rounded-full bg-card/90 px-2 py-1 text-xs font-bold text-card-foreground">
                  <Star
                    size={13}
                    className="fill-amber-400 text-amber-500"
                    aria-hidden="true"
                  />
                  {food.rating}
                </span>
              </div>

              <div className="p-4">
                <p className="text-xs font-medium text-muted-foreground">
                  {food.category}
                </p>

                <h3 className="mt-2 text-lg font-bold text-card-foreground">
                  {food.name}
                </h3>

                <p className="mt-1 min-h-10 text-sm leading-5 text-muted-foreground">
                  {food.description}
                </p>

                <div className="mt-4 flex items-center gap-1.5 text-xs text-muted-foreground">
                  <Clock3 size={14} aria-hidden="true" />
                  {food.time}
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
          ))}
        </div>

        <p className="mt-5 text-xs leading-5 text-muted-foreground">
          Sample menu and prices for design preview only. Availability and
          actual prices will come from the live menu.
        </p>
      </div>
    </section>
  );
}


import Link from "next/link";
import {
  ArrowDown,
  ArrowRight,
  CheckCircle2,
  Clock3,
  MapPin,
  Utensils,
} from "lucide-react";

export function HomeHero() {
  return (
    <section className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-secondary via-background to-background" />
      <div className="absolute -right-24 -top-24 -z-10 size-80 rounded-full bg-primary/10 blur-3xl sm:size-112" />
      <div className="absolute -bottom-32 left-0 -z-10 size-72 rounded-full bg-sky-400/10 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-12 px-4 py-16 sm:px-6 sm:py-20 lg:grid-cols-2 lg:gap-16 lg:px-8 lg:py-24">
        <div>
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary/20 bg-background/80 px-3.5 py-2 text-sm font-medium text-primary shadow-sm">
            <span className="size-2 rounded-full bg-emerald-500" />
            Your next favourite meal starts here
          </div>

          <h1 className="max-w-2xl text-4xl font-extrabold leading-[1.12] tracking-tight text-foreground sm:text-5xl lg:text-6xl">
            Cravings meet
            <span className="mt-1 block text-primary">convenience.</span>
          </h1>

          <p className="mt-6 max-w-xl text-base leading-7 text-muted-foreground sm:text-lg sm:leading-8">
            Discover delicious meals, explore local favourites, and make
            every meal special with ZaikaExpress.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <Link
              href="#popular-food"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-3 font-semibold text-primary-foreground shadow-sm transition-transform hover:-translate-y-0.5 hover:opacity-90"
            >
              Explore food
              <ArrowRight size={18} aria-hidden="true" />
            </Link>

            <Link
              href="#categories"
              className="inline-flex min-h-12 items-center justify-center gap-2 rounded-xl border border-border bg-card px-6 py-3 font-semibold text-card-foreground transition-colors hover:bg-accent"
            >
              Browse categories
              <ArrowDown size={17} aria-hidden="true" />
            </Link>
          </div>

          <div className="mt-9 flex flex-wrap gap-x-5 gap-y-3 text-sm text-muted-foreground">
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={17} className="text-primary" />
              Easy ordering
            </span>
            <span className="inline-flex items-center gap-2">
              <Clock3 size={17} className="text-primary" />
              Convenient delivery
            </span>
            <span className="inline-flex items-center gap-2">
              <MapPin size={17} className="text-primary" />
              Local favourites
            </span>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-lg">
          <div className="absolute inset-6 rounded-[2.5rem] bg-primary/15 blur-2xl" />

          <div className="relative overflow-hidden rounded-4xl border border-border/70 bg-card p-4 shadow-xl shadow-slate-900/5 sm:p-6">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">
                  Made for your cravings
                </p>
                <h2 className="mt-1 text-xl font-bold text-card-foreground sm:text-2xl">
                  A little taste of happiness
                </h2>
              </div>

              <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-secondary text-primary">
                <Utensils size={22} aria-hidden="true" />
              </span>
            </div>

            <div className="mt-6 grid grid-cols-2 gap-3">
              <div className="flex min-h-40 flex-col justify-between rounded-2xl bg-amber-100 p-4 text-amber-950 dark:bg-amber-950/40 dark:text-amber-100 sm:min-h-48">
                <span className="text-5xl" role="img" aria-label="Burger">
                  🍔
                </span>
                <div>
                  <p className="font-bold">Burger time</p>
                  <p className="mt-1 text-xs opacity-75">Big flavour, every bite</p>
                </div>
              </div>

              <div className="mt-6 flex min-h-40 flex-col justify-between rounded-2xl bg-rose-100 p-4 text-rose-950 dark:bg-rose-950/40 dark:text-rose-100 sm:min-h-48">
                <span className="text-5xl" role="img" aria-label="Pizza">
                  🍕
                </span>
                <div>
                  <p className="font-bold">Pizza nights</p>
                  <p className="mt-1 text-xs opacity-75">A slice of joy</p>
                </div>
              </div>

              <div className="flex min-h-32 flex-col justify-between rounded-2xl bg-emerald-100 p-4 text-emerald-950 dark:bg-emerald-950/40 dark:text-emerald-100">
                <span className="text-4xl" role="img" aria-label="Biryani">
                  🍛
                </span>
                <p className="font-bold">Desi favourites</p>
              </div>

              <div className="mt-4 flex min-h-32 flex-col justify-between rounded-2xl bg-sky-100 p-4 text-sky-950 dark:bg-sky-950/40 dark:text-sky-100">
                <span className="text-4xl" role="img" aria-label="Fries">
                  🍟
                </span>
                <p className="font-bold">Snack time</p>
              </div>
            </div>

            <div className="mt-5 flex items-center gap-3 rounded-xl border border-border bg-background p-3.5">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-secondary text-primary">
                <Clock3 size={20} aria-hidden="true" />
              </span>
              <div>
                <p className="text-sm font-semibold text-foreground">
                  Your next meal is waiting
                </p>
                <p className="mt-0.5 text-xs text-muted-foreground">
                  Find something delicious to enjoy.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

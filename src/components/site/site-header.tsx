
import Link from "next/link";
import { ArrowRight, ShoppingBag, UtensilsCrossed } from "lucide-react";

import { ThemeToggle } from "@/src/components/theme-toggle";

const navigation = [
  { label: "Home", href: "/" },
  { label: "Categories", href: "#categories" },
  { label: "Popular food", href: "#popular-food" },
];

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/95 backdrop-blur">
      <div className="mx-auto flex min-h-16 max-w-7xl items-center justify-between gap-4 px-4 sm:px-6 lg:px-8">
        <Link
          href="/"
          className="flex shrink-0 items-center gap-2.5"
          aria-label="ZaikaExpress home"
        >
          <span className="flex size-10 items-center justify-center rounded-xl bg-primary text-primary-foreground">
            <UtensilsCrossed size={21} aria-hidden="true" />
          </span>

          <span className="text-lg font-extrabold tracking-tight text-foreground sm:text-xl">
            Zaika<span className="text-primary">Express</span>
          </span>
        </Link>

        <nav
          aria-label="Main navigation"
          className="hidden items-center gap-7 md:flex"
        >
          {navigation.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              className="text-sm font-medium text-muted-foreground transition-colors hover:text-primary"
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-2">
          <ThemeToggle />

          <Link
            href="/login"
            className="hidden rounded-lg px-3 py-2 text-sm font-semibold text-foreground transition-colors hover:bg-accent sm:inline-flex"
          >
            Sign in
          </Link>

          <Link
            href="/register"
            className="inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-3 text-sm font-semibold text-primary-foreground transition-opacity hover:opacity-90 sm:px-4"
          >
            <ShoppingBag size={16} aria-hidden="true" />
            <span>Join us</span>
            <ArrowRight
              size={15}
              aria-hidden="true"
              className="hidden sm:block"
            />
          </Link>
        </div>
      </div>

      <nav
        aria-label="Mobile navigation"
        className="flex items-center gap-5 overflow-x-auto border-t border-border/60 px-4 py-3 md:hidden"
      >
        {navigation.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="shrink-0 text-sm font-medium text-muted-foreground hover:text-primary"
          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
  );
}


import Link from "next/link";
import type { ReactNode } from "react";

import { ThemeToggle } from "@/src/components/theme-toggle";

type AuthLayoutProps = {
    title: string;
    description: string;
    children: ReactNode;
    footer: ReactNode;
};

export function AuthLayout({
    title,
    description,
    children,
    footer,
}: AuthLayoutProps) {
    return (
        <main className="flex min-h-screen flex-1 flex-col bg-background">
            <header className="flex items-center justify-between border-b px-4 py-4 sm:px-8">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 font-bold tracking-tight text-foreground"
                    aria-label="ZaikaExpress home"
                >
                    <span className="inline-flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground">
                        Z
                    </span>
                    <span className="text-lg">ZaikaExpress</span>
                </Link>

                <ThemeToggle />
            </header>

            <section className="flex flex-1 items-center justify-center px-4 py-10 sm:py-14">
                <div className="w-full max-w-md">
                    <div className="mb-7 space-y-2 text-center">
                        <h1 className="text-3xl font-bold tracking-tight text-foreground">
                            {title}
                        </h1>
                        <p className="text-sm leading-6 text-muted-foreground">
                            {description}
                        </p>
                    </div>

                    <div className="rounded-2xl border bg-card p-5 shadow-sm sm:p-8">
                        {children}
                    </div>

                    <div className="mt-6 text-center text-sm text-muted-foreground">
                        {footer}
                    </div>
                </div>
            </section>

            <footer className="border-t px-4 py-4 text-center text-xs text-muted-foreground">
                © 2026 ZaikaExpress
            </footer>
        </main>
    );
}


"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { LogOut } from "lucide-react";
import { useCallback, useEffect, useState } from "react";
import {
    AlertCircle,
    ArrowRight,
    CheckCircle2,
    Clock3,
    MapPin,
    Package,
    RefreshCw,
    Store,
    Utensils,
} from "lucide-react";

type ShopStatus = "pending" | "approved" | "rejected" | "suspended";

interface ShopProfile {
    id: string;
    name: string;
    slug: string;
    description: string;
    cuisineTypes: string[];
    phone: string;
    address: Record<string, unknown>;
    status: ShopStatus;
    rejectionReason?: string | null;
    deliveryRadiusKm: number;
    acceptsOrders: boolean;
    createdAt: string;
}

interface ShopApiResponse {
    success: boolean;
    message?: string;
    shop?: ShopProfile;
}

interface ProductsApiResponse {
    success: boolean;
    message?: string;
    products?: Array<{ id: string; status: string }>;
}

const statusConfig: Record<
    ShopStatus,
    { label: string; description: string; className: string }
> = {
    pending: {
        label: "Pending review",
        description: "Your application is waiting for administrator approval.",
        className:
            "border-amber-200 bg-amber-50 text-amber-800 dark:border-amber-900 dark:bg-amber-950/40 dark:text-amber-300",
    },
    approved: {
        label: "Approved",
        description: "Your shop has been approved.",
        className:
            "border-emerald-200 bg-emerald-50 text-emerald-800 dark:border-emerald-900 dark:bg-emerald-950/40 dark:text-emerald-300",
    },
    rejected: {
        label: "Rejected",
        description: "Your application was rejected. Review the reason below.",
        className:
            "border-rose-200 bg-rose-50 text-rose-800 dark:border-rose-900 dark:bg-rose-950/40 dark:text-rose-300",
    },
    suspended: {
        label: "Suspended",
        description: "Your shop is currently suspended.",
        className:
            "border-slate-200 bg-slate-100 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-300",
    },
};

function getAddressLine(address: Record<string, unknown>) {
    const fields = [
        address.addressLine1 ?? address.line1,
        address.addressLine2 ?? address.line2,
        address.city,
        address.state,
        address.postalCode,
        address.country,
    ];

    return fields
        .filter(
            (value): value is string =>
                typeof value === "string" && value.trim().length > 0,
        )
        .join(", ");
}

function StatCard({
    title,
    value,
    description,
    icon: Icon,
}: {
    title: string;
    value: string | number;
    description: string;
    icon: typeof Store;
}) {
    return (
        <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
            <div className="flex items-start justify-between gap-3">
                <div>
                    <p className="text-sm font-medium text-slate-500 dark:text-slate-400">
                        {title}
                    </p>
                    <p className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 dark:text-white">
                        {value}
                    </p>
                    <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                        {description}
                    </p>
                </div>
                <div className="rounded-xl bg-sky-50 p-3 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                    <Icon size={22} />
                </div>
            </div>
        </section>
    );
}

export function ShopDashboard() {
    const [shop, setShop] = useState<ShopProfile | null>(null);
    const [productCount, setProductCount] = useState<number | null>(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);

    const loadDashboard = useCallback(async () => {
        setLoading(true);
        setError("");

        try {
            const [shopResponse, productsResponse] = await Promise.all([
                fetch("/api/shop/me", { cache: "no-store" }),
                fetch("/api/shop/products", { cache: "no-store" }),
            ]);

            const shopData =
                (await shopResponse.json()) as ShopApiResponse;

            const productsData =
                (await productsResponse.json()) as ProductsApiResponse;

            if (!shopResponse.ok || !shopData.success || !shopData.shop) {
                throw new Error(
                    shopData.message ?? "Unable to load your shop profile.",
                );
            }

            if (!productsResponse.ok || !productsData.success) {
                throw new Error(
                    productsData.message ?? "Unable to load your products.",
                );
            }

            setShop(shopData.shop);
            setProductCount(productsData.products?.length ?? 0);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Something went wrong while loading the dashboard.",
            );
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function fetchDashboard() {
            try {
                const [shopResponse, productsResponse] = await Promise.all([
                    fetch("/api/shop/me", { cache: "no-store" }),
                    fetch("/api/shop/products", { cache: "no-store" }),
                ]);

                const shopData =
                    (await shopResponse.json()) as ShopApiResponse;

                const productsData =
                    (await productsResponse.json()) as ProductsApiResponse;

                if (!shopResponse.ok || !shopData.success || !shopData.shop) {
                    throw new Error(
                        shopData.message ?? "Unable to load your shop profile.",
                    );
                }

                if (!productsResponse.ok || !productsData.success) {
                    throw new Error(
                        productsData.message ?? "Unable to load your products.",
                    );
                }

                if (!cancelled) {
                    setShop(shopData.shop);
                    setProductCount(productsData.products?.length ?? 0);
                    setError("");
                }
            } catch (err) {
                if (!cancelled) {
                    setError(
                        err instanceof Error
                            ? err.message
                            : "Something went wrong while loading the dashboard.",
                    );
                }
            } finally {
                if (!cancelled) {
                    setLoading(false);
                }
            }
        }

        void fetchDashboard();

        return () => {
            cancelled = true;
        };
    }, []);

    if (loading) {
        return (
            <main className="min-h-screen bg-slate-50 p-6 dark:bg-slate-950">
                <div className="mx-auto max-w-7xl animate-pulse space-y-6">
                    <div className="h-8 w-64 rounded-lg bg-slate-200 dark:bg-slate-800" />
                    <div className="h-36 rounded-2xl bg-slate-200 dark:bg-slate-800" />
                    <div className="grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((item) => (
                            <div
                                key={item}
                                className="h-32 rounded-2xl bg-slate-200 dark:bg-slate-800"
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    }

    if (error || !shop) {
        return (
            <main className="min-h-screen bg-slate-50 px-4 py-12 dark:bg-slate-950">
                <section className="mx-auto max-w-xl rounded-2xl border border-rose-200 bg-white p-6 dark:border-rose-900 dark:bg-slate-900">
                    <AlertCircle className="text-rose-600" size={28} />
                    <h1 className="mt-4 text-xl font-semibold text-slate-900 dark:text-white">
                        Dashboard could not be loaded
                    </h1>
                    <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">
                        {error || "Your shop information is unavailable."}
                    </p>
                    <button
                        type="button"
                        onClick={() => void loadDashboard()}
                        className="mt-5 inline-flex items-center gap-2 rounded-xl bg-sky-700 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-sky-800"
                    >
                        <RefreshCw size={16} />
                        Try again
                    </button>
                </section>
            </main>
        );
    }

    const status = statusConfig[shop.status];
    const address = getAddressLine(shop.address ?? {});

    return (
        <main className="min-h-screen bg-slate-50 dark:bg-slate-950">
            <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
                <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                    <div>
                        <p className="text-sm font-medium text-sky-700 dark:text-sky-300">
                            ZaikaExpress Partner Portal
                        </p>
                        <h1 className="mt-1 text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                            Shop dashboard
                        </h1>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Manage your shop and keep track of its progress.
                        </p>
                    </div>


                    <div className="flex flex-wrap items-center gap-3 self-start sm:self-auto">
                        <button
                            type="button"
                            onClick={() => void loadDashboard()}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-100 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800"
                        >
                            <RefreshCw size={16} />
                            Refresh
                        </button>

                        <button
                            type="button"
                            onClick={() => void signOut({ callbackUrl: "/login" })}
                            className="inline-flex items-center justify-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2.5 text-sm font-semibold text-rose-700 transition hover:bg-rose-50 dark:border-rose-900 dark:bg-slate-900 dark:text-rose-300 dark:hover:bg-rose-950/40"
                        >
                            <LogOut size={16} />
                            Logout
                        </button>
                    </div>

                </header>

                <section className="mt-8 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-8">
                    <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-start">
                        <div className="flex items-start gap-4">
                            <div className="rounded-2xl bg-sky-50 p-4 text-sky-700 dark:bg-sky-950 dark:text-sky-300">
                                <Store size={30} />
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
                                    {shop.name}
                                </h2>
                                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                                    {shop.cuisineTypes?.length
                                        ? shop.cuisineTypes.join(" · ")
                                        : "Cuisine types not specified"}
                                </p>
                                <p className="mt-3 max-w-2xl text-sm leading-6 text-slate-600 dark:text-slate-300">
                                    {shop.description}
                                </p>
                            </div>
                        </div>

                        <span
                            className={`inline-flex w-fit items-center gap-2 rounded-full border px-3 py-1.5 text-sm font-semibold ${status.className}`}
                        >
                            {shop.status === "approved" ? (
                                <CheckCircle2 size={16} />
                            ) : (
                                <Clock3 size={16} />
                            )}
                            {status.label}
                        </span>
                    </div>

                    <div className={`mt-6 rounded-xl border p-4 ${status.className}`}>
                        <p className="text-sm font-semibold">{status.description}</p>
                        {shop.status === "rejected" && shop.rejectionReason && (
                            <p className="mt-2 text-sm">
                                Reason: {shop.rejectionReason}
                            </p>
                        )}
                    </div>
                </section>

                <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    <StatCard
                        title="Shop status"
                        value={status.label}
                        description="Current application status"
                        icon={Store}
                    />
                    <StatCard
                        title="Total products"
                        value={productCount ?? "—"}
                        description="Products listed in your shop"
                        icon={Package}
                    />
                    <StatCard
                        title="Accepting orders"
                        value={shop.acceptsOrders ? "Yes" : "No"}
                        description="Whether your shop can receive orders"
                        icon={Utensils}
                    />
                </section>

                <section className="mt-6 grid gap-6 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                        <div className="flex items-center gap-3">
                            <MapPin className="text-sky-700 dark:text-sky-300" size={22} />
                            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                                Shop information
                            </h2>
                        </div>

                        <dl className="mt-5 space-y-4 text-sm">
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">
                                    Phone
                                </dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {shop.phone || "Not provided"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">
                                    Address
                                </dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {address || "Address not available"}
                                </dd>
                            </div>
                            <div>
                                <dt className="text-slate-500 dark:text-slate-400">
                                    Delivery radius
                                </dt>
                                <dd className="mt-1 font-medium text-slate-900 dark:text-white">
                                    {shop.deliveryRadiusKm} km
                                </dd>
                            </div>
                        </dl>
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 dark:border-slate-800 dark:bg-slate-900">
                        <h2 className="text-lg font-semibold text-slate-900 dark:text-white">
                            Quick actions
                        </h2>
                        <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                            Manage your shop using these shortcuts.
                        </p>

                        <div className="mt-5 space-y-3">
                            <Link
                                href="/shop/apply"
                                className="flex items-center justify-between rounded-xl border border-slate-200 p-4 transition hover:border-sky-300 hover:bg-sky-50/60 dark:border-slate-700 dark:hover:border-sky-800 dark:hover:bg-sky-950/30"
                            >
                                <span>
                                    <span className="block text-sm font-semibold text-slate-900 dark:text-white">
                                        Shop application
                                    </span>
                                    <span className="mt-1 block text-xs text-slate-500 dark:text-slate-400">
                                        View the shop application page
                                    </span>
                                </span>
                                <ArrowRight size={18} />
                            </Link>

                            <div className="rounded-xl border border-slate-200 p-4 dark:border-slate-700">
                                <div className="flex items-center gap-3">
                                    <Package
                                        size={20}
                                        className="text-sky-700 dark:text-sky-300"
                                    />
                                    <div>
                                        <p className="text-sm font-semibold text-slate-900 dark:text-white">
                                            Product management
                                        </p>
                                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">
                                            Product creation and editing are the next implementation step.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>
    );
}

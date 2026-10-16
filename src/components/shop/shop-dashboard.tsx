
"use client";

import Link from "next/link";
import { signOut } from "next-auth/react";
import { ThemeToggle } from "@/src/components/theme-toggle";
import { useCallback, useEffect, useState } from "react";
import {
  AlertCircle,
  CheckCircle2,
  Clock3,
  ImagePlus,
  LoaderCircle,
  LogOut,
  Package,
  Pencil,
  Plus,
  RefreshCw,
  Store,
  Trash2,
  Utensils,
  X,
} from "lucide-react";
import {
  PRODUCT_CATEGORIES,
  type ProductCategory,
  type ProductStatus,
} from "@/src/types/domain";

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

interface ProductItem {
  id: string;
  shopId: string;
  name: string;
  slug: string;
  description: string;
  category: ProductCategory;
  imageUrls: string[];
  price: number;
  currency: "PKR";
  status: ProductStatus;
  isAvailable: boolean;
  preparationTimeMinutes: number;
  tags: string[];
  ratingAverage: number;
  ratingCount: number;
  createdAt: string;
  updatedAt: string;
}

interface ShopApiResponse {
  success: boolean;
  message?: string;
  shop?: ShopProfile;
}

interface ProductsApiResponse {
  success: boolean;
  message?: string;
  products?: ProductItem[];
  product?: ProductItem;
}

interface ProductForm {
  name: string;
  description: string;
  category: ProductCategory;
  imageUrls: string;
  price: string;
  preparationTimeMinutes: string;
  tags: string;
  status: ProductStatus;
  isAvailable: boolean;
}

const EMPTY_FORM: ProductForm = {
  name: "",
  description: "",
  category: "Biryani",
  imageUrls: "",
  price: "",
  preparationTimeMinutes: "20",
  tags: "",
  status: "active",
  isAvailable: true,
};

const inputClass =
  "w-full rounded-xl border border-input bg-card px-3 py-2.5 text-sm text-card-foreground outline-none transition placeholder:text-muted-foreground focus:border-ring focus:ring-2 focus:ring-ring/20";

const buttonClass =
  "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-50";

function formatPrice(price: number) {
  return `Rs ${price.toLocaleString("en-PK")}`;
}

function getAddressLine(address: Record<string, unknown>) {
  return Object.values(address)
    .filter(
      (value): value is string =>
        typeof value === "string" && value.trim().length > 0,
    )
    .join(", ");
}

function statusLabel(status: ShopStatus) {
  return {
    pending: "Pending approval",
    approved: "Approved",
    rejected: "Rejected",
    suspended: "Suspended",
  }[status];
}

function statusClass(status: ShopStatus) {
  switch (status) {
    case "approved":
      return "bg-emerald-50 text-emerald-700";
    case "rejected":
    case "suspended":
      return "bg-red-50 text-red-700";
    default:
      return "bg-amber-50 text-amber-700";
  }
}

function productFormFromItem(product: ProductItem): ProductForm {
  return {
    name: product.name,
    description: product.description,
    category: product.category,
    imageUrls: product.imageUrls.join("\n"),
    price: String(product.price),
    preparationTimeMinutes: String(product.preparationTimeMinutes),
    tags: product.tags.join(", "),
    status: product.status,
    isAvailable: product.isAvailable,
  };
}

function parseProductForm(form: ProductForm) {
  const imageUrls = form.imageUrls
    .split(/[\n,]/)
    .map((url) => url.trim())
    .filter(Boolean);

  const tags = form.tags
    .split(",")
    .map((tag) => tag.trim())
    .filter(Boolean);

  return {
    name: form.name.trim(),
    description: form.description.trim(),
    category: form.category,
    imageUrls,
    price: Number(form.price),
    preparationTimeMinutes: Number(form.preparationTimeMinutes),
    tags,
    status: form.status,
    isAvailable: form.isAvailable,
  };
}

export function ShopDashboard() {
  const [shop, setShop] = useState<ShopProfile | null>(null);
  const [products, setProducts] = useState<ProductItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");
  const [formError, setFormError] = useState("");
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState<ProductForm>(EMPTY_FORM);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "inactive">("all");

  const loadDashboard = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const [shopResponse, productsResponse] = await Promise.all([
        fetch("/api/shop/me", { cache: "no-store" }),
        fetch("/api/shop/products", { cache: "no-store" }),
      ]);

      const shopData = (await shopResponse.json()) as ShopApiResponse;
      const productData =
        (await productsResponse.json()) as ProductsApiResponse;

      if (!shopResponse.ok || !shopData.success || !shopData.shop) {
        throw new Error(shopData.message || "Unable to load your shop.");
      }

      if (!productsResponse.ok || !productData.success) {
        throw new Error(
          productData.message || "Unable to load your products.",
        );
      }

      setShop(shopData.shop);
      setProducts(productData.products ?? []);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to load dashboard.",
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function fetchDashboard() {
      setLoading(true);
      setError("");

      try {
        const [shopResponse, productsResponse] = await Promise.all([
          fetch("/api/shop/me", { cache: "no-store" }),
          fetch("/api/shop/products", { cache: "no-store" }),
        ]);

        const shopData = (await shopResponse.json()) as ShopApiResponse;
        const productData =
          (await productsResponse.json()) as ProductsApiResponse;

        if (!shopResponse.ok || !shopData.success || !shopData.shop) {
          throw new Error(shopData.message || "Unable to load your shop.");
        }

        if (!productsResponse.ok || !productData.success) {
          throw new Error(
            productData.message || "Unable to load your products.",
          );
        }

        if (!cancelled) {
          setShop(shopData.shop);
          setProducts(productData.products ?? []);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Unable to load dashboard.",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }

    void fetchDashboard();

    return () => {
      cancelled = true;
    };
  }, []);

  function openCreateForm() {
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
    setNotice("");
    setFormOpen(true);
  }

  function openEditForm(product: ProductItem) {
    setEditingId(product.id);
    setForm(productFormFromItem(product));
    setFormError("");
    setNotice("");
    setFormOpen(true);
  }

  function closeForm() {
    if (saving) return;
    setFormOpen(false);
    setEditingId(null);
    setForm(EMPTY_FORM);
    setFormError("");
  }

  function updateField<K extends keyof ProductForm>(
    key: K,
    value: ProductForm[K],
  ) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function saveProduct(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setNotice("");

    const payload = parseProductForm(form);

    if (payload.name.length < 2) {
      setFormError("Product name must contain at least 2 characters.");
      return;
    }

    if (!Number.isSafeInteger(payload.price) || payload.price < 1) {
      setFormError("Enter a valid whole price in PKR.");
      return;
    }

    if (
      !Number.isInteger(payload.preparationTimeMinutes) ||
      payload.preparationTimeMinutes < 0 ||
      payload.preparationTimeMinutes > 1440
    ) {
      setFormError("Preparation time must be between 0 and 1440 minutes.");
      return;
    }

    if (payload.imageUrls.length > 10) {
      setFormError("You can add a maximum of 10 image URLs.");
      return;
    }

    const invalidImage = payload.imageUrls.find((url) => {
      try {
        const parsed = new URL(url);
        return parsed.protocol !== "https:" && parsed.protocol !== "http:";
      } catch {
        return true;
      }
    });

    if (invalidImage) {
      setFormError("Every image must have a valid HTTP or HTTPS URL.");
      return;
    }

    setSaving(true);

    try {
      const endpoint = editingId
        ? `/api/shop/products/${editingId}`
        : "/api/shop/products";

      const response = await fetch(endpoint, {
        method: editingId ? "PATCH" : "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as ProductsApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save product.");
      }

      setFormOpen(false);
      setEditingId(null);
      setForm(EMPTY_FORM);
      setNotice(editingId ? "Product updated successfully." : "Product created successfully.");

      await loadDashboard();
    } catch (err) {
      setFormError(
        err instanceof Error ? err.message : "Unable to save product.",
      );
    } finally {
      setSaving(false);
    }
  }

  async function toggleAvailability(product: ProductItem) {
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/shop/products/${product.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isAvailable: !product.isAvailable }),
      });

      const data = (await response.json()) as ProductsApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to update availability.");
      }

      setProducts((current) =>
        current.map((item) =>
          item.id === product.id
            ? { ...item, isAvailable: !product.isAvailable }
            : item,
        ),
      );

      setNotice(
        product.isAvailable
          ? "Product marked unavailable."
          : "Product marked available.",
      );
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to update availability.",
      );
    }
  }

  async function deleteProduct(product: ProductItem) {
    const confirmed = window.confirm(
      `Delete "${product.name}"? This action cannot be undone.`,
    );

    if (!confirmed) return;

    setDeletingId(product.id);
    setError("");
    setNotice("");

    try {
      const response = await fetch(`/api/shop/products/${product.id}`, {
        method: "DELETE",
      });

      const data = (await response.json()) as ProductsApiResponse;

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to delete product.");
      }

      setProducts((current) =>
        current.filter((item) => item.id !== product.id),
      );
      setNotice("Product deleted successfully.");
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Unable to delete product.",
      );
    } finally {
      setDeletingId(null);
    }
  }

  const approved = shop?.status === "approved";

  const visibleProducts = products.filter((product) => {
    const matchesSearch =
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.category.toLowerCase().includes(search.toLowerCase());

    const matchesFilter =
      filter === "all" ||
      (filter === "active" && product.status === "active") ||
      (filter === "inactive" && product.status === "inactive");

    return matchesSearch && matchesFilter;
  });

  const activeProducts = products.filter(
    (product) => product.status === "active",
  ).length;

  return (
    <main className="min-h-screen bg-background px-4 py-6 text-foreground transition-colors sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <header className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm font-semibold text-sky-700">
              ZaikaExpress Partner Portal
            </p>
            <h1 className="mt-1 text-2xl font-bold tracking-tight sm:text-3xl">
              Shop dashboard
            </h1>
            <p className="mt-1 text-sm text-slate-500">
              Manage your shop and food menu in one place.
            </p>
          </div>

          <div className="flex flex-wrap gap-2">
             <ThemeToggle />
            <button
              type="button"
              onClick={() => void loadDashboard()}
              disabled={loading}
              className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-100`}
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              Refresh
            </button>

            <button
              type="button"
              onClick={() => void signOut({ callbackUrl: "/login" })}
              className={`${buttonClass} bg-slate-900 text-white hover:bg-slate-700`}
            >
              <LogOut size={16} />
              Logout
            </button>
          </div>
        </header>

        {error && (
          <div
            role="alert"
            className="flex items-start gap-3 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-800"
          >
            <AlertCircle size={18} className="mt-0.5 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        {notice && (
          <div
            role="status"
            className="flex items-start gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800"
          >
            <CheckCircle2 size={18} className="mt-0.5 shrink-0" />
            <span>{notice}</span>
          </div>
        )}

        {loading && !shop ? (
          <div className="flex min-h-64 items-center justify-center gap-3 text-slate-500">
            <LoaderCircle className="animate-spin" size={22} />
            Loading your dashboard...
          </div>
        ) : (
          <>
            {shop && (
              <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
                <div className="flex flex-col justify-between gap-4 border-b border-slate-100 p-5 sm:flex-row sm:items-center sm:p-6">
                  <div className="flex items-start gap-4">
                    <div className="rounded-2xl bg-sky-50 p-3 text-sky-700">
                      <Store size={26} />
                    </div>
                    <div>
                      <h2 className="text-xl font-bold">{shop.name}</h2>
                      <p className="mt-1 text-sm text-slate-500">
                        {shop.slug}
                      </p>
                      <p className="mt-2 text-sm text-slate-600">
                        {shop.description || "No shop description provided."}
                      </p>
                    </div>
                  </div>

                  <span
                    className={`inline-flex w-fit rounded-full px-3 py-1.5 text-xs font-bold ${statusClass(shop.status)}`}
                  >
                    {statusLabel(shop.status)}
                  </span>
                </div>

                {shop.status !== "approved" && (
                  <div className="border-b border-amber-100 bg-amber-50 px-5 py-3 text-sm text-amber-900">
                    Product changes require an approved shop. Your current shop
                    status is {shop.status}.
                    {shop.rejectionReason && (
                      <p className="mt-1">{shop.rejectionReason}</p>
                    )}
                  </div>
                )}

                <div className="grid gap-4 p-5 sm:grid-cols-2 sm:p-6 lg:grid-cols-3">
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Shop status</p>
                    <p className="mt-2 font-bold">{statusLabel(shop.status)}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Total products</p>
                    <p className="mt-2 text-2xl font-bold">{products.length}</p>
                  </div>
                  <div className="rounded-xl bg-slate-50 p-4">
                    <p className="text-sm text-slate-500">Active products</p>
                    <p className="mt-2 text-2xl font-bold">{activeProducts}</p>
                  </div>
                </div>

                <div className="border-t border-slate-100 p-5 sm:p-6">
                  <h3 className="font-bold">Shop information</h3>
                  <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
                    <div>
                      <p className="text-slate-500">Phone</p>
                      <p className="mt-1 font-medium">{shop.phone || "Not provided"}</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Address</p>
                      <p className="mt-1 font-medium">
                        {getAddressLine(shop.address) || "Not provided"}
                      </p>
                    </div>
                    <div>
                      <p className="text-slate-500">Delivery radius</p>
                      <p className="mt-1 font-medium">{shop.deliveryRadiusKm} km</p>
                    </div>
                    <div>
                      <p className="text-slate-500">Accepting orders</p>
                      <p className="mt-1 font-medium">
                        {shop.acceptsOrders ? "Yes" : "No"}
                      </p>
                    </div>
                  </div>
                </div>
              </section>
            )}

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
              <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
                <div>
                  <div className="flex items-center gap-2">
                    <Utensils className="text-sky-700" size={22} />
                    <h2 className="text-xl font-bold">Product management</h2>
                  </div>
                  <p className="mt-1 text-sm text-slate-500">
                    Create, update, and manage your menu items.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={openCreateForm}
                  disabled={!approved || formOpen}
                  className={`${buttonClass} bg-sky-600 text-white hover:bg-sky-700`}
                >
                  <Plus size={17} />
                  Add product
                </button>
              </div>

              {!approved && (
                <p className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-800">
                  You can view your products, but only an approved shop can
                  create or modify them.
                </p>
              )}

              {formOpen && (
                <form
                  onSubmit={saveProduct}
                  className="mt-6 space-y-5 rounded-2xl border border-sky-100 bg-sky-50/50 p-4 sm:p-6"
                >
                  <div className="flex items-center justify-between gap-3">
                    <h3 className="text-lg font-bold">
                      {editingId ? "Edit product" : "Add a new product"}
                    </h3>
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={saving}
                      aria-label="Close product form"
                      className="rounded-lg p-2 text-slate-500 hover:bg-white"
                    >
                      <X size={19} />
                    </button>
                  </div>

                  {formError && (
                    <div role="alert" className="rounded-xl bg-red-50 p-3 text-sm text-red-700">
                      {formError}
                    </div>
                  )}

                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="space-y-1.5 text-sm font-medium">
                      Product name *
                      <input
                        className={inputClass}
                        value={form.name}
                        onChange={(event) => updateField("name", event.target.value)}
                        minLength={2}
                        maxLength={150}
                        required
                        placeholder="Chicken Biryani"
                      />
                    </label>

                    <label className="space-y-1.5 text-sm font-medium">
                      Category *
                      <select
                        className={inputClass}
                        value={form.category}
                        onChange={(event) =>
                          updateField("category", event.target.value as ProductCategory)
                        }
                        required
                      >
                        {PRODUCT_CATEGORIES.map((category) => (
                          <option key={category} value={category}>
                            {category}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="space-y-1.5 text-sm font-medium">
                      Price (PKR) *
                      <input
                        className={inputClass}
                        type="number"
                        min={1}
                        step={1}
                        value={form.price}
                        onChange={(event) => updateField("price", event.target.value)}
                        required
                        placeholder="450"
                      />
                    </label>

                    <label className="space-y-1.5 text-sm font-medium">
                      Preparation time (minutes)
                      <input
                        className={inputClass}
                        type="number"
                        min={0}
                        max={1440}
                        step={1}
                        value={form.preparationTimeMinutes}
                        onChange={(event) =>
                          updateField("preparationTimeMinutes", event.target.value)
                        }
                        required
                      />
                    </label>

                    <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                      Description *
                      <textarea
                        className={inputClass}
                        value={form.description}
                        onChange={(event) =>
                          updateField("description", event.target.value)
                        }
                        maxLength={3000}
                        rows={3}
                        required
                        placeholder="Describe the ingredients and taste..."
                      />
                    </label>

                    <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                      <span className="flex items-center gap-2">
                        <ImagePlus size={16} />
                        Image URLs
                      </span>
                      <textarea
                        className={inputClass}
                        value={form.imageUrls}
                        onChange={(event) =>
                          updateField("imageUrls", event.target.value)
                        }
                        rows={3}
                        placeholder={"https://example.com/food.jpg\nOne URL per line, up to 10"}
                      />
                      <span className="block text-xs font-normal text-slate-500">
                        Use publicly accessible HTTP/HTTPS URLs for now. Cloudflare R2
                        uploads can be integrated later.
                      </span>
                    </label>

                    <label className="space-y-1.5 text-sm font-medium sm:col-span-2">
                      Tags
                      <input
                        className={inputClass}
                        value={form.tags}
                        onChange={(event) => updateField("tags", event.target.value)}
                        placeholder="chicken, rice, spicy"
                      />
                      <span className="block text-xs font-normal text-slate-500">
                        Separate tags with commas.
                      </span>
                    </label>

                    <label className="space-y-1.5 text-sm font-medium">
                      Product status
                      <select
                        className={inputClass}
                        value={form.status}
                        onChange={(event) =>
                          updateField("status", event.target.value as ProductStatus)
                        }
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </label>

                    <label className="flex items-center gap-3 self-end rounded-xl border border-slate-200 bg-white p-3 text-sm font-medium">
                      <input
                        type="checkbox"
                        checked={form.isAvailable}
                        onChange={(event) =>
                          updateField("isAvailable", event.target.checked)
                        }
                        className="size-4 accent-sky-600"
                      />
                      Available to order
                    </label>
                  </div>

                  <div className="flex flex-wrap justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeForm}
                      disabled={saving}
                      className={`${buttonClass} border border-slate-200 bg-white text-slate-700 hover:bg-slate-50`}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={saving || !approved}
                      className={`${buttonClass} bg-sky-600 text-white hover:bg-sky-700`}
                    >
                      {saving && <LoaderCircle size={16} className="animate-spin" />}
                      {saving
                        ? "Saving..."
                        : editingId
                          ? "Save changes"
                          : "Create product"}
                    </button>
                  </div>
                </form>
              )}

              <div className="mt-6 flex flex-col gap-3 sm:flex-row">
                <input
                  className={inputClass}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                  placeholder="Search by product name or category..."
                  aria-label="Search products"
                />
                <select
                  className={`${inputClass} sm:max-w-48`}
                  value={filter}
                  onChange={(event) =>
                    setFilter(event.target.value as "all" | "active" | "inactive")
                  }
                  aria-label="Filter products by status"
                >
                  <option value="all">All statuses</option>
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>

              {loading && products.length === 0 ? (
                <div className="flex justify-center gap-2 py-12 text-sm text-slate-500">
                  <LoaderCircle size={18} className="animate-spin" />
                  Loading products...
                </div>
              ) : visibleProducts.length === 0 ? (
                <div className="mt-5 rounded-2xl border border-dashed border-slate-300 px-5 py-12 text-center">
                  <Package size={34} className="mx-auto text-slate-400" />
                  <h3 className="mt-3 font-bold">
                    {products.length === 0 ? "No products yet" : "No matching products"}
                  </h3>
                  <p className="mt-1 text-sm text-slate-500">
                    {products.length === 0
                      ? "Add your first menu item to get started."
                      : "Try changing your search or status filter."}
                  </p>
                  {products.length === 0 && approved && (
                    <button
                      type="button"
                      onClick={openCreateForm}
                      className={`${buttonClass} mt-4 bg-sky-600 text-white hover:bg-sky-700`}
                    >
                      <Plus size={16} />
                      Add your first product
                    </button>
                  )}
                </div>
              ) : (
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {visibleProducts.map((product) => (
                    <article
                      key={product.id}
                      className="overflow-hidden rounded-2xl border border-slate-200 bg-white transition hover:border-sky-200 hover:shadow-sm"
                    >
                      {product.imageUrls[0] ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={product.imageUrls[0]}
                          alt={product.name}
                          className="h-44 w-full bg-slate-100 object-cover"
                        />
                      ) : (
                        <div className="flex h-36 items-center justify-center bg-slate-100 text-slate-400">
                          <ImagePlus size={34} />
                        </div>
                      )}

                      <div className="space-y-4 p-4">
                        <div className="flex items-start justify-between gap-3">
                          <div className="min-w-0">
                            <h3 className="truncate font-bold">{product.name}</h3>
                            <p className="mt-1 text-xs text-slate-500">
                              {product.category}
                            </p>
                          </div>
                          <p className="shrink-0 font-bold text-sky-700">
                            {formatPrice(product.price)}
                          </p>
                        </div>

                        <p className="line-clamp-2 min-h-10 text-sm text-slate-600">
                          {product.description}
                        </p>

                        <div className="flex flex-wrap gap-2 text-xs">
                          <span
                            className={`rounded-full px-2.5 py-1 font-semibold ${
                              product.status === "active"
                                ? "bg-emerald-50 text-emerald-700"
                                : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {product.status === "active" ? "Active" : "Inactive"}
                          </span>
                          <span
                            className={`rounded-full px-2.5 py-1 font-semibold ${
                              product.isAvailable
                                ? "bg-sky-50 text-sky-700"
                                : "bg-amber-50 text-amber-700"
                            }`}
                          >
                            {product.isAvailable ? "Available" : "Unavailable"}
                          </span>
                        </div>

                        <div className="flex items-center gap-2 text-xs text-slate-500">
                          <Clock3 size={14} />
                          {product.preparationTimeMinutes} min preparation
                        </div>

                        {product.tags.length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {product.tags.map((tag) => (
                              <span
                                key={tag}
                                className="rounded-md bg-slate-100 px-2 py-1 text-xs text-slate-600"
                              >
                                {tag}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="grid grid-cols-3 gap-2 border-t border-slate-100 pt-3">
                          <button
                            type="button"
                            disabled={!approved}
                            onClick={() => openEditForm(product)}
                            className={`${buttonClass} bg-sky-50 px-2 text-sky-700 hover:bg-sky-100`}
                          >
                            <Pencil size={15} />
                            Edit
                          </button>
                          <button
                            type="button"
                            disabled={!approved}
                            onClick={() => void toggleAvailability(product)}
                            className={`${buttonClass} bg-slate-100 px-2 text-slate-700 hover:bg-slate-200`}
                            title="Toggle availability"
                          >
                            {product.isAvailable ? "Unavailable" : "Available"}
                          </button>
                          <button
                            type="button"
                            disabled={!approved || deletingId === product.id}
                            onClick={() => void deleteProduct(product)}
                            className={`${buttonClass} bg-red-50 px-2 text-red-700 hover:bg-red-100`}
                          >
                            {deletingId === product.id ? (
                              <LoaderCircle size={15} className="animate-spin" />
                            ) : (
                              <Trash2 size={15} />
                            )}
                            Delete
                          </button>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </section>

            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
                <div>
                  <h2 className="font-bold">Shop setup</h2>
                  <p className="mt-1 text-sm text-slate-500">
                    Need to review your shop application?
                  </p>
                </div>
                <Link
                  href="/shop/apply"
                  className={`${buttonClass} border border-slate-200 text-slate-700 hover:bg-slate-50`}
                >
                  Shop application
                </Link>
              </div>
            </section>
          </>
        )}
      </div>
    </main>
  );
}

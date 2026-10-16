
"use client";

import { useState, type FormEvent } from "react";
import { shopApplicationSchema } from "@/src/schemas/shop.schema";

const CUISINE_OPTIONS = [
  "Biryani",
  "Burgers",
  "Pizza",
  "BBQ",
  "Chicken",
  "Seafood",
  "Fast Food",
  "Traditional Food",
  "Chinese",
  "Desserts",
  "Drinks",
] as const;

type FieldErrors = Record<string, string[] | undefined>;

export function ShopApplicationForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formError, setFormError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [cuisineTypes, setCuisineTypes] = useState<string[]>([]);
  const [deliveryRadiusKm, setDeliveryRadiusKm] = useState("5");

  function toggleCuisine(cuisine: string) {
    setCuisineTypes((current) =>
      current.includes(cuisine)
        ? current.filter((item) => item !== cuisine)
        : [...current, cuisine],
    );
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormError("");
    setFieldErrors({});

    const formData = new FormData(event.currentTarget);

    const rawData = {
      name: formData.get("name"),
      description: formData.get("description"),
      cuisineTypes,
      phone: formData.get("phone"),
      address: {
        line1: formData.get("line1"),
        line2: formData.get("line2") || undefined,
        city: formData.get("city"),
        state: formData.get("state") || undefined,
        postalCode: formData.get("postalCode") || undefined,
        country: formData.get("country"),
      },
      deliveryRadiusKm,
    };

    const parsed = shopApplicationSchema.safeParse(rawData);

    if (!parsed.success) {
      setFieldErrors(
        parsed.error.flatten().fieldErrors as FieldErrors,
      );
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await fetch("/api/shop/apply", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data),
      });

      const result: {
        success?: boolean;
        message?: string;
      } = await response.json();

      if (!response.ok || !result.success) {
        setFormError(
          result.message || "We could not submit your application.",
        );
        return;
      }

      setSubmitted(true);
    } catch {
      setFormError(
        "A network error occurred. Please check your connection and try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  function errorFor(field: string) {
    const message = fieldErrors[field]?.[0];
    return message ? (
      <p className="mt-1 text-sm text-destructive">{message}</p>
    ) : null;
  }

  const inputClass =
    "mt-1 w-full rounded-xl border border-border bg-background px-3 py-2.5 text-foreground outline-none focus-visible:ring-2 focus-visible:ring-primary";

  if (submitted) {
    return (
      <section
        aria-live="polite"
        className="rounded-2xl border border-border bg-card p-6 sm:p-8"
      >
        <div className="mb-4 flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
          <span aria-hidden="true" className="text-2xl">✓</span>
        </div>
        <h2 className="text-2xl font-semibold text-foreground">
          Application submitted
        </h2>
        <p className="mt-3 leading-7 text-muted-foreground">
          Your shop application is now pending review. You can manage
          your shop after it has been approved.
        </p>
        <p className="mt-4 text-sm text-muted-foreground">
          Please wait for an administrator to review your application.
        </p>
      </section>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      noValidate
      className="space-y-6 rounded-2xl border border-border bg-card p-5 sm:p-8"
    >
      {formError && (
        <div
          role="alert"
          className="rounded-xl border border-destructive/30 bg-destructive/5 p-3 text-sm text-destructive"
        >
          {formError}
        </div>
      )}

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Shop information
        </h2>

        <div>
          <label htmlFor="name" className="text-sm font-medium">
            Shop name *
          </label>
          <input
            id="name"
            name="name"
            required
            minLength={2}
            maxLength={100}
            className={inputClass}
            placeholder="e.g. Jhang Food Corner"
            aria-invalid={Boolean(fieldErrors.name?.length)}
          />
          {errorFor("name")}
        </div>

        <div>
          <label htmlFor="description" className="text-sm font-medium">
            Description *
          </label>
          <textarea
            id="description"
            name="description"
            required
            minLength={10}
            maxLength={2000}
            rows={4}
            className={inputClass}
            placeholder="Tell customers about your food and shop."
            aria-invalid={Boolean(fieldErrors.description?.length)}
          />
          {errorFor("description")}
        </div>

        <fieldset>
          <legend className="text-sm font-medium">
            Cuisine types
          </legend>
          <p className="mb-3 mt-1 text-sm text-muted-foreground">
            Select all that apply (up to 10).
          </p>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {CUISINE_OPTIONS.map((cuisine) => (
              <label
                key={cuisine}
                className="flex items-center gap-2 rounded-xl border border-border p-3 text-sm"
              >
                <input
                  type="checkbox"
                  checked={cuisineTypes.includes(cuisine)}
                  disabled={
                    !cuisineTypes.includes(cuisine) &&
                    cuisineTypes.length >= 10
                  }
                  onChange={() => toggleCuisine(cuisine)}
                  className="accent-primary"
                />
                {cuisine}
              </label>
            ))}
          </div>
          {errorFor("cuisineTypes")}
        </fieldset>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Contact information
        </h2>

        <div>
          <label htmlFor="phone" className="text-sm font-medium">
            Contact phone *
          </label>
          <input
            id="phone"
            name="phone"
            type="tel"
            required
            maxLength={30}
            className={inputClass}
            placeholder="+92 300 1234567"
            aria-invalid={Boolean(fieldErrors.phone?.length)}
          />
          {errorFor("phone")}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">
          Shop address
        </h2>

        <div>
          <label htmlFor="line1" className="text-sm font-medium">
            Address line 1 *
          </label>
          <input
            id="line1"
            name="line1"
            required
            maxLength={200}
            className={inputClass}
            placeholder="Street, building or market"
          />
          {errorFor("address")}
        </div>

        <div>
          <label htmlFor="line2" className="text-sm font-medium">
            Address line 2
          </label>
          <input
            id="line2"
            name="line2"
            maxLength={200}
            className={inputClass}
            placeholder="Optional"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <label htmlFor="city" className="text-sm font-medium">
              City *
            </label>
            <input
              id="city"
              name="city"
              required
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="state" className="text-sm font-medium">
              Province / state
            </label>
            <input
              id="state"
              name="state"
              maxLength={100}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="postalCode" className="text-sm font-medium">
              Postal code
            </label>
            <input
              id="postalCode"
              name="postalCode"
              maxLength={20}
              className={inputClass}
            />
          </div>

          <div>
            <label htmlFor="country" className="text-sm font-medium">
              Country *
            </label>
            <input
              id="country"
              name="country"
              required
              defaultValue="Pakistan"
              maxLength={100}
              className={inputClass}
            />
          </div>
        </div>
        {errorFor("address")}
      </section>

      <section>
        <label
          htmlFor="deliveryRadiusKm"
          className="text-sm font-medium"
        >
          Delivery radius (km) *
        </label>
        <input
          id="deliveryRadiusKm"
          type="number"
          min="1"
          max="100"
          step="1"
          required
          value={deliveryRadiusKm}
          onChange={(event) => setDeliveryRadiusKm(event.target.value)}
          className={inputClass}
        />
        {errorFor("deliveryRadiusKm")}
      </section>

      <p className="text-sm leading-6 text-muted-foreground">
        Your shop will remain pending until an administrator approves
        your application.
      </p>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full rounded-xl bg-primary px-5 py-3 font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-60"
      >
        {isSubmitting ? "Submitting application…" : "Submit application"}
      </button>
    </form>
  );
}

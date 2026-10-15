export const USER_ROLES = [
  "customer",
  "shopkeeper",
  "delivery",
  "admin",
] as const;

export type UserRole = (typeof USER_ROLES)[number];

export const ACCOUNT_STATUSES = ["active", "suspended"] as const;
export type AccountStatus = (typeof ACCOUNT_STATUSES)[number];

export const EMAIL_DELIVERY_STATUSES = [
  "pending",
  "sent",
  "failed",
] as const;
export type EmailDeliveryStatus =
  (typeof EMAIL_DELIVERY_STATUSES)[number];

export const SHOP_STATUSES = [
  "pending",
  "approved",
  "rejected",
  "suspended",
] as const;
export type ShopStatus = (typeof SHOP_STATUSES)[number];

export const PRODUCT_STATUSES = ["active", "inactive"] as const;
export type ProductStatus = (typeof PRODUCT_STATUSES)[number];

export const PAYMENT_METHODS = ["cod"] as const;
export type PaymentMethod = (typeof PAYMENT_METHODS)[number];

export const PAYMENT_STATUSES = [
  "pending",
  "paid",
  "failed",
  "refunded",
] as const;
export type PaymentStatus = (typeof PAYMENT_STATUSES)[number];

export const ORDER_STATUSES = [
  "pending",
  "confirmed",
  "preparing",
  "ready_for_pickup",
  "out_for_delivery",
  "delivered",
  "cancelled",
] as const;
export type OrderStatus = (typeof ORDER_STATUSES)[number];

export const CHECKOUT_STATUSES = [
  "placed",
  "partially_cancelled",
  "completed",
  "cancelled",
] as const;
export type CheckoutStatus = (typeof CHECKOUT_STATUSES)[number];

export const DELIVERY_ASSIGNMENT_STATUSES = [
  "assigned",
  "accepted",
  "picked_up",
  "delivered",
  "cancelled",
] as const;
export type DeliveryAssignmentStatus =
  (typeof DELIVERY_ASSIGNMENT_STATUSES)[number];
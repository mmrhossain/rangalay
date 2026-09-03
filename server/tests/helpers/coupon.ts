import { randomUUID } from "node:crypto";
import { prisma } from "../../src/lib/prisma.ts";
import type { CleanupTracker } from "./tracker.ts";

export const createTestCoupon = async (
  tracker: CleanupTracker,
  opts?: {
    usageLimit?: number | null;
    isActive?: boolean;
    status?: "DRAFT" | "ACTIVE" | "EXPIRED" | "DISABLED";
    startsAt?: Date;
    expiresAt?: Date;
    discountValue?: number;
  }
) => {
  const code = `T${randomUUID().replace(/-/g, "").slice(0, 10).toUpperCase()}`;
  const now = Date.now();
  const coupon = await prisma.coupon.create({
    data: {
      code,
      name: `Test coupon ${code}`,
      status: opts?.status ?? "ACTIVE",
      discountType: "FIXED_AMOUNT",
      discountValue: opts?.discountValue ?? 10,
      usageLimit: opts?.usageLimit === undefined ? null : opts.usageLimit,
      startsAt: opts?.startsAt ?? new Date(now - 60_000),
      expiresAt: opts?.expiresAt ?? new Date(now + 24 * 60 * 60 * 1000),
      isActive: opts?.isActive ?? true,
    },
  });
  tracker.couponIds.push(coupon.id);
  return coupon;
};

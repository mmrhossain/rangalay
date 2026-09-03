import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.ts";
import { checkout } from "../../src/modules/cart/cart.service.ts";
import { validateCouponCode } from "../../src/modules/coupon/coupon.service.ts";
import { AppError } from "../../src/common/errors/AppError.ts";
import {
  CleanupTracker,
  createActiveCartWithItem,
  createTestCoupon,
  createTestProduct,
  createTestUser,
  testAddress,
} from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  await tracker.cleanup();
});

const checkoutWithCoupon = async (
  customerProfileId: string,
  couponCode: string
) => {
  return checkout(customerProfileId, {
    paymentMethod: "COD",
    billingAddress: testAddress,
    couponCode,
  });
};

describe("Coupon redemption", () => {
  it("allows exactly one success for usageLimit:1 under concurrent redemption", async () => {
    const coupon = await createTestCoupon(tracker, { usageLimit: 1 });
    const catalog = await createTestProduct(tracker, { stock: 20, price: 100 });

    const users = await Promise.all(
      Array.from({ length: 5 }, (_, i) =>
        createTestUser(tracker, { suffix: `cp-${Date.now()}-${i}` })
      )
    );

    await Promise.all(
      users.map((u) =>
        createActiveCartWithItem(
          tracker,
          u.customerProfileId,
          catalog.variant,
          catalog.product.name,
          1
        )
      )
    );

    const results = await Promise.allSettled(
      users.map((u) => checkoutWithCoupon(u.customerProfileId, coupon.code))
    );

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(4);

    for (const r of fulfilled) {
      if (r.status === "fulfilled") tracker.orderIds.push(r.value.id);
    }

    const updated = await prisma.coupon.findUniqueOrThrow({
      where: { id: coupon.id },
    });
    expect(updated.usageCount).toBe(1);

    const usages = await prisma.couponUsage.count({
      where: { couponId: coupon.id },
    });
    expect(usages).toBe(1);
  });

  it("rejects expired coupon", async () => {
    const user = await createTestUser(tracker, { suffix: `ex-${Date.now()}` });
    const coupon = await createTestCoupon(tracker, {
      startsAt: new Date(Date.now() - 48 * 60 * 60 * 1000),
      expiresAt: new Date(Date.now() - 60_000),
    });

    await expect(
      validateCouponCode(coupon.code, user.customerProfileId, {
        subtotal: 100,
        productIds: [],
        productCategoryIds: [],
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Coupon is not valid at this time",
    } satisfies Partial<AppError>);
  });

  it("rejects inactive coupon", async () => {
    const user = await createTestUser(tracker, { suffix: `in-${Date.now()}` });
    const coupon = await createTestCoupon(tracker, {
      isActive: false,
      status: "DISABLED",
    });

    await expect(
      validateCouponCode(coupon.code, user.customerProfileId, {
        subtotal: 100,
        productIds: [],
        productCategoryIds: [],
      })
    ).rejects.toMatchObject({
      statusCode: 400,
      message: "Coupon is not active",
    } satisfies Partial<AppError>);
  });
});

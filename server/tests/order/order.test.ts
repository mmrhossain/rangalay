import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.ts";
import { checkout } from "../../src/modules/cart/cart.service.ts";
import {
  CleanupTracker,
  api,
  createActiveCartWithItem,
  createTestOrder,
  createTestProduct,
  createTestUser,
  testAddress,
} from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  await tracker.cleanup();
});

describe("Order checkout concurrency", () => {
  it("does not oversell a limited-stock variant", async () => {
    const catalog = await createTestProduct(tracker, { stock: 1, price: 100 });

    const users = await Promise.all([
      createTestUser(tracker, { suffix: `o1-${Date.now()}` }),
      createTestUser(tracker, { suffix: `o2-${Date.now()}` }),
    ]);

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
      users.map((u) =>
        checkout(u.customerProfileId, {
          paymentMethod: "COD",
          billingAddress: testAddress,
        })
      )
    );

    const fulfilled = results.filter((r) => r.status === "fulfilled");
    const rejected = results.filter((r) => r.status === "rejected");

    expect(fulfilled.length).toBe(1);
    expect(rejected.length).toBe(1);

    for (const r of fulfilled) {
      if (r.status === "fulfilled") tracker.orderIds.push(r.value.id);
    }

    const inventory = await prisma.inventory.findUniqueOrThrow({
      where: { id: catalog.inventory.id },
    });
    expect(inventory.quantityAvailable).toBe(0);
    expect(inventory.quantityReserved).toBe(1);
  });
});

describe("Order ownership", () => {
  it("returns 404 when fetching another user's order", async () => {
    const owner = await createTestUser(tracker, { suffix: `ow-${Date.now()}` });
    const other = await createTestUser(tracker, { suffix: `ot-${Date.now()}` });
    const order = await createTestOrder(tracker, owner);

    const res = await api()
      .get(`/api/v1/orders/${order.id}`)
      .set("Cookie", other.cookie);

    expect(res.status).toBe(404);
  });
});

describe("Order status transitions", () => {
  it("rejects invalid status transition", async () => {
    const admin = await createTestUser(tracker, {
      role: "ADMIN",
      suffix: `st-${Date.now()}`,
    });
    const customer = await createTestUser(tracker, {
      suffix: `sc-${Date.now()}`,
    });
    const order = await createTestOrder(tracker, customer, { status: "PENDING" });

    const res = await api()
      .patch(`/api/v1/admin/orders/${order.id}/status`)
      .set("Cookie", admin.cookie)
      .send({ status: "DELIVERED" });

    expect(res.status).toBe(400);
    expect(res.body.success).toBe(false);
    expect(String(res.body.message)).toMatch(/Invalid status transition/i);
  });
});

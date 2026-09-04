import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import {
  CleanupTracker,
  api,
  createTestProduct,
  createTestUser,
} from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  await tracker.cleanup();
});

const trackCart = (body: { data?: { id?: string } }) => {
  if (body?.data?.id) tracker.cartIds.push(body.data.id);
};

describe("Cart items", () => {
  it("adds an item and stores name/sku/price snapshot", async () => {
    const user = await createTestUser(tracker, { suffix: `ca-${Date.now()}` });
    const catalog = await createTestProduct(tracker, { stock: 10, price: 150 });

    const res = await api()
      .post("/api/v1/cart/items")
      .set("Cookie", user.cookie)
      .send({ variantId: catalog.variant.id, quantity: 2 });

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    trackCart(res.body);

    const item = res.body.data.items.find(
      (i: { variantId: string }) => i.variantId === catalog.variant.id
    );
    expect(item).toBeTruthy();
    expect(item.productName).toBe(catalog.product.name);
    expect(item.sku).toBe(catalog.variant.sku);
    expect(Number(item.unitPrice)).toBe(150);
    expect(item.quantity).toBe(2);
  });

  it("merges guest cart into the user cart after login", async () => {
    const catalog = await createTestProduct(tracker, { stock: 10, price: 80 });
    const sessionId = `guest-${randomUUID()}`;
    tracker.guestCartSessionIds.push(sessionId);

    const saved = await api()
      .put("/api/v1/cart/guest")
      .send({
        sessionId,
        cartData: { items: [{ variantId: catalog.variant.id, quantity: 3 }] },
      });
    expect(saved.status).toBe(200);

    const user = await createTestUser(tracker, { suffix: `mg-${Date.now()}` });

    const merged = await api()
      .post("/api/v1/cart/guest/merge")
      .set("Cookie", user.cookie)
      .send({ sessionId });

    expect(merged.status).toBe(200);
    trackCart(merged.body);

    const item = merged.body.data.items.find(
      (i: { variantId: string }) => i.variantId === catalog.variant.id
    );
    expect(item).toBeTruthy();
    expect(item.quantity).toBe(3);
    expect(item.sku).toBe(catalog.variant.sku);
  });

  it("rejects cart item update/delete scoped to another user", async () => {
    const catalog = await createTestProduct(tracker, { stock: 10, price: 50 });
    const owner = await createTestUser(tracker, { suffix: `own-${Date.now()}` });
    const other = await createTestUser(tracker, { suffix: `oth-${Date.now()}` });

    const added = await api()
      .post("/api/v1/cart/items")
      .set("Cookie", owner.cookie)
      .send({ variantId: catalog.variant.id, quantity: 1 });
    expect(added.status).toBe(200);
    trackCart(added.body);

    const updateRes = await api()
      .put(`/api/v1/cart/items/${catalog.variant.id}`)
      .set("Cookie", other.cookie)
      .send({ quantity: 2 });
    expect(updateRes.status).toBe(404);

    const deleteRes = await api()
      .delete(`/api/v1/cart/items/${catalog.variant.id}`)
      .set("Cookie", other.cookie);
    expect(deleteRes.status).toBe(404);
  });

  it("rejects quantity above available stock", async () => {
    const user = await createTestUser(tracker, { suffix: `st-${Date.now()}` });
    const catalog = await createTestProduct(tracker, { stock: 2, price: 40 });

    const res = await api()
      .post("/api/v1/cart/items")
      .set("Cookie", user.cookie)
      .send({ variantId: catalog.variant.id, quantity: 5 });

    expect(res.status).toBe(409);
    expect(res.body.success).toBe(false);
  });
});

import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.ts";
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

describe("Public catalog products", () => {
  it("GET /products returns only published products", async () => {
    const published = await createTestProduct(tracker, { price: 90 });
    const unpublished = await createTestProduct(tracker, { price: 91 });
    await prisma.product.update({
      where: { id: unpublished.product.id },
      data: { isPublished: false },
    });

    const pubRes = await api()
      .get("/api/v1/products")
      .query({ search: published.product.slug, limit: 100 });
    expect(pubRes.status).toBe(200);
    const pubIds = (pubRes.body.data.items as Array<{ id: string }>).map(
      (p) => p.id
    );
    expect(pubIds).toContain(published.product.id);

    const unpubRes = await api()
      .get("/api/v1/products")
      .query({ search: unpublished.product.slug, limit: 100 });
    expect(unpubRes.status).toBe(200);
    const unpubIds = (unpubRes.body.data.items as Array<{ id: string }>).map(
      (p) => p.id
    );
    expect(unpubIds).not.toContain(unpublished.product.id);
  });

  it("includeInactive=true is ignored for unauthenticated requests", async () => {
    const unpublished = await createTestProduct(tracker, { price: 70 });
    await prisma.product.update({
      where: { id: unpublished.product.id },
      data: { isPublished: false },
    });

    const res = await api()
      .get("/api/v1/products")
      .query({
        search: unpublished.product.slug,
        includeInactive: true,
        limit: 100,
      });

    expect(res.status).toBe(200);
    const ids = (res.body.data.items as Array<{ id: string }>).map((p) => p.id);
    expect(ids).not.toContain(unpublished.product.id);
  });
});

describe("Catalog authorization", () => {
  it("forbids product create without admin or vendor role", async () => {
    const customer = await createTestUser(tracker, {
      suffix: `cust-${Date.now()}`,
    });
    const catalog = await createTestProduct(tracker);

    const unauth = await api().post("/api/v1/admin/products").send({
      name: "Nope",
      slug: `nope-${randomUUID().slice(0, 8)}`,
      categoryId: catalog.category.id,
    });
    expect([401, 403]).toContain(unauth.status);

    const res = await api()
      .post("/api/v1/admin/products")
      .set("Cookie", customer.cookie)
      .send({
        name: "Nope",
        slug: `nope-${randomUUID().slice(0, 8)}`,
        categoryId: catalog.category.id,
      });
    expect(res.status).toBe(403);
  });

  it("rejects inventory adjustment from non-admin", async () => {
    const catalog = await createTestProduct(tracker, { stock: 5 });
    const customer = await createTestUser(tracker, {
      suffix: `invc-${Date.now()}`,
    });
    const vendor = await createTestUser(tracker, {
      role: "VENDOR",
      suffix: `invv-${Date.now()}`,
    });
    const admin = await createTestUser(tracker, {
      role: "ADMIN",
      suffix: `inva-${Date.now()}`,
    });

    const body = {
      warehouseId: catalog.warehouse.id,
      variantId: catalog.variant.id,
      difference: 1,
      reason: "test adjustment",
    };

    const customerRes = await api()
      .post("/api/v1/admin/inventory/adjustments")
      .set("Cookie", customer.cookie)
      .send(body);
    expect(customerRes.status).toBe(403);

    const vendorRes = await api()
      .post("/api/v1/admin/inventory/adjustments")
      .set("Cookie", vendor.cookie)
      .send(body);
    expect(vendorRes.status).toBe(403);

    const adminList = await api()
      .get("/api/v1/admin/inventory")
      .set("Cookie", admin.cookie);
    expect(adminList.status).toBe(200);
  });
});

describe("Category delete", () => {
  it("soft-deletes a category that has a child category", async () => {
    const admin = await createTestUser(tracker, {
      role: "ADMIN",
      suffix: `cat-${Date.now()}`,
    });
    const tag = randomUUID().slice(0, 8);

    const parent = await prisma.category.create({
      data: { name: `Parent ${tag}`, slug: `parent-${tag}`, isActive: true },
    });
    tracker.categoryIds.push(parent.id);

    const child = await prisma.category.create({
      data: {
        name: `Child ${tag}`,
        slug: `child-${tag}`,
        isActive: true,
        parentId: parent.id,
      },
    });
    tracker.categoryIds.push(child.id);

    const res = await api()
      .delete(`/api/v1/admin/categories/${parent.id}`)
      .set("Cookie", admin.cookie);

    expect(res.status).toBe(200);
    const deleted = await prisma.category.findUniqueOrThrow({
      where: { id: parent.id },
    });
    expect(deleted.deletedAt).not.toBeNull();

    const remainingChild = await prisma.category.findUniqueOrThrow({
      where: { id: child.id },
    });
    expect(remainingChild.deletedAt).toBeNull();
  });

  it("soft-deletes a category that still has products", async () => {
    const admin = await createTestUser(tracker, {
      role: "ADMIN",
      suffix: `catp-${Date.now()}`,
    });
    const catalog = await createTestProduct(tracker);

    const res = await api()
      .delete(`/api/v1/admin/categories/${catalog.category.id}`)
      .set("Cookie", admin.cookie);

    expect(res.status).toBe(200);
    const deleted = await prisma.category.findUniqueOrThrow({
      where: { id: catalog.category.id },
    });
    expect(deleted.deletedAt).not.toBeNull();
  });
});

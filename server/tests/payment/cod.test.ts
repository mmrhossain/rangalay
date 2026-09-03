import { afterEach, describe, expect, it } from "vitest";
import {
  CleanupTracker,
  api,
  createTestOrder,
  createTestUser,
} from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  await tracker.cleanup();
});

describe("COD initiate", () => {
  it("returns 401 without auth", async () => {
    const res = await api()
      .post("/api/v1/payments/00000000-0000-0000-0000-000000000001/initiate")
      .send({ method: "COD" });

    expect(res.status).toBe(401);
  });

  it("returns 404 for another user's order", async () => {
    const owner = await createTestUser(tracker, { suffix: `own-${Date.now()}` });
    const other = await createTestUser(tracker, { suffix: `oth-${Date.now()}` });
    const order = await createTestOrder(tracker, owner);

    const res = await api()
      .post(`/api/v1/payments/${order.id}/initiate`)
      .set("Cookie", other.cookie)
      .send({ method: "COD" });

    expect(res.status).toBe(404);
  });

  it("initiates COD for own order", async () => {
    const user = await createTestUser(tracker, { suffix: `cod-${Date.now()}` });
    const order = await createTestOrder(tracker, user);

    const res = await api()
      .post(`/api/v1/payments/${order.id}/initiate`)
      .set("Cookie", user.cookie)
      .send({ method: "COD" });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    expect(res.body.data.payment.method).toBe("COD");
    expect(res.body.data.payment.status).toBe("PENDING");
    tracker.paymentIds.push(res.body.data.payment.id);
  });
});

describe("COD collect", () => {
  it("returns 403 for non-admin", async () => {
    const user = await createTestUser(tracker, { suffix: `na-${Date.now()}` });
    const order = await createTestOrder(tracker, user);

    const initiated = await api()
      .post(`/api/v1/payments/${order.id}/initiate`)
      .set("Cookie", user.cookie)
      .send({ method: "COD" });

    expect(initiated.status).toBe(201);
    const paymentId = initiated.body.data.payment.id as string;
    tracker.paymentIds.push(paymentId);

    const res = await api()
      .post(`/api/v1/admin/payments/cod/${paymentId}/collect`)
      .set("Cookie", user.cookie);

    expect(res.status).toBe(403);
  });

  it("collects COD as admin", async () => {
    const user = await createTestUser(tracker, { suffix: `cu-${Date.now()}` });
    const admin = await createTestUser(tracker, {
      role: "ADMIN",
      suffix: `ad-${Date.now()}`,
    });
    const order = await createTestOrder(tracker, user);

    const initiated = await api()
      .post(`/api/v1/payments/${order.id}/initiate`)
      .set("Cookie", user.cookie)
      .send({ method: "COD" });

    expect(initiated.status).toBe(201);
    const paymentId = initiated.body.data.payment.id as string;
    tracker.paymentIds.push(paymentId);

    const res = await api()
      .post(`/api/v1/admin/payments/cod/${paymentId}/collect`)
      .set("Cookie", admin.cookie);

    expect(res.status).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data.status).toBe("COLLECTED");
  });
});

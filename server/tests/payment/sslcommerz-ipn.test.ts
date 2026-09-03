import { afterEach, describe, expect, it, vi } from "vitest";
import { prisma } from "../../src/lib/prisma.ts";
import { sslcommerzProvider } from "../../src/modules/payment/providers/sslcommerz.provider.ts";
import {
  CleanupTracker,
  api,
  createSslcommerzPayment,
  createTestOrder,
  createTestUser,
  signSslcommerzPayload,
} from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  vi.restoreAllMocks();
  await tracker.cleanup();
});

const mockVerify = (amount: number, tranId: string) => {
  vi.spyOn(sslcommerzProvider, "verifyTransaction").mockResolvedValue({
    valid: true,
    providerReference: tranId,
    transactionId: tranId,
    amount,
    currency: "BDT",
    raw: { status: "VALID", tran_id: tranId, amount: String(amount) },
  });
};

describe("SSLCommerz IPN", () => {
  it("rejects payload without signature", async () => {
    const res = await api()
      .post("/api/v1/payments/sslcommerz/ipn")
      .send({ val_id: "v1", tran_id: "t1" });

    expect(res.status).toBeGreaterThanOrEqual(400);
    expect(res.body.success).toBe(false);
  });

  it("rejects invalid signature", async () => {
    const res = await api()
      .post("/api/v1/payments/sslcommerz/ipn")
      .send({
        val_id: "v-bad",
        tran_id: "t-bad",
        verify_sign: "not-a-valid-md5-signature",
      });

    expect(res.status).toBe(401);
  });

  it("updates payment status on valid signature", async () => {
    const user = await createTestUser(tracker, { suffix: `ipn-${Date.now()}` });
    const order = await createTestOrder(tracker, user, { grandTotal: 100 });
    const payment = await createSslcommerzPayment(tracker, order.id, {
      amount: 100,
    });

    const valId = `VAL-${Date.now()}`;
    const unsigned: Record<string, string> = {
      val_id: valId,
      tran_id: payment.providerReference as string,
      status: "VALID",
      amount: "100.00",
    };
    const payload = {
      ...unsigned,
      verify_sign: signSslcommerzPayload(unsigned),
    };

    mockVerify(100, payment.providerReference as string);

    const res = await api()
      .post("/api/v1/payments/sslcommerz/ipn")
      .send(payload);

    expect(res.status).toBe(200);
    expect(res.body.data.alreadyProcessed).toBe(false);
    expect(res.body.data.payment.status).toBe("SUCCESS");

    const updated = await prisma.payment.findUniqueOrThrow({
      where: { id: payment.id },
    });
    expect(updated.status).toBe("SUCCESS");

    const log = await prisma.paymentWebhookLog.findFirst({
      where: { provider: "SSLCOMMERZ", externalEventId: valId },
    });
    if (log) tracker.webhookLogIds.push(log.id);
  });

  it("is idempotent for duplicate IPN events", async () => {
    const user = await createTestUser(tracker, { suffix: `dup-${Date.now()}` });
    const order = await createTestOrder(tracker, user, { grandTotal: 100 });
    const payment = await createSslcommerzPayment(tracker, order.id, {
      amount: 100,
    });

    const valId = `VAL-DUP-${Date.now()}`;
    const unsigned: Record<string, string> = {
      val_id: valId,
      tran_id: payment.providerReference as string,
      status: "VALID",
      amount: "100.00",
    };
    const payload = {
      ...unsigned,
      verify_sign: signSslcommerzPayload(unsigned),
    };

    mockVerify(100, payment.providerReference as string);

    const first = await api()
      .post("/api/v1/payments/sslcommerz/ipn")
      .send(payload);
    expect(first.status).toBe(200);
    expect(first.body.data.alreadyProcessed).toBe(false);

    const second = await api()
      .post("/api/v1/payments/sslcommerz/ipn")
      .send(payload);
    expect(second.status).toBe(200);
    expect(second.body.data.alreadyProcessed).toBe(true);

    const events = await prisma.paymentEvent.findMany({
      where: { paymentId: payment.id, eventType: "PAYMENT_SUCCESS" },
    });
    expect(events.length).toBe(1);

    const log = await prisma.paymentWebhookLog.findFirst({
      where: { provider: "SSLCOMMERZ", externalEventId: valId },
    });
    if (log) tracker.webhookLogIds.push(log.id);
  });
});

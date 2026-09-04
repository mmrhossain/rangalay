import { randomUUID } from "node:crypto";
import { afterEach, describe, expect, it } from "vitest";
import { prisma } from "../../src/lib/prisma.ts";
import { CleanupTracker, api, createTestUser } from "../helpers/index.ts";

const tracker = new CleanupTracker();

afterEach(async () => {
  await tracker.cleanup();
});

const uniqueEmail = (prefix: string) =>
  `${prefix}-${randomUUID().slice(0, 8)}@example.test`;

const trackUserByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({ where: { email } });
  if (user) tracker.userIds.push(user.id);
  return user;
};

describe("Auth sign-up and sign-in", () => {
  it("sign-up is verification-pending and does not issue a session token", async () => {
    const email = uniqueEmail("signup");
    const res = await api()
      .post("/api/v1/auth/sign-up/email")
      .send({ name: "Signup User", email, password: "Password1!" });

    await trackUserByEmail(email);

    expect(res.status).toBeLessThan(400);
    expect(res.body.token ?? null).toBeNull();

    const user = await prisma.user.findUniqueOrThrow({ where: { email } });
    expect(user.emailVerified).toBe(false);
  });

  it("verified user sign-in returns a session token", async () => {
    const email = uniqueEmail("signin");
    const password = "Password1!";

    const signup = await api()
      .post("/api/v1/auth/sign-up/email")
      .send({ name: "Verified User", email, password });
    expect(signup.status).toBeLessThan(400);
    await trackUserByEmail(email);

    await prisma.user.update({
      where: { email },
      data: { emailVerified: true },
    });

    const res = await api()
      .post("/api/v1/auth/sign-in/email")
      .send({ email, password });

    expect(res.status).toBe(200);
    expect(res.body.token).toBeTruthy();
    expect(res.body.user?.email ?? email).toBe(email);
  });

  it("unverified user sign-in returns 403 EMAIL_NOT_VERIFIED", async () => {
    const email = uniqueEmail("unverified");
    const password = "Password1!";

    const signup = await api()
      .post("/api/v1/auth/sign-up/email")
      .send({ name: "Unverified User", email, password });
    expect(signup.status).toBeLessThan(400);
    await trackUserByEmail(email);

    const res = await api()
      .post("/api/v1/auth/sign-in/email")
      .send({ email, password });

    expect(res.status).toBe(403);
    const payload = JSON.stringify(res.body);
    expect(payload).toMatch(/EMAIL_NOT_VERIFIED/i);
  });
});

describe("Vendor approval", () => {
  it("unapproved vendor cannot access restricted admin routes", async () => {
    const vendor = await createTestUser(tracker, {
      role: "VENDOR",
      isApproved: false,
      suffix: `vend-${Date.now()}`,
    });

    const res = await api()
      .post("/api/v1/admin/categories")
      .set("Cookie", vendor.cookie)
      .send({
        name: `Blocked Cat ${randomUUID().slice(0, 8)}`,
        slug: `blocked-cat-${randomUUID().slice(0, 8)}`,
      });

    expect(res.status).toBe(403);
  });

  it("approved vendor can access restricted routes after admin approval", async () => {
    const vendor = await createTestUser(tracker, {
      role: "VENDOR",
      isApproved: false,
      suffix: `vap-${Date.now()}`,
    });

    const blocked = await api()
      .post("/api/v1/admin/categories")
      .set("Cookie", vendor.cookie)
      .send({
        name: `Preapprove Cat ${randomUUID().slice(0, 8)}`,
        slug: `preapprove-cat-${randomUUID().slice(0, 8)}`,
      });
    expect(blocked.status).toBe(403);

    const approved = await prisma.user.update({
      where: { id: vendor.id },
      data: { isApproved: true },
      select: { id: true, isApproved: true },
    });
    expect(approved.isApproved).toBe(true);

    const tag = randomUUID().slice(0, 8);
    const res = await api()
      .post("/api/v1/admin/categories")
      .set("Cookie", vendor.cookie)
      .send({ name: `Approved Cat ${tag}`, slug: `approved-cat-${tag}` });

    expect(res.status).toBe(201);
    expect(res.body.success).toBe(true);
    if (res.body.data?.id) tracker.categoryIds.push(res.body.data.id);
  });
});

import { auth } from "../src/lib/auth.ts";
import { prisma } from "../src/lib/prisma.ts";

const ROLES = ["CUSTOMER", "ADMIN", "VENDOR"] as const;

async function main() {
  const adminEmail = process.env.SEED_ADMIN_EMAIL ?? process.env.ADMIN_EMAIL;
  const adminPassword = process.env.SEED_ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error(
      "SEED_ADMIN_EMAIL (or ADMIN_EMAIL) and SEED_ADMIN_PASSWORD are required"
    );
  }

  if (adminPassword.length < 8) {
    throw new Error("SEED_ADMIN_PASSWORD must be at least 8 characters");
  }

  let user = await prisma.user.findUnique({ where: { email: adminEmail } });

  if (!user) {
    const result = await auth.api.signUpEmail({
      body: {
        email: adminEmail,
        password: adminPassword,
        name: "Admin",
      },
    });

    const createdId = result.user?.id;
    if (!createdId) {
      throw new Error("Better Auth signUpEmail did not return a user id");
    }

    user = await prisma.user.update({
      where: { id: createdId },
      data: {
        role: "ADMIN",
        emailVerified: true,
        isApproved: true,
      },
    });

    console.log(`[seed] admin user created: ${adminEmail}`);
  } else {
    await prisma.user.update({
      where: { id: user.id },
      data: {
        role: "ADMIN",
        emailVerified: true,
        isApproved: true,
      },
    });
    console.log(`[seed] admin user already exists: ${adminEmail}`);
  }

  console.log("[seed] roles ready:", ROLES.join(", "));
}

main()
  .catch((err) => {
    console.error("[seed] failed:", err);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

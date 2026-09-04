import { env } from "../config/env";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client";
import type { Prisma } from "../generated/prisma/client";

const connectionString = env.DATABASE_URL;

if (!env.DATABASE_URL) {
  throw new Error("DATABASE_URL is not defined");
}

const looksPooled =
  /[-.]pooler\./i.test(connectionString) ||
  /(?:[?&])pgbouncer=true/i.test(connectionString);

if (!looksPooled) {
  console.info(
    "[prisma] DATABASE_URL does not look like a Neon pooled/pgbouncer endpoint. Use the pooler connection string for workers/backends to reduce connection pressure."
  );
}

const adapter = new PrismaPg({
  connectionString,
  max: 5,
  connectionTimeoutMillis: 15_000,
  idleTimeoutMillis: 30_000,
  keepAlive: true,
});

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

export type TransactionClient = Prisma.TransactionClient;

export const transaction = <T>(
  fn: (tx: TransactionClient) => Promise<T>,
  options?: { isolationLevel?: Prisma.TransactionIsolationLevel }
): Promise<T> => {
  return prisma.$transaction(fn, {
    maxWait: env.NODE_ENV === "test" ? 20_000 : 2_000,
    timeout: env.NODE_ENV === "test" ? 30_000 : 5_000,
    ...options,
  });
};

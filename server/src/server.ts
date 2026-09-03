import app from "./app.ts";
import { env } from "./config/env.ts";
import { prisma } from "./lib/prisma.ts";
import { redis } from "./lib/redis.ts";
import {
  startNotificationWorker,
  stopNotificationWorker,
} from "./modules/notification/worker/notification.worker.ts";

const server = app.listen(env.PORT, () => {
  console.log(`Server running on port ${env.PORT}`);
});

startNotificationWorker();

const FORCE_EXIT_MS = 10_000;
let shuttingDown = false;

const shutdown = (signal: string) => {
  if (shuttingDown) return;
  shuttingDown = true;

  console.log(`${signal} received`);
  stopNotificationWorker();

  const forceTimer = setTimeout(() => {
    console.error("Forced shutdown after timeout");
    process.exit(1);
  }, FORCE_EXIT_MS);
  forceTimer.unref?.();

  server.close(async () => {
    try {
      await prisma.$disconnect();
    } catch (err) {
      console.error("Prisma disconnect failed", err);
    }

    try {
      if (redis) await redis.quit();
    } catch (err) {
      console.error("Redis quit failed", err);
    }

    process.exit(0);
  });
};

process.on("SIGTERM", () => shutdown("SIGTERM"));
process.on("SIGINT", () => shutdown("SIGINT"));

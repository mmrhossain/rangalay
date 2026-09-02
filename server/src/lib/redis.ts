import Redis from "ioredis";
import { env } from "../config/env.ts";
import { logger } from "../common/utils/logger.ts";

const globalForRedis = globalThis as unknown as {
  redis: Redis | null | undefined;
};

const MAX_RETRY_ATTEMPTS = 3;

function isRedisUrl(value: string): boolean {
  return value.startsWith("redis://") || value.startsWith("rediss://");
}

function createRedisClient(): Redis | null {
  const url = env.REDIS_URL;

  if (!url || !isRedisUrl(url)) {
    if (url) {
      logger.warn("REDIS_URL is not a redis:// or rediss:// URL; Redis disabled");
    }
    return null;
  }

  try {
    const useTls = url.startsWith("rediss://");
    let errorLogged = false;

    const client = new Redis(url, {
      maxRetriesPerRequest: 1,
      enableOfflineQueue: true,
      connectTimeout: 10_000,
      retryStrategy: (times) => {
        if (times > MAX_RETRY_ATTEMPTS) {
          return null;
        }
        return Math.min(500 * 2 ** (times - 1), 4000);
      },
      ...(useTls ? { tls: {} } : {}),
    });

    client.on("error", (err) => {
      if (!errorLogged) {
        errorLogged = true;
        logger.warn(`Redis connection error: ${err.message}`);
      }
    });

    client.on("ready", () => {
      logger.info("Redis connected");
    });

    return client;
  } catch (err) {
    logger.warn(`Redis client creation failed: ${(err as Error).message}`);
    return null;
  }
}

export const redis = (() => {
  if (globalForRedis.redis === undefined) {
    globalForRedis.redis = createRedisClient();
  }
  return globalForRedis.redis;
})();

export async function redisGet(key: string): Promise<string | null> {
  if (!redis) return null;
  try {
    return await redis.get(key);
  } catch (err) {
    logger.warn(`Redis get failed (${key}): ${(err as Error).message}`);
    return null;
  }
}

export async function redisSet(
  key: string,
  value: string,
  ttlSeconds: number
): Promise<void> {
  if (!redis) return;
  try {
    await redis.set(key, value, "EX", ttlSeconds);
  } catch (err) {
    logger.warn(`Redis set failed (${key}): ${(err as Error).message}`);
  }
}

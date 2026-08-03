import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

const hasRedisConfig =
  !!process.env.UPSTASH_REDIS_REST_URL && !!process.env.UPSTASH_REDIS_REST_TOKEN;

const redis = hasRedisConfig
  ? new Redis({
      url: process.env.UPSTASH_REDIS_REST_URL!,
      token: process.env.UPSTASH_REDIS_REST_TOKEN!,
    })
  : null;

// 30 requests per 60 seconds per identifier (IP or user id).
const ratelimit = redis
  ? new Ratelimit({
      redis,
      limiter: Ratelimit.slidingWindow(30, "60 s"),
      analytics: true,
      prefix: "krishi-tractor",
    })
  : null;

export async function checkRateLimit(identifier: string): Promise<{ success: boolean }> {
  // Set RATE_LIMIT_FAIL_CLOSED=true only when Upstash is guaranteed to be configured.
  const failClosed = process.env.RATE_LIMIT_FAIL_CLOSED === "true";

  // Without Redis configured, skip rate limiting by default so auth does not
  // become unavailable in production due to missing Upstash env vars.
  if (!ratelimit) {
    if (process.env.NODE_ENV === "production" && failClosed) {
      console.error("Rate limiting is not configured in production and RATE_LIMIT_FAIL_CLOSED=true.");
      return { success: false };
    }

    if (process.env.NODE_ENV === "production") {
      console.warn("Rate limiting is not configured in production. Continuing without rate limiting.");
    }

    return { success: true };
  }

  const { success } = await ratelimit.limit(identifier);
  return { success };
}

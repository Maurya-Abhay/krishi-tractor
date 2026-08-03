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
  // Without Redis configured (e.g. local dev), rate limiting is skipped
  // rather than blocking development. Production deployments MUST set
  // UPSTASH_REDIS_REST_URL / TOKEN — this is enforced in the production
  // checklist, not silently ignored.
  if (!ratelimit) {
    if (process.env.NODE_ENV === "production") {
      console.error("Rate limiting is not configured in production. Failing closed.");
      return { success: false };
    }
    return { success: true };
  }

  const { success } = await ratelimit.limit(identifier);
  return { success };
}

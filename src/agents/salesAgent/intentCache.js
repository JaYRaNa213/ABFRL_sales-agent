import { redis } from "../../config/redis.js";

export async function getCachedIntent(sessionId, message) {
  const key = `intent:${sessionId}`;
  const cached = await redis.get(key);
  return cached;
}

export async function cacheIntent(sessionId, intent) {
  const key = `intent:${sessionId}`;
  await redis.set(key, intent, "EX", 300); 
}

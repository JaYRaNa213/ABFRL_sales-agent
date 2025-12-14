import { redis } from "../config/redis.js";
import { createInitialContext } from "./contextSchema.js";

const TTL = 60 * 30; // 30 minutes

export async function getSession(sessionId, channel) {
  const key = `session:${sessionId}`;

  const data = await redis.get(key);
  if (data) return JSON.parse(data);

  const context = createInitialContext({ sessionId, channel });
  await redis.set(key, JSON.stringify(context), "EX", TTL);
  return context;
}

export async function updateSession(sessionId, context) {
  const key = `session:${sessionId}`;
  await redis.set(key, JSON.stringify(context), "EX", TTL);
}

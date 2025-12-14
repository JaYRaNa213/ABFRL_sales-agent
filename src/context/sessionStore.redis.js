
import dotenv from 'dotenv';
dotenv.config();

import { redis } from "../config/redis.js";
import { createInitialContext } from "./contextSchema.js";

const TTL = 60 * 30; // 30 minutes

export async function getSession(sessionId, channel) {
  const key = `session:${sessionId}`;

  const data = await redis.get(key);
  if (data) {
    const context = JSON.parse(data);
    // ensure channel persists
    context.channel = context.channel || channel;
    return context;
  }

  const context = createInitialContext({ sessionId, channel });
  context.stage = "INIT";
  context.updatedAt = Date.now();

  await redis.set(key, JSON.stringify(context), "EX", TTL);
  return context;
}

export async function updateSession(sessionId, context) {
  const key = `session:${sessionId}`;
  context.updatedAt = Date.now();
  await redis.set(key, JSON.stringify(context), "EX", TTL);
}

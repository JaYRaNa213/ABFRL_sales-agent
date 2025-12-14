
import { redis } from "../config/redis.js";

const redis = new Redis(process.env.REDIS_URL, {
  tls: {}, // ensures TLS is used
});

async function test() {
  try {
    await redis.set("test", "connected");
    const value = await redis.get("test");
    console.log("Redis test value:", value);
    process.exit(0);
  } catch (err) {
    console.error("Redis connection error:", err);
    process.exit(1);
  }
}

test();

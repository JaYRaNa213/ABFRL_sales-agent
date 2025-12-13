import { createInitialContext } from "./contextSchema.js";

const sessions = new Map();

export function getSession(sessionId, channel) {
  if (!sessions.has(sessionId)) {
    sessions.set(sessionId, createInitialContext({ sessionId, channel }));
  }
  return sessions.get(sessionId);
}

export function updateSession(sessionId, context) {
  sessions.set(sessionId, context);
}

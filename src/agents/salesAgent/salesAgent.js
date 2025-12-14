import { buildResponse } from "./responseBuilder.js";

import { recommendationAgent } from "../recommendationAgent/recommendationAgent.js";
import { inventoryAgent } from "../inventoryAgent/inventoryAgent.js";
import { loyaltyAgent } from "../loyaltyAgent/loyaltyAgent.js";
import { paymentAgent } from "../paymentAgent/paymentAgent.js";
import { fulfillmentAgent } from "../fulfillmentAgent/fulfillmentAgent.js";
import { postPurchaseAgent } from "../postPurchaseAgent/postPurchaseAgent.js";

import { detectIntentLLM } from "./intentDetector.llm.js";
import { getCachedIntent, cacheIntent } from "./intentCache.js";

export async function salesAgent(message, context) {
  // -------------------------------------------------
  // 0️⃣ ENTERPRISE CONTEXT NORMALIZATION (CRITICAL)
  // -------------------------------------------------
  context.conversationHistory = context.conversationHistory || [];
  context.cart = context.cart || [];
  context.stage = context.stage || "DISCOVERY";
  context.intent = context.intent || null;
  context.sessionId = context.sessionId || "unknown";
  context.channel = context.channel || "web";

  // -------------------------------------------------
  // 1️⃣ Store Conversation Safely
  // -------------------------------------------------
  context.conversationHistory.push({
    role: "user",
    message,
    timestamp: new Date().toISOString()
  });

  context.lastMessage = message;

  // -------------------------------------------------
  // 2️⃣ Prompt Injection Guard (Security)
  // -------------------------------------------------
  const lowerMessage = message.toLowerCase();
  if (
    lowerMessage.includes("ignore previous") ||
    lowerMessage.includes("system prompt") ||
    lowerMessage.includes("act as admin")
  ) {
    return buildResponse(
      "Sorry, I can’t help with that request.",
      context
    );
  }

  // -------------------------------------------------
  // 3️⃣ Intent Detection (Cached First)
  // -------------------------------------------------
  let intent = await getCachedIntent(context.sessionId);

  if (!intent) {
    intent = await detectIntentLLM(message);
    await cacheIntent(context.sessionId, intent);
  }

  context.intent = intent;

  // -------------------------------------------------
  // 4️⃣ Stage Guard (Enterprise Flow Control)
  // -------------------------------------------------
  if (context.stage === "PAYMENT" && intent !== "checkout") {
    return buildResponse(
      "You're already in checkout. Shall I complete the payment?",
      context
    );
  }

  let result;

  // -------------------------------------------------
  // 5️⃣ Intent Router → Specialized Agents
  // -------------------------------------------------
  switch (intent) {
    case "product_discovery":
      context.stage = "DISCOVERY";
      result = await recommendationAgent(context);
      return buildResponse(
        `I found some great options for you. ${result.summary}`,
        context
      );

    case "check_inventory":
      context.stage = "DISCOVERY";
      result = await inventoryAgent(context);
      return buildResponse(
        `Here’s the availability update: ${result.summary}`,
        context
      );

    case "apply_offer":
      context.stage = "CART";
      result = await loyaltyAgent(context);
      return buildResponse(
        `Good news! I’ve applied the best offers. You save ₹${result.savings}`,
        context
      );

    case "checkout":
      context.stage = "PAYMENT";
      result = await paymentAgent(context);

      if (result.status === "success") {
        context.stage = "SUCCESS";
        context.paymentStatus = "PAID";

        await fulfillmentAgent(context);

        return buildResponse(
          "Payment successful! Your order is confirmed.",
          context
        );
      }

      return buildResponse(
        "Payment failed. Would you like to try another method?",
        context
      );

    case "post_purchase":
      context.stage = "SUPPORT";
      result = await postPurchaseAgent(context);
      return buildResponse(result.summary, context);

    default:
      return buildResponse(
        "Sure! Tell me what you are shopping for today.",
        context
      );
  }
}

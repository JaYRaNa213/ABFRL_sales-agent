import { detectIntent } from "./intentDetector.js";
import { buildResponse } from "./responseBuilder.js";

import { recommendationAgent } from "../recommendationAgent/recommendationAgent.js";
import { inventoryAgent } from "../inventoryAgent/inventoryAgent.js";
import { loyaltyAgent } from "../loyaltyAgent/loyaltyAgent.js";
import { paymentAgent } from "../paymentAgent/paymentAgent.js";
import { fulfillmentAgent } from "../fulfillmentAgent/fulfillmentAgent.js";
import { postPurchaseAgent } from "../postPurchaseAgent/postPurchaseAgent.js";

import { detectIntentLLM } from "./intentDetector.llm.js";

export async function salesAgent(message, context) {
  context.conversationHistory.push({ role: "user", message });

  const intent = detectIntentLLM(message);
  context.intent = intent;

  let result;

  switch (intent) {
    case "product_discovery":
      result = await recommendationAgent(context);
      return buildResponse(
        `I found some great options for you. ${result.summary}`,
        context
      );

    case "check_inventory":
      result = await inventoryAgent(context);
      return buildResponse(
        `Here’s the availability update: ${result.summary}`,
        context
      );

    case "apply_offer":
      result = await loyaltyAgent(context);
      return buildResponse(
        `Good news! I’ve applied the best offers. You save ₹${result.savings}`,
        context
      );

    case "checkout":
      result = await paymentAgent(context);
      if (result.status === "success") {
        await fulfillmentAgent(context);
        return buildResponse(
          "Payment successful! Your order is confirmed.",
          context
        );
      } else {
        return buildResponse(
          "Payment failed. Would you like to try another method?",
          context
        );
      }

    case "post_purchase":
      result = await postPurchaseAgent(context);
      return buildResponse(result.summary, context);

    default:
      return buildResponse(
        "Sure! Tell me what you’re shopping for today.",
        context
      );
  }
}

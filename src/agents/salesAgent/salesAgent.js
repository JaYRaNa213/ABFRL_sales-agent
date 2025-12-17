import { buildResponse } from "./responseBuilder.js";
import { detectIntentLLM } from "./intentDetector.llm.js";

import { recommendationAgent } from "../recommendationAgent/recommendationAgent.js";
import { inventoryAgent } from "../inventoryAgent/inventoryAgent.js";
import { loyaltyAgent } from "../loyaltyAgent/loyaltyAgent.js";
import { paymentAgent } from "../paymentAgent/paymentAgent.js";
import { fulfillmentAgent } from "../fulfillmentAgent/fulfillmentAgent.js";
import { postPurchaseAgent } from "../postPurchaseAgent/postPurchaseAgent.js";

import { SALES_PERSONA_PROMPT } from "./persona.js";
import { runLLM } from "../../llm/llmClient.js";

export async function salesAgent(message, context) {
  context.lastMessage = message;
  context.conversationHistory.push({ role: "user", message });

  // 1️⃣ Detect intent
  const intent = await detectIntentLLM(message);
  context.intent = intent;

  // 2️⃣ Orchestration log
  context.orchestration.push({
    step: "IntentDetection",
    intent,
    time: Date.now()
  });

  let agentResult = {};
  let systemAction = "";

  switch (intent) {
    case "product_discovery":
      systemAction = "Product Discovery";
      context.orchestration.push({ agent: "RecommendationAgent" });
      agentResult = await recommendationAgent(context);

      context.orchestration.push({ agent: "InventoryAgent" });
      await inventoryAgent(context);

      break;

    case "apply_offer":
      context.orchestration.push({ agent: "LoyaltyAgent" });
      agentResult = await loyaltyAgent(context);
      break;

    case "select_product":
      // User picked a product (e.g. "I like the black shoes")
      // Logic: If context.products exists, try to find the one user mentioned OR simply keep the first one/most relevant
      if (context.products && context.products.length > 0) {
        // SIMPLIFICATION: If user says "the leather one", we ideally use an Entity Extractor.
        // For now, we assume the user is refining the list.
        // Let's keep the Top 1 as the "Selected" one for the flow.
        context.products = [context.products[0]];
        context.action = "PRODUCT_SELECTED";
      }
      break;

    case "add_to_cart":
      context.action = "add_to_cart"; // Tell Inventory Agent what to do
      context.orchestration.push({ agent: "InventoryAgent", action: "add" });
      await inventoryAgent(context);
      break;

    case "checkout":
      context.orchestration.push({ agent: "PaymentAgent" });
      agentResult = await paymentAgent(context);

      if (agentResult.status === "success") {
        context.orchestration.push({ agent: "FulfillmentAgent" });
        await fulfillmentAgent(context);
        agentResult.fulfillment = context.fulfillment; // Pass to persona
      }
      break;

    case "post_purchase":
      context.orchestration.push({ agent: "PostPurchaseAgent" });
      agentResult = await postPurchaseAgent(context);
      break;

    default:
      systemAction = "General Assistance";
  }

  // 3️⃣ Persona response
  const personaResponse = await runLLM({
    systemPrompt: SALES_PERSONA_PROMPT,
    userPrompt: `
User: ${message}
Intent: ${intent}
InputMode: ${context.inputMode}
Context: ${JSON.stringify(agentResult)}
`,
    temperature: context.inputMode === "voice" ? 0.8 : 0.3
  });

  context.conversationHistory.push({
    role: "assistant",
    message: personaResponse
  });

  return buildResponse(personaResponse, context);
}

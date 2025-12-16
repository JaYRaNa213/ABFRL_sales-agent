import { buildResponse } from "./responseBuilder.js";

import { recommendationAgent } from "../recommendationAgent/recommendationAgent.js";
import { inventoryAgent } from "../inventoryAgent/inventoryAgent.js";
import { loyaltyAgent } from "../loyaltyAgent/loyaltyAgent.js";
import { paymentAgent } from "../paymentAgent/paymentAgent.js";
import { fulfillmentAgent } from "../fulfillmentAgent/fulfillmentAgent.js";
import { postPurchaseAgent } from "../postPurchaseAgent/postPurchaseAgent.js";

import { detectIntentLLM } from "./intentDetector.llm.js";
import { getCachedIntent, cacheIntent } from "./intentCache.js";

import { SALES_PERSONA_PROMPT } from "./persona.js";
import { runLLM } from "../../llm/llmClient.js";

async function generatePersonaResponse(userMessage, systemAction, dataContext, intent, channel, language) {
  const dataString = JSON.stringify(dataContext, null, 2);
  const prompt = `
    User Message: "${userMessage}"
    System Action Performed: "${systemAction}"
    Data Context: ${dataString}
    Intent Detected: "${intent}"
    Channel: "${channel}"
    Language: "${language}"

    Based on the "System Action Performed" and "Data Context", generate a response to the user following your core behavior rules.
    Do NOT mention "JSON" or "data context" or "system action".
    IMPORTANT: If there are products in the data context, do NOT list them in the text response. The user will see visual cards. Just introduce them briefly (e.g., "Here are some great options for you:").
    Speak natural English as a helpful sales associate.
    NOTE: If Channel is "voice", ensure you follow the Voice-specific rules strictly.
  `;

  return await runLLM({
    systemPrompt: SALES_PERSONA_PROMPT,
    userPrompt: prompt,
    temperature: 0.7
  });
}

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
  context.language = context.language || "en-IN";
  context.offersApplied = context.offersApplied || [];

  // -------------------------------------------------
  // Channel Normalization for Persona
  // -------------------------------------------------
  const normalizedChannel = context.channel === "voice" ? "voice" : "text"; // Treat web/whatsapp as text

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
  // 3️⃣ Intent Detection (Fresh on every turn)
  // -------------------------------------------------

  let intent = await detectIntentLLM(message);

  context.intent = intent;

  // -------------------------------------------------
  // 4️⃣ Stage Guard (Enterprise Flow Control)
  // -------------------------------------------------
  if (context.stage === "PAYMENT" && intent !== "checkout") {
    const response = await generatePersonaResponse(message, "User tried to switch context during payment", {}, intent, normalizedChannel, context.language);
    return buildResponse(response, context);
  }

  let result;
  let finalResponseText = "";

  // -------------------------------------------------
  // 5️⃣ Intent Router → Specialized Agents
  // -------------------------------------------------
  switch (intent) {
    case "product_discovery":
      context.stage = "DISCOVERY";
      result = await recommendationAgent(context);
      console.log("DEBUG: recommendationAgent result:", JSON.stringify(result, null, 2));

      // Strict Protocol: If products found, send JSON payload ONLY (no text chatter)
      if (result.products && result.products.length > 0) {
        context.products = result.products;
        context.action = "SHOW_PRODUCTS";
        context.target = "AgentPanel";
        context.layout = "cards";
        // Generate response based on channel (text = concise, voice = conversational)
        finalResponseText = await generatePersonaResponse(message, "Product Discovery - Products Found", result, intent, normalizedChannel, context.language);

      } else {
        // Fallback to text if no products found
        context.products = [];
        finalResponseText = await generatePersonaResponse(message, "Product Discovery - No results found", result, intent, normalizedChannel, context.language);
      }
      break;

    case "check_inventory":
      context.stage = "DISCOVERY";
      result = await inventoryAgent(context);
      console.log("DEBUG: inventoryAgent result:", JSON.stringify(result, null, 2));

      if (result.products && result.products.length > 0) {
        context.products = result.products;
        context.action = "SHOW_PRODUCTS";
        context.target = "AgentPanel";
        context.layout = "cards";
        // Generate response based on channel (text = concise, voice = conversational)
        finalResponseText = await generatePersonaResponse(message, "Inventory Check - Products Available", result, intent, normalizedChannel, context.language);
      } else {
        context.products = [];
        finalResponseText = await generatePersonaResponse(message, "Inventory Check Result", result, intent, normalizedChannel, context.language);
      }
      break;

    case "apply_offer":
      context.stage = "CART";
      result = await loyaltyAgent(context);
      context.products = []; // Clear products on other actions usually
      finalResponseText = await generatePersonaResponse(message, "Applied Offers", result, intent, normalizedChannel, context.language);
      break;

    case "checkout":
      // context.stage = "PAYMENT";
      // result = await paymentAgent(context);
      // context.products = [];
      // if (result.status === "success") {
      //   context.stage = "SUCCESS";
      //   context.paymentStatus = "PAID";
      //   // await fulfillmentAgent(context);
      //   finalResponseText = await generatePersonaResponse(message, "Payment Successful", result, intent, context.channel, context.language);
      // } else {
      //   finalResponseText = await generatePersonaResponse(message, "Payment Failed", result, intent, context.channel, context.language);
      // }
      break;

    case "post_purchase":
      context.stage = "SUPPORT";
      result = await postPurchaseAgent(context);
      context.products = [];
      finalResponseText = await generatePersonaResponse(message, "Post Purchase Support", result, intent, normalizedChannel, context.language);
      break;

    case "general_query":
      context.stage = "DISCOVERY";
      context.products = [];
      finalResponseText = await generatePersonaResponse(message, "General Query / Greeting", {}, intent, normalizedChannel, context.language);
      break;

    default:
      context.products = [];
      console.log("DEBUG: Default case, no products"); // DEBUG LOG
      finalResponseText = await generatePersonaResponse(message, "Unknown Intent / Default Greeting", {}, intent, normalizedChannel, context.language);
      break;
  }

  // Store bot response in history
  context.conversationHistory.push({
    role: "assistant",
    message: finalResponseText,
    timestamp: new Date().toISOString()
  });


  return buildResponse(finalResponseText, context);


}

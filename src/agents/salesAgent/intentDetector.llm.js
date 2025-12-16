import { runLLM } from "../../llm/llmClient.js";
import { detectIntent } from "./intentDetector.js";

const SYSTEM_PROMPT = `
You are a retail sales AI.
Classify the user's intent into ONE of these:
- product_discovery
- check_inventory
- apply_offer
- checkout
- post_purchase
- general_query

Return ONLY the intent string.
`;

export async function detectIntentLLM(message) {
  try {
    const intent = await runLLM({
      systemPrompt: SYSTEM_PROMPT,
      userPrompt: message,
      temperature: 0,
      maxTokens: 20,
    });

    // Safety check
    if (!intent || typeof intent !== "string") {
      throw new Error("Invalid LLM intent response");
    }

    const cleaned = intent.trim().toLowerCase();

if (cleaned.includes("product")) return "product_discovery";
if (cleaned.includes("inventory")) return "check_inventory";
if (cleaned.includes("checkout")) return "checkout";
if (cleaned.includes("offer")) return "apply_offer";
if (cleaned.includes("post")) return "post_purchase";

return "general_query";

  } catch (error) {
    console.warn("⚠️ LLM intent detection failed. Falling back to rule-based intent.");

    // ✅ Enterprise fallback (NEVER fail the agent)
    return detectIntent(message);
  }
}

import { runLLM } from "../../llm/llmClient.js";

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
  const intent = await runLLM({
    systemPrompt: SYSTEM_PROMPT,
    userPrompt: message,
    temperature: 0,
    maxTokens: 20,
  });

  return intent.trim();
}

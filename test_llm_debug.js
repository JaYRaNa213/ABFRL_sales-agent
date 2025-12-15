import { runLLM } from "./src/llm/llmClient.js";

async function test() {
  console.log("Testing LLM...");
  const res = await runLLM({
    systemPrompt: "You are a helper.",
    userPrompt: "Hello how are you ?",
  });
  console.log("Result:", res);
}

test();

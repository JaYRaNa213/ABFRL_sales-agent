import dotenv from 'dotenv';
dotenv.config();


import OpenAI from "openai";

if (!process.env.OPENAI_API_KEY) {
  throw new Error("⚠️ OPENAI_API_KEY is missing. Make sure your .env is loaded correctly.");
}

const client = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function runLLM({ systemPrompt, userPrompt, temperature = 0.3, maxTokens = 200 }) {
  const response = await client.chat.completions.create({
    model: "gpt-4o-mini",
    temperature,
    max_tokens: maxTokens,
    messages: [
      { role: "system", content: systemPrompt },
      { role: "user", content: userPrompt },
    ],
  });

  return response.choices[0].message.content;
}

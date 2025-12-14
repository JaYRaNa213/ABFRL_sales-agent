// import dotenv from 'dotenv';
// dotenv.config();


// import OpenAI from "openai";

// if (!process.env.OPENAI_API_KEY) {
//   throw new Error("⚠️ OPENAI_API_KEY is missing. Make sure your .env is loaded correctly.");
// }

// const client = new OpenAI({
//   apiKey: process.env.OPENAI_API_KEY,
// });

// export async function runLLM({ systemPrompt, userPrompt, temperature = 0.3, maxTokens = 200 }) {
//   const response = await client.chat.completions.create({
//     model: "gpt-4o-mini",
//     temperature,
//     max_tokens: maxTokens,
//     messages: [
//       { role: "system", content: systemPrompt },
//       { role: "user", content: userPrompt },
//     ],
//   });

//   return response.choices[0].message.content;
// }



import dotenv from "dotenv";
dotenv.config();

import { Groq } from "groq-sdk";

// -----------------------------
// Validate API Key
// -----------------------------
if (!process.env.GROQ_API_KEY) {
  throw new Error("⚠️ GROQ_API_KEY missing in .env");
}

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

// -----------------------------
// Unified LLM Runner
// -----------------------------
export async function runLLM({
  systemPrompt,
  userPrompt,
  temperature = 1,
  maxTokens = 8192,
}) {
  try {
    const chatCompletion = await groq.chat.completions.create({
      model: "openai/gpt-oss-120b", // Groq OSS model
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature,
      max_completion_tokens: maxTokens,
      top_p: 1,
      stream: false, // set true if you want streaming
      reasoning_effort: "medium",
    });

    return chatCompletion.choices[0]?.message?.content?.trim() || "general_query";
  } catch (err) {
    console.error("❌ LLM Error:", err.message);
    return "general_query"; // fallback
  }
}

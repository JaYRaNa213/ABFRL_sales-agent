import { salesAgent } from "./src/agents/salesAgent/salesAgent.js";

// Mock context
const context = {
    sessionId: "test-session-123",
    history: []
};

async function runTest() {
    console.log("--- TEST START ---");
    const msg = "I am looking for a shirt";
    console.log(`User: ${msg}`);

    try {
        const response = await salesAgent(msg, context);
        console.log("Agent Response:", JSON.stringify(response, null, 2));
        console.log("Context Intent:", context.intent);
        console.log("Context Stage:", context.stage);
    } catch (error) {
        console.error("Agent Error:", error);
    }
    console.log("--- TEST END ---");
}

runTest();

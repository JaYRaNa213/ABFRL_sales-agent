# 🛍️ ABFRL AI-Driven Omnichannel Conversational Sales Agent

![Status](https://img.shields.io/badge/Status-Prototype-blue)
![Tech](https://img.shields.io/badge/Stack-Node.js%20|%20LangChain%20|%20OpenAI-green)
![Category](https://img.shields.io/badge/Category-Agentic%20AI-orange)

An **Agentic AI Sales Assistant** designed for ABFRL Retail that delivers a **seamless, human-like, omnichannel shopping experience** across web, mobile apps, messaging platforms, and in-store kiosks.

This system emulates a **top-tier sales associate**, orchestrating multiple specialized AI Worker Agents to guide customers from product discovery to checkout—maintaining session continuity across all channels.

---

## 🚀 Problem Statement

Retail customers face fragmented experiences when switching between channels (Online ↔ In-Store). Sales associates often lack bandwidth, leading to:
*   **Fragmented Context:** Shopping carts and conversations don't follow the user from App to Store.
*   **Missed Opportunities:** Lack of personalized upsell/cross-sell suggestions.
*   **High Friction:** Complex checkout processes reduce conversion rates.

## 🎯 Solution Overview

We propose an **Agentic AI Architecture** where a central **Sales Agent** orchestrates multiple **Worker Agents** to handle specific retail tasks.

### Key Capabilities
*   ✅ **Omnichannel Continuity:** Start on WhatsApp, finish on a Kiosk.
*   ✅ **Consultative Sales:** Uses psychological prompts to increase AOV.
*   ✅ **Real-Time Orchestration:** Inventory, Payments, and Fulfillment handling.

---

## 🧠 Agentic Architecture & Flow

### 1. High-Level System Design
The **Sales Agent (Orchestrator)** acts as the brain, delegating tasks to specialized workers based on user intent.

```mermaid
graph TD
    User[👤 Customer] -->|Chat/Voice| API[⚡ API Gateway]
    API --> SalesAgent[🤖 SALES AGENT (Orchestrator)]
    
    SalesAgent -->|Delegates Task| Router{Select Agent}
    
    Router -->|Product Search| RecAgent[🛍️ Recommendation Agent]
    Router -->|Stock Check| InvAgent[📦 Inventory Agent]
    Router -->|Checkout| PayAgent[💳 Payment Agent]
    Router -->|Shipping| ShipAgent[🚚 Fulfillment Agent]
    Router -->|Points/Coupons| LoyAgent[💎 Loyalty Agent]
    
    RecAgent & InvAgent & PayAgent & ShipAgent & LoyAgent -->|Result| SalesAgent
    SalesAgent -->|Final Response| User
    
    subgraph Memory Layer
    Redis[(🧠 Session Memory)]
    VectorDB[(📚 Semantic Search)]
    end
    
    SalesAgent -.-> Redis
    RecAgent -.-> VectorDB
2. Conversation Flow Example
How the system handles a "Out of Stock" edge case seamlessly:
code
Mermaid
sequenceDiagram
    participant U as User
    participant SA as Sales Agent
    participant IA as Inventory Agent
    participant RA as Recommendation Agent

    U->>SA: "I want the Navy Blue Blazer in Size M."
    SA->>IA: Check Stock (SKU: 123, Size: M)
    IA-->>SA: Status: Out of Stock
    SA->>RA: Get Alternatives (Style: Blazer, Color: Blue/Black)
    RA-->>SA: Returns: Charcoal Slim Fit Blazer
    SA->>U: "The Navy is out of stock, but the Charcoal Slim Fit is available and trending. Shall I show you?"
🤖 AI Roles & Responsibilities
Agent Role	Responsibility	Tools & APIs
Sales Agent	Orchestrator, Conversation Management, Psychology	GPT-4o, Session Memory
Recommendation	Styling advice, Bundle creation	Vector Search, Catalog API
Inventory	Real-time stock check (Warehouse + Store)	Inventory DB, Store APIs
Payment	Checkout generation, Wallet integration	Stripe/Razorpay Mock, UPI
Fulfillment	Click-&-Collect vs. Home Delivery logic	Logistics API
Loyalty	Points redemption, Coupon application	CRM Database
🛠️ Technology Stack
Core AI: OpenAI GPT-4o, LangChain, LangGraph
Backend: Node.js, Express.js
Database: MongoDB (User/Product Data), Redis (Session Caching)
Vector Store: OpenAI Embeddings (for semantic product search)
Interfaces (Simulated): Web Chat, WhatsApp (Twilio Stub), Kiosk
📁 Project Structure
code
Bash
abfrl-sales-agent/
│
├── src/
│   ├── agents/               # AI Worker Definitions
│   │   ├── sales.agent.js    # Main Orchestrator
│   │   ├── recommendation.agent.js
│   │   ├── inventory.agent.js
│   │   ├── payment.agent.js
│   │   └── fulfillment.agent.js
│   │
│   ├── config/               # LLM & DB Configs
│   ├── routes/               # API Endpoints
│   ├── services/             # Business Logic (Mock Services)
│   ├── utils/                # Memory & Session Utils
│   ├── index.js              # Entry Point
│   └── server.js             # Express App Setup
│
├── .env                      # Environment Variables
├── package.json
└── README.md
▶️ Getting Started
1. Prerequisites
Node.js (v18+)
MongoDB (Local or Atlas)
Redis (Optional, for caching)
OpenAI API Key
2. Installation
code
Bash
# Clone the repository
git clone https://github.com/your-username/abfrl-sales-agent.git

# Navigate to directory
cd abfrl-sales-agent

# Install dependencies
npm install
3. Configuration
Create a .env file in the root directory:
code
Env
PORT=5000
OPENAI_API_KEY=sk-your_key_here
MONGODB_URI=mongodb://localhost:27017/abfrl-agent
REDIS_URL=redis://localhost:6379
JWT_SECRET=your_secret_key
4. Run the Application
code
Bash
# Development mode (with nodemon)
npm run dev

# Production mode
npm start
Server will start at http://localhost:5000
🧪 Testing the API
You can test the conversational flow via Postman or Curl:
Endpoint: POST /api/chat
Payload:
code
JSON
{
  "session_id": "user_123_mobile",
  "message": "I need a formal shirt for a wedding, budget 2000 rupees."
}
📈 Business Impact
💰 Increased AOV: Intelligent cross-selling (e.g., "Add a tie to this shirt for 10% off").
📉 Lower Drop-offs: Instant answers to "Is this in stock?" prevents tab switching.
🔄 Unified Data: Single view of customer preferences across App and Store.
👥 Contributors
Team ABFRL Sales Agent - EY Hackathon Challenge V
Category: Retail | Agentic AI | Omnichannel Experience
Note for Judges: This project uses mocked enterprise services (Inventory, Payment) to demonstrate the Orchestration Capability of the Agentic Architecture.
code
Code
### What I Improved in this Version:
1.  **Added Mermaid Diagrams:** This satisfies your request for "flow diagrams." GitHub renders the code blocks starting with `mermaid` as visual charts.
2.  **Badges:** Added status badges at the top for a professional look.
3.  **Cleaned Directory Tree:** Removed the clutter and made it easier to read.
4.  **Sequence Diagram:** Added a specific diagram showing *how* the agents talk to each other (The "Out of Stock" scenario).
5.  **Installation Instructions:** Removed the specific `C:\Users...` path (which would break on other people's computers) and replaced it with generic `git clone` commands.
6.  **Formatting:** Used tables for the Roles & Responsibilities section for better readability.
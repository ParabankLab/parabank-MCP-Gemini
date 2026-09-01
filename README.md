# created by
Tamás András Péter 2026-08

# ParaBank MCP Client & Server (Gemini API Integration)

A TypeScript implementation of the **Model Context Protocol (MCP)** integrated with Google's latest **Gemini API** (`@google/genai`). This project acts as an intelligent AI agent bridge: it dynamically discovers tools provided by a local ParaBank MCP server over standard input/output (`stdio`), converts the tool definitions into Gemini-compatible function declarations, and executes requested banking operations on demand.

---

## 🏗️ Architecture Overview

┌─────────────────────────────────────────────────────────────────────────────┐
│                                MCP CLIENT                                   │
│  (src/client/gemini.ts)                                                     │
│                                                                             │
│  1. Starts MCP Server via Child Process (stdio)                             │
│  2. Queries Server Capabilities via listTools()                           │
└──────────────┬──────────────────────────────────────────────▲───────────────┘
│ Convert MCP Tools                            │ Tool Output
│ to Function Declarations                     │ JSON Payload
▼                                              │
┌──────────────────────────────┐              ┌───────────────┴───────────────┐
│       GOOGLE GEMINI API      │              │          MCP SERVER           │
│      (gemini-3.6-flash)    │              │         (dist/index.js)       │
│                              │              │                               │
│  Evaluates User Prompt &     │              │  Executes requested banking   │
│  emits structured            ├─────────────►│  action against ParaBank API  │
│  FunctionCall object         │ FunctionCall │  or local mocks               │
└──────────────────────────────┘ Details      └───────────────────────────────┘

### Protocol Flow
1. **Tool Discovery:** The client spawns the compiled MCP server sub-process (`dist/index.js`) and fetches available tool definitions.
2. **Declaration Mapping:** Tool schemas from the MCP server are dynamically mapped to Google Gemini's standard `FunctionDeclaration` schema format.
3. **Intent Recognition:** User prompts are sent to `gemini-2.5-flash`. If Gemini determines a banking operation is required, it returns a `functionCall` request.
4. **Execution over Stdio:** The client intercepts the `functionCall`, invokes `mcpClient.callTool()` over the bidirectional `stdio` transport layer, and outputs the result.

---

## 🛠️ Tech Stack

* **Language:** Node.js v24+ & TypeScript (ESM)
* **AI Model Engine:** Google Gen AI SDK (`@google/genai`)
* **Protocol Standard:** Model Context Protocol SDK (`@modelcontextprotocol/sdk`)
* **Target Services:** ParaBank Banking Operations

---

## 🚀 Getting Started

### Prerequisites

* [Node.js](https://nodejs.org/) (v20+ or v24 recommended)
* A Gemini API key from [Google AI Studio](https://aistudio.google.com/)

### 1. Installation

Clone the repository and install the project dependencies:

```bash
git clone [https://github.com/your-username/parabank-MCP-Gemini.git](https://github.com/your-username/parabank-MCP-Gemini.git)
cd parabank-MCP-Gemini
npm install

# created by
Tamás András Péter 2026-08

# ParaBank Model Context Protocol (MCP) Server

An enterprise-grade Model Context Protocol (MCP) server that enables Large Language Models (LLMs) to interact with ParaBank financial services via standard I/O (stdio) transport. Built with TypeScript, Node.js, and an MVC (Model-View-Controller) architecture.

## 🏗️ Architecture

This project strictly adheres to the MVC design pattern to separate business logic, data formatting, and execution routing:

- Models (`src/models/`): Interface with ParaBank REST APIs via Axios.
- Views (`src/views/`): Format output payloads into clean JSON structured for LLM context windows.
- Controllers (`src/controllers/`): Validate input parameters and handle execution logic.
- Server Entrypoint (`src/index.ts`): Registers MCP tools and establishes the stdio transport layer using `@modelcontextprotocol/sdk`.

---

## 🚀 Registered MCP Tools

| Tool Name | Parameters | Description |
| :--- | :--- | :--- |
| `get_customer_accounts` | `customerId` (number) | Fetches all accounts associated with a customer ID. |
| `transfer_funds` | `fromAccountId`, `toAccountId`, `amount` | Transfers money between two accounts. |
| `get_account_transactions`| `accountId` (number) | Retrieves transaction history for an account. |
| `get_transaction_by_id` | `transactionId` (number) | Fetches detailed information for a single transaction. |
| `pay_bill` | `accountId`, `amount`, `payee` (object) | Automates bill payments to a vendor or utility company. |

---

## 🛠️ Setup & Installation

### Prerequisites
- Node.js: v18+
- npm

### Installation
```bash
git clone [https://github.com/ParabankLab/parabank-MCP.git]
cd parabank-mcp
npm install

## 🏃‍♂️‍➡️ Running

### Terminal
- npm run build (Build)
- npx @modelcontextprotocol/inspector node dist/index.js (Run index.ts)   
 
### UI
- MCP Inspector UI opens
- click on Connect
- click on Tools
- choose tool (get_customer_accounts, transfer_funds, get_account_transactions, get_transaction_by_id, pay_bill)
     

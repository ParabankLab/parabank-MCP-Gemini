import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import { z } from 'zod';

import { AccountController } from './controllers/AccountController.js';
import { TransferController } from './controllers/TransferController.js';
import { TransactionController } from './controllers/TransactionController.js';
import { BillPayController } from './controllers/BillPayController.js';

const server = new McpServer({
  name: 'parabank-mcp',
  version: '1.0.0',
});

const accountController = new AccountController();
const transferController = new TransferController();
const transactionController = new TransactionController();
const billPayController = new BillPayController();

// 1. Get Accounts Tool
server.registerTool(
  'get_customer_accounts',
  {
    description: 'Fetch all bank accounts for a ParaBank customer ID.',
    inputSchema: z.object({
      customerId: z.number().describe('ParaBank Customer ID (e.g., 12212)'),
    }),
  },
  async ({ customerId }) => {
    return await accountController.handleGetCustomerAccounts({ customerId });
  }
);

// 2. Transfer Funds Tool
server.registerTool(
  'transfer_funds',
  {
    description: 'Transfer funds between two ParaBank accounts.',
    inputSchema: z.object({
      fromAccountId: z.number().describe('Source account ID'),
      toAccountId: z.number().describe('Destination account ID'),
      amount: z.number().positive().describe('Amount to transfer'),
    }),
  },
  async ({ fromAccountId, toAccountId, amount }) => {
    return await transferController.handleTransferFunds({ fromAccountId, toAccountId, amount });
  }
);

// 3. Get Account Transactions Tool
server.registerTool(
  'get_account_transactions',
  {
    description: 'Fetch history of all transactions for a specific bank account.',
    inputSchema: z.object({
      accountId: z.number().describe('ParaBank Account ID (e.g., 13344)'),
    }),
  },
  async ({ accountId }) => {
    return await transactionController.handleGetAccountTransactions({ accountId });
  }
);

// 4. Get Transaction By ID Tool
server.registerTool(
  'get_transaction_by_id',
  {
    description: 'Fetch details of a single transaction by its unique ID.',
    inputSchema: z.object({
      transactionId: z.number().describe('Transaction ID'),
    }),
  },
  async ({ transactionId }) => {
    return await transactionController.handleGetTransactionById({ transactionId });
  }
);

// 5. Pay Bill Tool
server.registerTool(
  'pay_bill',
  {
    description: 'Pay a bill from a ParaBank account to a specified payee.',
    inputSchema: z.object({
      accountId: z.coerce.number().describe('Source account ID paying the bill'),
      amount: z.coerce.number().positive().describe('Amount to pay'),
      payee: z.object({
        name: z.string().describe('Name of payee or utility company'),
        street: z.string().default('123 Main St'),
        city: z.string().default('Beverly Hills'),
        state: z.string().default('CA'),
        zipCode: z.string().default('90210'),
        phoneNumber: z.string().default('555-0199'),
        accountNumber: z.coerce.number().default(99999).describe('Payee account number'),
      }),
    }),
  },
  async ({ accountId, amount, payee }) => {
    return await billPayController.handlePayBill({ accountId, amount, payee });
  }
);

async function main() {
  const transport = new StdioServerTransport();
  await server.connect(transport);
  console.error('ParaBank MCP Server running via stdio transport');
}

main().catch((err) => {
  console.error('Fatal error in main():', err);
  process.exit(1);
});
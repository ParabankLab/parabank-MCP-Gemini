import { Transaction } from '../models/TransactionModel.js';

export class TransactionView {
  static renderTransactionList(accountId: number, transactions: Transaction[]) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              status: 'SUCCESS',
              accountId,
              transactionCount: transactions.length,
              transactions,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  static renderTransactionDetail(transaction: Transaction) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              status: 'SUCCESS',
              transaction,
            },
            null,
            2
          ),
        },
      ],
    };
  }

  static renderError(errorMessage: string) {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify({ status: 'ERROR', error: errorMessage }, null, 2),
        },
      ],
    };
  }
}
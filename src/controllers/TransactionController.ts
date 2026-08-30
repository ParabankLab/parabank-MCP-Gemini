import { TransactionModel } from '../models/TransactionModel.js';
import { TransactionView } from '../views/TransactionView.js';

export class TransactionController {
  private model: TransactionModel;

  constructor() {
    this.model = new TransactionModel();
  }

  async handleGetAccountTransactions(args: { accountId: number }) {
    const accountId = Number(args?.accountId);

    if (!accountId || isNaN(accountId) || accountId <= 0) {
      return TransactionView.renderError('Invalid or missing accountId parameter.');
    }

    try {
      const transactions = await this.model.getAccountTransactions(accountId);
      return TransactionView.renderTransactionList(accountId, transactions);
    } catch (error: any) {
      return TransactionView.renderError(
        error.message || `Failed to fetch transactions for account #${accountId}.`
      );
    }
  }

  async handleGetTransactionById(args: { transactionId: number }) {
    const transactionId = Number(args?.transactionId);

    if (!transactionId || isNaN(transactionId) || transactionId <= 0) {
      return TransactionView.renderError('Invalid or missing transactionId parameter.');
    }

    try {
      const transaction = await this.model.getTransactionById(transactionId);
      return TransactionView.renderTransactionDetail(transaction);
    } catch (error: any) {
      return TransactionView.renderError(
        error.message || `Failed to fetch details for transaction #${transactionId}.`
      );
    }
  }
}
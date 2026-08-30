import { TransferModel } from '../models/TransferModel.js';
import { TransferView } from '../views/TransferView.js';

export class TransferController {
  private model: TransferModel;

  constructor() {
    this.model = new TransferModel();
  }

  async handleTransferFunds(args: { fromAccountId: number; toAccountId: number; amount: number }) {
    const fromAccountId = Number(args?.fromAccountId);
    const toAccountId = Number(args?.toAccountId);
    const amount = Number(args?.amount);

    if (!fromAccountId || isNaN(fromAccountId) || fromAccountId <= 0) {
      return TransferView.renderError('Invalid or missing fromAccountId parameter.');
    }

    if (!toAccountId || isNaN(toAccountId) || toAccountId <= 0) {
      return TransferView.renderError('Invalid or missing toAccountId parameter.');
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return TransferView.renderError('Transfer amount must be greater than 0.');
    }

    if (fromAccountId === toAccountId) {
      return TransferView.renderError('Source and destination accounts must be different.');
    }

    try {
      const result = await this.model.transferFunds(fromAccountId, toAccountId, amount);
      return TransferView.renderSuccess(result);
    } catch (error: any) {
      return TransferView.renderError(error.message || 'Failed to execute fund transfer.');
    }
  }
}
import { BillPayModel, PayeeInfo } from '../models/BillPayModel.js';
import { BillPayView } from '../views/BillPayView.js';

export class BillPayController {
  private model: BillPayModel;

  constructor() {
    this.model = new BillPayModel();
  }

  async handlePayBill(args: { accountId: number; amount: number; payee: PayeeInfo }) {
    const accountId = Number(args?.accountId);
    const amount = Number(args?.amount);
    const payee = args?.payee;

    if (!accountId || isNaN(accountId) || accountId <= 0) {
      return BillPayView.renderError('Invalid or missing accountId parameter.');
    }

    if (!amount || isNaN(amount) || amount <= 0) {
      return BillPayView.renderError('Payment amount must be greater than 0.');
    }

    if (!payee || !payee.name || !payee.accountNumber) {
      return BillPayView.renderError('Payee details must include at least name and accountNumber.');
    }

    try {
      const result = await this.model.payBill({ accountId, amount, payee });
      return BillPayView.renderSuccess(result);
    } catch (error: any) {
      return BillPayView.renderError(
        error.message || `Failed to process bill payment to ${payee.name}.`
      );
    }
  }
}
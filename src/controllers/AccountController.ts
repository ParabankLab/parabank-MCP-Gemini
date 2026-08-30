import { AccountModel } from '../models/AccountModel.js';
import { AccountView } from '../views/AccountView.js';

export class AccountController {
  private model: AccountModel;

  constructor() {
    this.model = new AccountModel();
  }

  async handleGetCustomerAccounts(args: { customerId: number }) {
    const customerId = Number(args?.customerId);

    if (!customerId || isNaN(customerId) || customerId <= 0) {
      return AccountView.renderError('Invalid or missing customerId parameter.');
    }

    try {
      const accounts = await this.model.getAccountsByCustomerId(customerId);
      return AccountView.renderAccounts(accounts);
    } catch (error: any) {
      return AccountView.renderError(error.message || 'Failed to fetch accounts.');
    }
  }
}
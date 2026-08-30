import { Account } from '../models/AccountModel.js';

export class AccountView {
  static renderAccounts(accounts: Account[]) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(accounts, null, 2),
        },
      ],
    };
  }

  static renderError(message: string) {
    return {
      isError: true,
      content: [
        {
          type: 'text' as const,
          text: `[Account Error]: ${message}`,
        },
      ],
    };
  }
}
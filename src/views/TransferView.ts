import { TransferResult } from '../models/TransferModel.js';

export class TransferView {
  static renderSuccess(result: TransferResult) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              status: 'SUCCESS',
              transferDetails: {
                fromAccountId: result.fromAccountId,
                toAccountId: result.toAccountId,
                amount: result.amount,
                confirmation: result.message,
              },
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
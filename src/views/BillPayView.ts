import { BillPayResult } from '../models/BillPayModel.js';

export class BillPayView {
  static renderSuccess(result: BillPayResult) {
    return {
      content: [
        {
          type: 'text' as const,
          text: JSON.stringify(
            {
              status: 'SUCCESS',
              billPayDetails: {
                payeeName: result.payeeName,
                amount: result.amount,
                fromAccountId: result.accountId,
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
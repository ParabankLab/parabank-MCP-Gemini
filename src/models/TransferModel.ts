import axios from 'axios';
import { ParabankUtils } from '../utils/ParabankUtils.js'

export interface TransferResult {
  fromAccountId: number;
  toAccountId: number;
  amount: number;
  message: string;
}

export class TransferModel {
  private baseUrl: string;

  constructor(baseUrl: string = ParabankUtils.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async transferFunds(fromAccountId: number, toAccountId: number, amount: number): Promise<TransferResult> {
    const url = `${this.baseUrl}/transfer?fromAccountId=${fromAccountId}&toAccountId=${toAccountId}&amount=${amount}`;
    
    const response = await axios.post(url, {}, {
      headers: { 'Accept': 'application/json' }
    });

    if (typeof response.data === 'string' && response.data.includes('Successfully transferred')) {
      return {
        fromAccountId,
        toAccountId,
        amount,
        message: response.data,
      };
    }

    return {
      fromAccountId,
      toAccountId,
      amount,
      message: response.data?.message || `Successfully transferred $${amount} from account #${fromAccountId} to account #${toAccountId}.`,
    };
  }
}
import axios from 'axios';
import { ParabankUtils } from '../utils/ParabankUtils.js'

export interface Account {
  id: number;
  customerId: number;
  type: string;
  balance: number;
}

export class AccountModel {
  private baseUrl = ParabankUtils.BASE_URL;

  async getAccountsByCustomerId(customerId: number): Promise<Account[]> {
    const response = await axios.get(`${this.baseUrl}/customers/${customerId}/accounts`, {
      headers: { Accept: 'application/json' },
    });
    return response.data;
  }
}
import axios from 'axios';
import { ParabankUtils } from '../utils/ParabankUtils.js'

export interface Transaction {
  id: number;
  accountId: number;
  type: string;
  date: string;
  amount: number;
  description: string;
}

export class TransactionModel {
  private baseUrl: string;

  constructor(baseUrl: string = ParabankUtils.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async getAccountTransactions(accountId: number): Promise<Transaction[]> {
    const url = `${this.baseUrl}/accounts/${accountId}/transactions`;
    const response = await axios.get(url, {
      headers: { 'Accept': 'application/json' }
    });

    const data = response.data;
    const rawList = Array.isArray(data) ? data : data?.transaction || [];

    return rawList.map((tx: any) => ({
      id: tx.id,
      accountId: tx.accountId,
      type: tx.type,
      date: tx.date,
      amount: tx.amount,
      description: tx.description,
    }));
  }

  async getTransactionById(transactionId: number): Promise<Transaction> {
    const url = `${this.baseUrl}/transactions/${transactionId}`;
    const response = await axios.get(url, {
      headers: { 'Accept': 'application/json' }
    });

    const tx = response.data;
    return {
      id: tx.id,
      accountId: tx.accountId,
      type: tx.type,
      date: tx.date,
      amount: tx.amount,
      description: tx.description,
    };
  }
}
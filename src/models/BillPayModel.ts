import axios from 'axios';
import { ParabankUtils } from '../utils/ParabankUtils.js'

export interface PayeeInfo {
  name: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  phoneNumber: string;
  accountNumber: number;
}

export interface BillPayParams {
  accountId: number;
  amount: number;
  payee: PayeeInfo;
}

export interface BillPayResult {
  payeeName: string;
  amount: number;
  accountId: number;
  message: string;
}

export class BillPayModel {
  private baseUrl: string;

  constructor(baseUrl: string = ParabankUtils.BASE_URL) {
    this.baseUrl = baseUrl;
  }

  async payBill(params: BillPayParams): Promise<BillPayResult> {
    // ParaBank REST API works reliably when query parameters are appended to the POST request
    const queryParams = new URLSearchParams({
      accountId: params.accountId.toString(),
      amount: params.amount.toString(),
    }).toString();

    const url = `${this.baseUrl}/billpay?${queryParams}`;

    const payload = {
      name: params.payee.name,
      address: {
        street: params.payee.street,
        city: params.payee.city,
        state: params.payee.state,
        zipCode: params.payee.zipCode,
      },
      phoneNumber: params.payee.phoneNumber,
      accountNumber: params.payee.accountNumber,
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    return {
      payeeName: params.payee.name,
      amount: params.amount,
      accountId: params.accountId,
      message: `Successfully transferred $${params.amount} to ${params.payee.name}.`,
    };
  }
}
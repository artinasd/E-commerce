import { PaymentProvider } from './base.js';

export class DisabledPaymentProvider extends PaymentProvider {
  constructor() {
    super();
    this.code = 'disabled';
  }

  async createPayment() {
    const error = new Error('Online payment is not available yet.');
    error.code = 'PAYMENT_PROVIDER_DISABLED';
    throw error;
  }

  async verifyPayment() {
    const error = new Error('Online payment is not available yet.');
    error.code = 'PAYMENT_PROVIDER_DISABLED';
    throw error;
  }
}

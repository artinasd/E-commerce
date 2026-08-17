import { createPaymentProvider } from './base.js';

export const DisabledPaymentProvider = createPaymentProvider({
  async createPayment() {
    const error = new Error('Online payment is not available yet.');
    error.code = 'PAYMENT_PROVIDER_DISABLED';
    throw error;
  },

  async verifyPayment() {
    const error = new Error('Online payment is not available yet.');
    error.code = 'PAYMENT_PROVIDER_DISABLED';
    throw error;
  },
});

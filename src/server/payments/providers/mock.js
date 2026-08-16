import crypto from 'node:crypto';
import { createPaymentProvider } from './base.js';

export const mockPaymentProvider = createPaymentProvider({
  async createPayment({ paymentId }) {
    const providerReference = `MOCK-${crypto.randomUUID()}`;
    return {
      providerReference,
      redirectUrl: `/payment/mock?paymentId=${encodeURIComponent(paymentId)}`,
    };
  },
  async verifyPayment({ providerReference, success = true }) {
    if (!providerReference?.startsWith('MOCK-')) return { success: false, providerReference };
    return { success: Boolean(success), providerReference };
  },
});

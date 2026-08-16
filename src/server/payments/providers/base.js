export class PaymentProviderError extends Error {
  constructor(message, code = 'PAYMENT_PROVIDER_ERROR') {
    super(message);
    this.name = 'PaymentProviderError';
    this.code = code;
  }
}

export function createPaymentProvider({ createPayment, verifyPayment }) {
  if (typeof createPayment !== 'function' || typeof verifyPayment !== 'function') {
    throw new TypeError('A payment provider must implement createPayment and verifyPayment.');
  }
  return Object.freeze({ createPayment, verifyPayment });
}

import { createPaymentProvider, PaymentProviderError } from './base.js';

export { PaymentProviderError };

export function getPaymentProvider() {
  const provider = process.env.PAYMENT_PROVIDER;
  if (!provider) {
    throw new PaymentProviderError('Payment provider is not configured.', 'PAYMENT_PROVIDER_NOT_CONFIGURED');
  }
  throw new PaymentProviderError(`Payment provider "${provider}" is not implemented.`, 'PAYMENT_PROVIDER_UNAVAILABLE');
}

export { createPaymentProvider };

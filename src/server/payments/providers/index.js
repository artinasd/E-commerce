import { createPaymentProvider, PaymentProviderError } from './base.js';
import { DisabledPaymentProvider } from './disabled.js';
import { mockPaymentProvider } from './mock.js';

export { PaymentProviderError };

export function getPaymentProvider() {
  const provider = (process.env.PAYMENT_PROVIDER || 'disabled').trim().toLowerCase();
  if (provider === 'disabled') return new DisabledPaymentProvider();
  if (provider === 'mock') return mockPaymentProvider;
  throw new PaymentProviderError(`Payment provider "${provider}" is not implemented.`, 'PAYMENT_PROVIDER_UNAVAILABLE');
}

export { createPaymentProvider };

import { createPaymentProvider, PaymentProviderError } from './base.js';
import { DisabledPaymentProvider } from './disabled.js';

export { PaymentProviderError };

export function getPaymentProvider() {
  const provider = (process.env.PAYMENT_PROVIDER || 'disabled').trim().toLowerCase();

  if (provider === 'disabled') {
    return new DisabledPaymentProvider();
  }

  throw new PaymentProviderError(`Payment provider "${provider}" is not implemented.`, 'PAYMENT_PROVIDER_UNAVAILABLE');
}

export { createPaymentProvider };

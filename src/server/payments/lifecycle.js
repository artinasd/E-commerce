export const PAYMENT_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  PAID: 'PAID',
  FAILED: 'FAILED',
  CANCELLED: 'CANCELLED',
  EXPIRED: 'EXPIRED',
});

const transitions = Object.freeze({
  PENDING: new Set(['PAID', 'FAILED', 'CANCELLED', 'EXPIRED']),
  PAID: new Set(),
  FAILED: new Set(),
  CANCELLED: new Set(),
  EXPIRED: new Set(),
});

export function assertPaymentTransition(from, to) {
  if (from === to) return;
  if (!transitions[from]?.has(to)) throw new Error(`Invalid payment status transition: ${from} -> ${to}`);
}

export function isTerminalPaymentStatus(status) {
  return status !== PAYMENT_STATUSES.PENDING;
}

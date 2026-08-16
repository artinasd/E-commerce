export const ORDER_STATUSES = Object.freeze({
  PENDING: 'PENDING',
  CONFIRMED: 'CONFIRMED',
  PROCESSING: 'PROCESSING',
  SHIPPED: 'SHIPPED',
  DELIVERED: 'DELIVERED',
  CANCELLED: 'CANCELLED',
  REFUNDED: 'REFUNDED',
});

const transitions = Object.freeze({
  PENDING: new Set(['CONFIRMED', 'CANCELLED']),
  CONFIRMED: new Set(['PROCESSING', 'CANCELLED']),
  PROCESSING: new Set(['SHIPPED']),
  SHIPPED: new Set(['DELIVERED']),
  DELIVERED: new Set(['REFUNDED']),
  CANCELLED: new Set(),
  REFUNDED: new Set(),
});

export function canTransitionOrderStatus(from, to) {
  return Boolean(transitions[from]?.has(to));
}

export function assertValidOrderStatusTransition(from, to) {
  if (!canTransitionOrderStatus(from, to)) {
    const error = new Error(`Order cannot transition from ${from} to ${to}.`);
    error.code = 'INVALID_ORDER_STATUS_TRANSITION';
    throw error;
  }
}

export function canCustomerCancelOrder(order) {
  return order.status === ORDER_STATUSES.PENDING ||
    (order.status === ORDER_STATUSES.CONFIRMED && order.payment_status !== 'PAID');
}

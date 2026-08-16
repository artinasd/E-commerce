const ZERO = 0;

function assertMoney(value, fieldName) {
  if (!Number.isSafeInteger(value) || value < 0) {
    throw new Error(`Invalid ${fieldName}.`);
  }
}

export function calculateOrderPricing(items, { shippingAmount = ZERO, discountAmount = ZERO } = {}) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new Error('Cannot calculate pricing for an empty order.');
  }

  assertMoney(shippingAmount, 'shipping amount');
  assertMoney(discountAmount, 'discount amount');

  const pricedItems = items.map((item) => {
    const unitPrice = Number(item.price);
    const quantity = Number(item.quantity);
    if (!Number.isSafeInteger(unitPrice) || unitPrice < 0) throw new Error('Invalid item price.');
    if (!Number.isSafeInteger(quantity) || quantity < 1) throw new Error('Invalid item quantity.');
    const lineTotal = unitPrice * quantity;
    if (!Number.isSafeInteger(lineTotal)) throw new Error('Invalid line total.');
    return { ...item, unitPrice, quantity, discountAmount: 0, lineTotal };
  });

  const subtotal = pricedItems.reduce((sum, item) => sum + item.lineTotal, 0);
  if (!Number.isSafeInteger(subtotal)) throw new Error('Invalid order subtotal.');
  if (discountAmount > subtotal) throw new Error('Discount cannot exceed the order subtotal.');

  const totalAmount = subtotal - discountAmount + shippingAmount;
  if (!Number.isSafeInteger(totalAmount) || totalAmount < 0) throw new Error('Invalid order total.');

  return { items: pricedItems, subtotal, discountAmount, shippingAmount, totalAmount };
}

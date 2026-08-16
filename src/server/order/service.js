import { findOrderByIdForUser, findOrderByNumberForUser, listOrderItems, listOrdersForUser } from '../db/repositories/orders.js';

function mapOrder(row, items = []) {
  if (!row) return null;
  return {
    id: Number(row.id),
    orderNumber: row.order_number,
    status: row.status,
    paymentStatus: row.payment_status,
    subtotal: Number(row.subtotal),
    discountAmount: Number(row.discount_amount),
    shippingAmount: Number(row.shipping_amount),
    totalAmount: Number(row.total_amount),
    shipping: {
      recipientName: row.shipping_recipient_name,
      recipientPhone: row.shipping_recipient_phone,
      province: row.shipping_province,
      city: row.shipping_city,
      addressLine: row.shipping_address,
      postalCode: row.shipping_postal_code,
    },
    placedAt: row.placed_at,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    items: items.map((item) => ({
      id: Number(item.id),
      variantId: item.variant_id == null ? null : Number(item.variant_id),
      productName: item.product_name,
      sku: item.sku,
      unitPrice: Number(item.unit_price),
      quantity: Number(item.quantity),
      discountAmount: Number(item.discount_amount),
      lineTotal: Number(item.line_total),
    })),
  };
}

export async function getUserOrder(userId, orderId) {
  const id = Number(orderId);
  if (!Number.isSafeInteger(id) || id < 1) return null;
  const order = await findOrderByIdForUser(id, userId);
  if (!order) return null;
  return mapOrder(order, await listOrderItems(id));
}

export async function getUserOrderByNumber(userId, orderNumber) {
  const value = typeof orderNumber === 'string' ? orderNumber.trim() : '';
  if (!value) return null;
  const order = await findOrderByNumberForUser(value, userId);
  if (!order) return null;
  return mapOrder(order, await listOrderItems(Number(order.id)));
}

export async function getUserOrders(userId, options = {}) {
  return (await listOrdersForUser(userId, options)).map((order) => mapOrder(order));
}

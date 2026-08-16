import { findOrderByIdForUser, listOrderItems, listOrdersForUser } from '../db/repositories/orders.js';

function money(value) {
  return Number(value);
}

export async function listUserOrders(userId, params) {
  const orders = await listOrdersForUser(userId, params);
  return {
    orders: orders.map((order) => ({
      id: order.id,
      orderNumber: order.order_number,
      status: order.status,
      paymentStatus: order.payment_status,
      subtotal: money(order.subtotal),
      discountAmount: money(order.discount_amount),
      shippingAmount: money(order.shipping_amount),
      totalAmount: money(order.total_amount),
      placedAt: order.placed_at,
      createdAt: order.created_at,
      updatedAt: order.updated_at,
    })),
    pagination: {
      page: params.page,
      limit: params.limit,
      hasMore: orders.length === params.limit,
    },
  };
}

export async function getUserOrder(userId, orderId) {
  const order = await findOrderByIdForUser(orderId, userId);
  if (!order) return null;

  const items = await listOrderItems(order.id);
  return {
    id: order.id,
    orderNumber: order.order_number,
    status: order.status,
    paymentStatus: order.payment_status,
    subtotal: money(order.subtotal),
    discountAmount: money(order.discount_amount),
    shippingAmount: money(order.shipping_amount),
    totalAmount: money(order.total_amount),
    shippingAddress: {
      recipientName: order.shipping_recipient_name,
      recipientPhone: order.shipping_recipient_phone,
      province: order.shipping_province,
      city: order.shipping_city,
      addressLine: order.shipping_address,
      postalCode: order.shipping_postal_code,
    },
    placedAt: order.placed_at,
    createdAt: order.created_at,
    updatedAt: order.updated_at,
    items: items.map((item) => ({
      id: item.id,
      variantId: item.variant_id,
      productName: item.product_name,
      sku: item.sku,
      unitPrice: money(item.unit_price),
      quantity: Number(item.quantity),
      discountAmount: money(item.discount_amount),
      lineTotal: money(item.line_total),
    })),
  };
}

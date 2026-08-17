import { query } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

export async function getAdminDashboard() {
  await requireRole(['ADMIN', 'SUPER_ADMIN']);
  const [sales, orders, customers, inventory, recentOrders, topProducts] = await Promise.all([
    query(`SELECT COALESCE(SUM(CASE WHEN payment_status='PAID' THEN total_amount ELSE 0 END),0) AS paid_revenue, COUNT(CASE WHEN payment_status='PAID' THEN 1 END) AS paid_orders, COUNT(*) AS total_orders FROM orders`),
    query(`SELECT status, COUNT(*) AS count FROM orders GROUP BY status ORDER BY count DESC`),
    query(`SELECT COUNT(*) AS total, SUM(CASE WHEN created_at >= DATE_SUB(NOW(), INTERVAL 30 DAY) THEN 1 ELSE 0 END) AS new_30d FROM users WHERE role='CUSTOMER' AND deleted_at IS NULL`),
    query(`SELECT COUNT(*) AS variants, COALESCE(SUM(GREATEST(i.quantity-i.reserved_quantity,0)),0) AS available_units, COALESCE(SUM(CASE WHEN i.quantity-i.reserved_quantity <= i.low_stock_threshold THEN 1 ELSE 0 END),0) AS low_stock FROM inventory i INNER JOIN product_variants v ON v.id=i.variant_id`),
    query(`SELECT o.id,o.order_number,o.status,o.payment_status,o.total_amount,o.created_at,u.email FROM orders o INNER JOIN users u ON u.id=o.user_id ORDER BY o.created_at DESC,o.id DESC LIMIT 8`),
    query(`SELECT oi.product_name, SUM(oi.quantity) AS units, SUM(oi.line_total) AS revenue FROM order_items oi INNER JOIN orders o ON o.id=oi.order_id WHERE o.payment_status='PAID' GROUP BY oi.product_name ORDER BY units DESC,revenue DESC LIMIT 5`),
  ]);
  return { sales: sales[0], orders, customers: customers[0], inventory: inventory[0], recentOrders, topProducts };
}

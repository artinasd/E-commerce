import { withTransaction } from '../db/connection.js';
import { releaseOrderInventory } from '../db/repositories/inventory.js';

export async function releaseExpiredReservations({ limit = 50 } = {}) {
  const batchSize = Math.min(Math.max(Number(limit) || 50, 1), 100);

  return withTransaction(async (connection) => {
    const [orders] = await connection.execute(
      `SELECT id FROM orders
        WHERE status = 'PENDING'
          AND payment_status = 'UNPAID'
          AND reservation_expires_at IS NOT NULL
          AND reservation_expires_at <= CURRENT_TIMESTAMP
        ORDER BY reservation_expires_at ASC, id ASC
        LIMIT ?
        FOR UPDATE`,
      [batchSize],
    );

    let released = 0;
    for (const order of orders) {
      await releaseOrderInventory(connection, order.id);
      const [result] = await connection.execute(
        `UPDATE orders SET status = 'CANCELLED', payment_status = 'FAILED', reservation_expires_at = NULL, updated_at = CURRENT_TIMESTAMP
          WHERE id = ? AND status = 'PENDING' AND payment_status = 'UNPAID'`,
        [order.id],
      );
      released += result.affectedRows;
    }

    return { released };
  });
}

ALTER TABLE payments
  MODIFY COLUMN status ENUM('PENDING','PAID','FAILED','CANCELLED','EXPIRED','REFUNDED') NOT NULL DEFAULT 'PENDING';

ALTER TABLE orders
  ADD COLUMN reservation_expires_at DATETIME NULL AFTER placed_at,
  ADD KEY idx_orders_reservation_expiry (status, payment_status, reservation_expires_at);

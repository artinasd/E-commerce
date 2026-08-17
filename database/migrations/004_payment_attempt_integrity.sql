ALTER TABLE payments
  ADD UNIQUE KEY uq_payments_provider_reference (provider, provider_reference);

ALTER TABLE payments
  ADD KEY idx_payments_order_status (order_id, status, created_at);

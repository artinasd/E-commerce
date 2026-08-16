USE ecommerce;

CREATE TABLE shipping_methods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  code VARCHAR(50) NOT NULL,
  description VARCHAR(500) NULL,
  base_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  free_shipping_minimum BIGINT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  deleted_at DATETIME NULL,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shipping_methods_code (code),
  KEY idx_shipping_methods_active_sort (is_active, deleted_at, sort_order)
) ENGINE=InnoDB;

CREATE TABLE shipping_method_provinces (
  shipping_method_id BIGINT UNSIGNED NOT NULL,
  province VARCHAR(100) NOT NULL,
  PRIMARY KEY (shipping_method_id, province),
  KEY idx_shipping_method_provinces_province (province),
  CONSTRAINT fk_shipping_method_provinces_method FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

INSERT INTO shipping_methods
  (name, code, description, base_amount, free_shipping_minimum, is_active, sort_order)
VALUES
  ('پست پیشتاز', 'POST_EXPRESS', 'ارسال با پست پیشتاز', 0, NULL, TRUE, 10),
  ('ارسال سریع', 'EXPRESS', 'ارسال سریع شهری و بین‌شهری', 0, NULL, TRUE, 20);

ALTER TABLE orders
  ADD COLUMN shipping_method_id BIGINT UNSIGNED NULL AFTER shipping_amount,
  ADD COLUMN shipping_method_name VARCHAR(150) NULL AFTER shipping_method_id,
  ADD COLUMN reservation_expires_at DATETIME NULL AFTER placed_at,
  ADD KEY idx_orders_shipping_method (shipping_method_id),
  ADD CONSTRAINT fk_orders_shipping_method FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL;

CREATE TABLE shipping_methods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(120) NOT NULL,
  code VARCHAR(64) NOT NULL,
  description VARCHAR(500) NULL,
  base_amount BIGINT UNSIGNED NOT NULL DEFAULT 0,
  free_shipping_minimum BIGINT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  deleted_at DATETIME NULL,
  PRIMARY KEY (id),
  UNIQUE KEY uq_shipping_methods_code (code),
  KEY idx_shipping_methods_active_sort (is_active, sort_order),
  CONSTRAINT chk_shipping_methods_free_minimum CHECK (free_shipping_minimum IS NULL OR free_shipping_minimum >= base_amount)
) ENGINE=InnoDB;

CREATE TABLE shipping_method_provinces (
  shipping_method_id BIGINT UNSIGNED NOT NULL,
  province VARCHAR(100) NOT NULL,
  PRIMARY KEY (shipping_method_id, province),
  KEY idx_shipping_province (province),
  CONSTRAINT fk_shipping_method_provinces_method FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE CASCADE
) ENGINE=InnoDB;

ALTER TABLE orders ADD COLUMN shipping_method_id BIGINT UNSIGNED NULL AFTER shipping_amount;
ALTER TABLE orders ADD COLUMN shipping_method_name VARCHAR(120) NULL AFTER shipping_method_id;
ALTER TABLE orders ADD KEY idx_orders_shipping_method (shipping_method_id);
ALTER TABLE orders ADD CONSTRAINT fk_orders_shipping_method FOREIGN KEY (shipping_method_id) REFERENCES shipping_methods(id) ON DELETE SET NULL;

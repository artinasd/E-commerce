USE ecommerce;

CREATE TABLE shipping_methods (
  id BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
  name VARCHAR(150) NOT NULL,
  description VARCHAR(500) NULL,
  price BIGINT UNSIGNED NOT NULL DEFAULT 0,
  estimated_min_days TINYINT UNSIGNED NULL,
  estimated_max_days TINYINT UNSIGNED NULL,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  sort_order INT NOT NULL DEFAULT 0,
  created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (id),
  KEY idx_shipping_methods_active_sort (is_active, sort_order)
) ENGINE=InnoDB;

INSERT INTO shipping_methods
  (name, description, price, estimated_min_days, estimated_max_days, is_active, sort_order)
VALUES
  ('پست پیشتاز', 'ارسال با پست پیشتاز', 0, 2, 5, TRUE, 10),
  ('ارسال سریع', 'ارسال سریع شهری و بین‌شهری', 0, 1, 3, TRUE, 20);

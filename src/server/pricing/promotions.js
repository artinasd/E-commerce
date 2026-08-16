function normalizeCode(code) {
  return typeof code === 'string' ? code.trim().toUpperCase() : '';
}

function assertMoney(value, fieldName) {
  if (!Number.isSafeInteger(value) || value < 0) throw new Error(`Invalid ${fieldName}.`);
}

export async function findApplicablePromotion(connection, { userId, code, subtotal }) {
  const normalizedCode = normalizeCode(code);
  assertMoney(subtotal, 'subtotal');
  if (!normalizedCode) return null;

  const [rows] = await connection.execute(
    `SELECT p.id, p.name, p.code, p.discount_type, p.discount_value, p.minimum_subtotal,
            p.maximum_discount, p.starts_at, p.ends_at, p.usage_limit, p.per_user_limit,
            p.usage_count,
            COALESCE((SELECT COUNT(*) FROM promotion_redemptions pr WHERE pr.promotion_id = p.id AND pr.user_id = ?), 0) AS user_usage_count
       FROM promotions p
      WHERE p.code = ?
        AND p.is_active = TRUE
        AND p.deleted_at IS NULL
        AND (p.starts_at IS NULL OR p.starts_at <= CURRENT_TIMESTAMP)
        AND (p.ends_at IS NULL OR p.ends_at > CURRENT_TIMESTAMP)
      LIMIT 1
      FOR UPDATE`,
    [userId, normalizedCode],
  );

  const promotion = rows[0];
  if (!promotion) throw new Error('Promotion code is invalid or unavailable.');
  if (subtotal < Number(promotion.minimum_subtotal)) throw new Error('Order subtotal does not meet the promotion minimum.');
  if (promotion.usage_limit !== null && Number(promotion.usage_count) >= Number(promotion.usage_limit)) throw new Error('Promotion usage limit has been reached.');
  if (promotion.per_user_limit !== null && Number(promotion.user_usage_count) >= Number(promotion.per_user_limit)) throw new Error('You have already used this promotion the maximum number of times.');

  let discountAmount;
  if (promotion.discount_type === 'PERCENTAGE') {
    discountAmount = Math.floor(subtotal * Number(promotion.discount_value) / 10000);
  } else {
    discountAmount = Number(promotion.discount_value);
  }
  if (promotion.maximum_discount !== null) discountAmount = Math.min(discountAmount, Number(promotion.maximum_discount));
  discountAmount = Math.min(discountAmount, subtotal);
  assertMoney(discountAmount, 'discount amount');
  if (discountAmount === 0) throw new Error('Promotion does not produce a discount for this order.');

  return { id: Number(promotion.id), code: promotion.code, name: promotion.name, discountAmount };
}

export async function recordPromotionRedemption(connection, { promotionId, userId, orderId, discountAmount }) {
  assertMoney(discountAmount, 'discount amount');
  await connection.execute(
    `INSERT INTO promotion_redemptions (promotion_id, user_id, order_id, discount_amount)
     VALUES (?, ?, ?, ?)`,
    [promotionId, userId, orderId, discountAmount],
  );
  const [result] = await connection.execute(
    `UPDATE promotions SET usage_count = usage_count + 1 WHERE id = ? AND (usage_limit IS NULL OR usage_count < usage_limit)`,
    [promotionId],
  );
  if (result.affectedRows !== 1) throw new Error('Promotion usage limit has been reached.');
}

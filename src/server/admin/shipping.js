import { query, withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);
function money(value, field) { const amount = Number(value); if (!Number.isSafeInteger(amount) || amount < 0) throw new Error(`${field} نامعتبر است.`); return amount; }

export async function listAdminShippingMethods() { await admin(); return query(`SELECT id,name,code,description,base_amount,free_shipping_minimum,is_active,sort_order FROM shipping_methods WHERE deleted_at IS NULL ORDER BY sort_order ASC,id ASC`); }
export async function updateAdminShippingMethod(id, payload) {
  await admin();
  const methodId = Number(id);
  if (!Number.isSafeInteger(methodId) || methodId < 1) throw new Error('روش ارسال نامعتبر است.');
  const baseAmount = money(payload?.baseAmount, 'هزینه ارسال');
  const minimum = payload?.freeShippingMinimum === '' || payload?.freeShippingMinimum == null ? null : money(payload.freeShippingMinimum, 'حداقل مبلغ ارسال رایگان');
  await withTransaction(async (connection) => { const [result] = await connection.execute(`UPDATE shipping_methods SET base_amount=?,free_shipping_minimum=?,updated_at=CURRENT_TIMESTAMP WHERE id=? AND deleted_at IS NULL LIMIT 1`, [baseAmount, minimum, methodId]); if (result.affectedRows !== 1) throw new Error('روش ارسال پیدا نشد.'); });
  const rows = await query(`SELECT id,name,code,description,base_amount,free_shipping_minimum,is_active,sort_order FROM shipping_methods WHERE id=? LIMIT 1`, [methodId]);
  return rows[0];
}

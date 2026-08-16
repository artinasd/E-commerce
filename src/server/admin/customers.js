import { query, withTransaction } from '../db/connection.js';
import { requireRole } from '../../lib/auth/session.js';

const admin = () => requireRole(['ADMIN', 'SUPER_ADMIN']);

export async function listAdminCustomers({ search = null, limit = 50, offset = 0 } = {}) {
  await admin(); const params=[]; const where=['u.deleted_at IS NULL'];
  if(search){where.push('(u.email LIKE ? OR u.phone LIKE ? OR u.first_name LIKE ? OR u.last_name LIKE ?)');const q=`%${search}%`;params.push(q,q,q,q);}
  const l=Math.min(Math.max(Number(limit)||50,1),100), o=Math.max(Number(offset)||0,0);
  return query(`SELECT u.id,u.email,u.phone,u.first_name,u.last_name,u.is_active,u.created_at,COUNT(DISTINCT ord.id) order_count,COALESCE(SUM(CASE WHEN ord.payment_status='PAID' THEN ord.total_amount ELSE 0 END),0) paid_total FROM users u LEFT JOIN orders ord ON ord.user_id=u.id WHERE ${where.join(' AND ')} GROUP BY u.id ORDER BY u.created_at DESC,u.id DESC LIMIT ${l} OFFSET ${o}`,params);
}

export async function getAdminCustomer(userId){
  await admin();
  const [users,orders,addresses]=await Promise.all([
    query(`SELECT id,email,phone,first_name,last_name,role,is_active,email_verified_at,phone_verified_at,created_at,updated_at FROM users WHERE id=? AND deleted_at IS NULL LIMIT 1`,[userId]),
    query(`SELECT id,order_number,status,payment_status,total_amount,created_at,placed_at FROM orders WHERE user_id=? ORDER BY created_at DESC,id DESC`,[userId]),
    query(`SELECT id,recipient_name,recipient_phone,province,city,address_line,postal_code,is_default FROM addresses WHERE user_id=? ORDER BY is_default DESC,id DESC`,[userId]),
  ]);
  return users[0]?{customer:users[0],orders,addresses}:null;
}

export async function setCustomerActive(userId,isActive){
  await admin();
  return withTransaction(async(connection)=>{
    const [result]=await connection.execute(`UPDATE users SET is_active=? WHERE id=? AND deleted_at IS NULL AND role='CUSTOMER'`,[Boolean(isActive),userId]);
    if(result.affectedRows!==1)throw new Error('Customer not found.');
    return {id:Number(userId),isActive:Boolean(isActive)};
  });
}

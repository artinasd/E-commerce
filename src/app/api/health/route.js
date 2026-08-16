import { query } from '../../../server/db/connection.js';

export async function GET() {
  try {
    await query('SELECT 1 AS ok');
    return Response.json({ success: true, data: { status: 'ok', database: 'ok' } }, {
      status: 200,
      headers: { 'Cache-Control': 'no-store' },
    });
  } catch (error) {
    console.error('[HEALTH]', error);
    return Response.json({ success: false, error: { code: 'SERVICE_UNAVAILABLE', message: 'Service unavailable.' } }, {
      status: 503,
      headers: { 'Cache-Control': 'no-store' },
    });
  }
}

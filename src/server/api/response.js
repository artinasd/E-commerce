export function apiSuccess(data = null, { status = 200, meta = null } = {}) {
  return Response.json({
    success: true,
    data,
    ...(meta ? { meta } : {}),
  }, {
    status,
    headers: { 'Cache-Control': 'no-store' },
  });
}

export function apiCreated(data = null) {
  return apiSuccess(data, { status: 201 });
}

export function apiNoContent() {
  return new Response(null, { status: 204 });
}

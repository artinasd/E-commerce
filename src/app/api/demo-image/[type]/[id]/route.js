export async function GET(request, { params }) {
  const { type, id } = await params;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="400" viewBox="0 0 400 400"><rect width="400" height="400" fill="#f3f4f6"/><text x="50%" y="50%" font-family="sans-serif" font-size="24" fill="#6b7280" text-anchor="middle" dy=".3em">${type} ${id}</text></svg>`;
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

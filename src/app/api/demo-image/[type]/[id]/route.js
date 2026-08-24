export const runtime = 'edge';

function escapeXml(value) {
  return String(value).replace(/[<>&'\"]/g, (char) => ({
    '<': '&lt;', '>': '&gt;', '&': '&amp;', "'": '&apos;', '"': '&quot;',
  })[char]);
}

function colorFromId(id) {
  let hash = 0;
  for (const char of String(id)) hash = (hash * 31 + char.charCodeAt(0)) >>> 0;
  const hue = hash % 360;
  return [`hsl(${hue} 70% 38%)`, `hsl(${(hue + 35) % 360} 78% 58%)`];
}

export async function GET(request, { params }) {
  const { type, id } = await params;
  const [start, end] = colorFromId(id);
  const label = type === 'product' ? 'PRODUCT' : String(type || 'IMAGE').toUpperCase();
  const safeId = escapeXml(id);

  const svg = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="1200" viewBox="0 0 1200 1200">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${start}"/>
      <stop offset="100%" stop-color="${end}"/>
    </linearGradient>
    <radialGradient id="glow" cx="50%" cy="38%" r="60%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity=".28"/>
      <stop offset="100%" stop-color="#ffffff" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="1200" height="1200" fill="url(#bg)"/>
  <rect width="1200" height="1200" fill="url(#glow)"/>
  <circle cx="600" cy="480" r="220" fill="#ffffff" fill-opacity=".12"/>
  <rect x="360" y="250" width="480" height="520" rx="36" fill="#ffffff" fill-opacity=".9"/>
  <path d="M440 680 L520 570 L610 650 L700 520 L800 680 Z" fill="${start}" fill-opacity=".18"/>
  <circle cx="680" cy="400" r="48" fill="${end}" fill-opacity=".5"/>
  <text x="600" y="880" text-anchor="middle" font-family="Arial, sans-serif" font-size="56" font-weight="700" fill="#ffffff">${label}</text>
  <text x="600" y="950" text-anchor="middle" font-family="Arial, sans-serif" font-size="30" fill="#ffffff" fill-opacity=".86">Demo image • ${safeId}</text>
</svg>`;

  return new Response(svg, {
    status: 200,
    headers: {
      'Content-Type': 'image/svg+xml; charset=utf-8',
      'Cache-Control': 'public, max-age=31536000, immutable',
    },
  });
}

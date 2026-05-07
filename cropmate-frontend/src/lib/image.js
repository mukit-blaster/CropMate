// Inline SVG data-URI used as a fallback when an item image fails to load.
// CropMate-branded: dark teal background, primary green leaf, "CropMate" wordmark.
const FALLBACK_SVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 300">
  <defs>
    <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#03373D"/>
      <stop offset="100%" stop-color="#0a5e63"/>
    </linearGradient>
  </defs>
  <rect width="400" height="300" fill="url(#bg)"/>
  <g transform="translate(200 130)">
    <path d="M0 0 C -45 -55 -45 -110 0 -110 C 0 -55 45 -55 0 0 Z" fill="#CAEB66"/>
    <line x1="0" y1="0" x2="0" y2="40" stroke="#CAEB66" stroke-width="6" stroke-linecap="round"/>
  </g>
  <text x="200" y="240" text-anchor="middle" fill="#ffffff"
        font-family="Urbanist, system-ui, sans-serif" font-size="22" font-weight="800">
    Crop<tspan fill="#CAEB66">Mate</tspan>
  </text>
  <text x="200" y="265" text-anchor="middle" fill="#9ec0c4"
        font-family="Urbanist, system-ui, sans-serif" font-size="12">
    image unavailable
  </text>
</svg>`.trim();

export const FALLBACK_IMAGE = `data:image/svg+xml;utf8,${encodeURIComponent(FALLBACK_SVG)}`;

export function handleImageError(e) {
  const img = e.currentTarget;
  if (img.dataset.fallbackApplied === '1') return;
  img.dataset.fallbackApplied = '1';
  img.src = FALLBACK_IMAGE;
}

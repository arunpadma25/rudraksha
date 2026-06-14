import { NextRequest } from "next/server";

// Generates an SVG placeholder image of a rudraksha bead with grooves
// representing the number of faces (mukhi). Keeps the app fully offline-friendly.

function beadSvg(mukhi: number, label: string): string {
  const size = 600;
  const cx = size / 2;
  const cy = size / 2;
  const r = 210;

  // Grooves (faces). For special beads (mukhi 0) we draw a softer texture.
  const faces = mukhi > 0 ? mukhi : 6;
  const grooves: string[] = [];
  for (let i = 0; i < faces; i++) {
    const x = cx - r + ((i + 0.5) * (2 * r)) / faces;
    grooves.push(
      `<path d="M ${x} ${cy - Math.sqrt(Math.max(0, r * r - (x - cx) * (x - cx)))} ` +
        `Q ${x + 6} ${cy} ${x} ${cy + Math.sqrt(Math.max(0, r * r - (x - cx) * (x - cx)))}" ` +
        `stroke="rgba(60,28,10,0.55)" stroke-width="3" fill="none"/>`
    );
  }

  const badge = mukhi > 0 ? `${mukhi}` : "\u2728";

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" width="${size}" height="${size}" viewBox="0 0 ${size} ${size}">
  <defs>
    <radialGradient id="bg" cx="50%" cy="35%" r="80%">
      <stop offset="0%" stop-color="#fff7ed"/>
      <stop offset="100%" stop-color="#fde8d0"/>
    </radialGradient>
    <radialGradient id="bead" cx="38%" cy="32%" r="75%">
      <stop offset="0%" stop-color="#a9622f"/>
      <stop offset="55%" stop-color="#7c3f1a"/>
      <stop offset="100%" stop-color="#4a230d"/>
    </radialGradient>
    <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
      <feDropShadow dx="0" dy="10" stdDeviation="14" flood-color="rgba(74,35,13,0.35)"/>
    </filter>
  </defs>
  <rect width="${size}" height="${size}" fill="url(#bg)"/>
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="url(#bead)" filter="url(#shadow)"/>
  <ellipse cx="${cx - 70}" cy="${cy - 80}" rx="60" ry="38" fill="rgba(255,255,255,0.18)"/>
  ${grooves.join("\n  ")}
  <circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="2"/>
  <g>
    <circle cx="${cx}" cy="${size - 70}" r="46" fill="#7c2d12"/>
    <text x="${cx}" y="${size - 70}" text-anchor="middle" dominant-baseline="central"
      font-family="Georgia, serif" font-size="${mukhi > 9 ? 34 : 40}" fill="#fff7ed" font-weight="700">${badge}</text>
  </g>
  <text x="${cx}" y="60" text-anchor="middle" font-family="Georgia, serif" font-size="26" fill="#7c2d12" font-weight="600">${escapeXml(
    label
  )}</text>
</svg>`;
}

function escapeXml(s: string): string {
  return s.replace(/[<>&'"]/g, (c) =>
    c === "<" ? "&lt;" : c === ">" ? "&gt;" : c === "&" ? "&amp;" : c === "'" ? "&apos;" : "&quot;"
  );
}

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const mukhi = Number.parseInt(searchParams.get("mukhi") ?? "5", 10) || 0;
  const label = (searchParams.get("label") ?? "Rudraksha").slice(0, 24);
  const svg = beadSvg(mukhi, mukhi > 0 ? `${mukhi} Mukhi` : label);

  return new Response(svg, {
    headers: {
      "Content-Type": "image/svg+xml",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

// The 1200x630 card a shared link unfurls to. There was no og:image at all, so
// every link posted to iMessage, Slack or LinkedIn showed a grey box.
//
// Drawn as SVG and rasterised rather than composed from the site's own type,
// because the card has to render identically on services that do not load web
// fonts -- hence the system stack, not Inter.
import sharp from 'sharp';

const NAVY = '#0F2847';
const GOLD = '#B8972A';

const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1200" height="630">
  <rect width="1200" height="630" fill="${NAVY}"/>
  <rect x="0" y="0" width="1200" height="6" fill="${GOLD}"/>

  <g transform="translate(80,74)">
    <rect width="58" height="58" rx="11" fill="#FFFFFF"/>
    <text x="29" y="38" text-anchor="middle" font-family="Arial, Helvetica, sans-serif"
          font-size="20" font-weight="700" letter-spacing="-0.5">
      <tspan fill="${GOLD}">AI</tspan><tspan fill="${GOLD}">&#183;</tspan><tspan fill="${NAVY}">IG</tspan>
    </text>
    <text x="76" y="37" font-family="Arial, Helvetica, sans-serif" font-size="25" font-weight="700">
      <tspan fill="#FFFFFF">The AI Insurance</tspan><tspan fill="${GOLD}" dx="8">Group</tspan>
    </text>
  </g>

  <text x="80" y="288" font-family="Arial, Helvetica, sans-serif" font-size="62"
        font-weight="700" fill="#FFFFFF" letter-spacing="-1.6">Free insurance review.</text>
  <text x="80" y="362" font-family="Arial, Helvetica, sans-serif" font-size="62"
        font-weight="700" fill="${GOLD}" letter-spacing="-1.6">No obligation.</text>

  <text x="80" y="438" font-family="Arial, Helvetica, sans-serif" font-size="27" fill="rgba(255,255,255,0.74)">
    We read your current policy and tell you what it actually covers.
  </text>

  <rect x="80" y="498" width="86" height="3" fill="${GOLD}"/>
  <text x="80" y="552" font-family="Arial, Helvetica, sans-serif" font-size="22" fill="rgba(255,255,255,0.6)">
    Home · Auto · Business  |  Licensed in New Jersey, Pennsylvania &amp; Florida
  </text>
</svg>`;

const out = 'C:/Users/gathe/Documents/theaiinsurancegroup/public/og-card.png';
const info = await sharp(Buffer.from(svg)).png({ compressionLevel: 9 }).toFile(out);
console.log(`og-card.png  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(1)} KB`);

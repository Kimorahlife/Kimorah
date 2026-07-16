import React from "react";

/**
 * Atmospheric "ethereal valley" backdrop, drawn entirely in SVG so it needs no
 * image asset. It evokes the misty mountains + waterfall look; drop a real
 * photo at `public/landing-bg.jpg` and it layers on top of this automatically.
 */
const LandingBackground: React.FC = () => (
  <svg
    viewBox="0 0 390 780"
    preserveAspectRatio="xMidYMid slice"
    aria-hidden="true"
    style={{ position: "absolute", inset: 0, width: "100%", height: "100%" }}
  >
    <defs>
      <linearGradient id="kb-sky" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ece6f6" />
        <stop offset="45%" stopColor="#d9d0ec" />
        <stop offset="100%" stopColor="#bcb0da" />
      </linearGradient>
      <radialGradient id="kb-sun" cx="50%" cy="18%" r="34%">
        <stop offset="0%" stopColor="#f6ecc9" stopOpacity="0.75" />
        <stop offset="100%" stopColor="#f6ecc9" stopOpacity="0" />
      </radialGradient>
      <linearGradient id="kb-fall" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%" stopColor="#ffffff" stopOpacity="0.85" />
        <stop offset="100%" stopColor="#cdddea" stopOpacity="0.35" />
      </linearGradient>
      <filter id="kb-soft" x="-40%" y="-40%" width="180%" height="180%">
        <feGaussianBlur stdDeviation="9" />
      </filter>
    </defs>

    {/* Sky + sun haze */}
    <rect x="0" y="0" width="390" height="780" fill="url(#kb-sky)" />
    <rect x="0" y="0" width="390" height="780" fill="url(#kb-sun)" />

    {/* Far peaks (lightest — atmospheric distance) */}
    <path
      d="M0,780 L0,330 L70,360 L120,300 L175,360 L215,330 L270,300 L330,355 L390,320 L390,780 Z"
      fill="#c6bbe0"
      opacity="0.55"
    />

    {/* Mid valley walls, opening a channel in the centre */}
    <path d="M0,780 L0,300 L55,330 L110,420 L150,560 L165,780 Z" fill="#a396c9" opacity="0.8" />
    <path d="M390,780 L390,300 L335,330 L280,420 L240,560 L225,780 Z" fill="#a396c9" opacity="0.8" />

    {/* Waterfall + pool in the channel */}
    <rect x="171" y="300" width="48" height="330" fill="url(#kb-fall)" rx="6" />
    <ellipse cx="195" cy="636" rx="46" ry="12" fill="#c3d4e4" opacity="0.7" />
    <ellipse cx="195" cy="636" rx="30" ry="7" fill="#dceaf3" opacity="0.7" />

    {/* Near walls (darker, green-tinged foreground) */}
    <path d="M0,780 L0,470 L70,520 L140,610 L175,780 Z" fill="#5f7a78" opacity="0.85" />
    <path d="M390,780 L390,470 L320,520 L250,610 L215,780 Z" fill="#5f7a78" opacity="0.85" />
    {/* River to the base */}
    <path d="M175,780 L215,780 L205,650 L185,650 Z" fill="#b9cad9" opacity="0.8" />

    {/* Drifting mist bands */}
    <ellipse cx="150" cy="430" rx="150" ry="20" fill="#ffffff" opacity="0.35" filter="url(#kb-soft)" />
    <ellipse cx="270" cy="520" rx="140" ry="18" fill="#ffffff" opacity="0.28" filter="url(#kb-soft)" />
    <ellipse cx="195" cy="600" rx="120" ry="16" fill="#ffffff" opacity="0.3" filter="url(#kb-soft)" />

    {/* Birds */}
    <g stroke="#5b5480" strokeWidth="1.4" fill="none" opacity="0.6" strokeLinecap="round">
      <path d="M250,395 q4,-4 8,0 q4,-4 8,0" />
      <path d="M272,410 q3.5,-3.5 7,0 q3.5,-3.5 7,0" />
      <path d="M238,420 q3,-3 6,0 q3,-3 6,0" />
    </g>
  </svg>
);

export default LandingBackground;

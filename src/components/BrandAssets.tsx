import React from 'react';

/**
 * State Emblem of India (Ashoka Lion Capital) SVG Vector
 */
export const EmblemOfIndia: React.FC<{ className?: string }> = ({ className = 'w-10 h-14' }) => (
  <svg
    viewBox="0 0 100 130"
    fill="currentColor"
    className={className}
    aria-label="State Emblem of India"
  >
    {/* Stylized Ashoka Stambh Lions */}
    <g fill="currentColor">
      {/* Central Lion Head & Mane */}
      <path d="M42 20 C42 12, 58 12, 58 20 C64 22, 68 28, 66 35 C64 42, 58 46, 50 46 C42 46, 36 42, 34 35 C32 28, 36 22, 42 20 Z" />
      <path d="M47 24 C45 28, 45 32, 50 35 C55 32, 55 28, 53 24 Z" fill="#ffffff" opacity="0.4" />
      {/* Left Lion Head */}
      <path d="M26 24 C22 25, 18 32, 22 38 C26 44, 34 44, 38 38 C39 33, 35 25, 26 24 Z" />
      {/* Right Lion Head */}
      <path d="M74 24 C78 25, 82 32, 78 38 C74 44, 66 44, 62 38 C61 33, 65 25, 74 24 Z" />
      {/* Lion Bodies / Chest */}
      <path d="M30 42 C30 52, 38 65, 50 67 C62 65, 70 52, 70 42 C62 48, 38 48, 30 42 Z" />
      {/* Abacus / Base Platform */}
      <rect x="18" y="70" width="64" height="6" rx="2" />
      {/* Ashoka Chakra in Central Base */}
      <circle cx="50" cy="85" r="9" fill="none" stroke="currentColor" strokeWidth="2" />
      <circle cx="50" cy="85" r="2.5" />
      {/* Galloping Horse and Bull on sides */}
      <path d="M24 81 C22 84, 25 89, 31 87 C33 84, 31 80, 27 80 Z" />
      <path d="M76 81 C78 84, 75 89, 69 87 C67 84, 69 80, 73 80 Z" />
      {/* Bell / Lotus Base */}
      <path d="M22 93 C26 90, 74 90, 78 93 C76 102, 65 106, 50 106 C35 106, 24 102, 22 93 Z" />
      {/* Plinth */}
      <rect x="14" y="107" width="72" height="4" rx="1" />
    </g>
    {/* Devnagari Motto: सत्यमेव जयते */}
    <text
      x="50"
      y="122"
      textAnchor="middle"
      fontSize="10"
      fontFamily="'Noto Sans Devanagari', 'Segoe UI', Arial, sans-serif"
      fontWeight="bold"
      letterSpacing="1"
      fill="currentColor"
    >
      सत्यमेव जयते
    </text>
  </svg>
);

/**
 * PAKSHYA Central Circular Rupee + Package Logo
 */
export const PakshyaLogo: React.FC<{ className?: string }> = ({ className = 'w-10 h-10' }) => (
  <div className={`relative flex items-center justify-center ${className}`}>
    {/* Teal circular rupee coin */}
    <div className="w-10 h-10 rounded-full bg-[#008080] text-white flex items-center justify-center font-bold text-xl shadow-md border-2 border-[#006666]">
      <span>₹</span>
    </div>
    {/* 3D Package overlay on bottom-right */}
    <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#d97706] rounded-xs shadow-md border border-[#92400e] flex items-center justify-center text-[8px] text-white font-mono font-bold">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="w-3.5 h-3.5 text-amber-100">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    </div>
  </div>
);

/**
 * India Gate Architectural Silhouette Watermark
 */
export const IndiaGateWatermark: React.FC<{ className?: string }> = ({ className = 'w-48 h-28 opacity-15' }) => (
  <svg
    viewBox="0 0 160 120"
    fill="currentColor"
    className={className}
    aria-hidden="true"
  >
    {/* Stepped Base */}
    <rect x="10" y="112" width="140" height="4" />
    <rect x="15" y="108" width="130" height="4" />
    <rect x="22" y="104" width="116" height="4" />

    {/* Main Pylons */}
    <rect x="26" y="44" width="30" height="60" />
    <rect x="104" y="44" width="30" height="60" />

    {/* Center Arch */}
    <path d="M56 104 L56 66 C56 50, 104 50, 104 66 L104 104 Z" />

    {/* Entablature / Upper Stories */}
    <rect x="22" y="38" width="116" height="6" />
    <rect x="24" y="26" width="112" height="12" />
    <rect x="20" y="22" width="120" height="4" />
    <rect x="30" y="14" width="100" height="8" />
    {/* Top Dome Bowl */}
    <path d="M60 14 C60 8, 100 8, 100 14 Z" />
  </svg>
);

/**
 * Tricolor Wave Ribbon for Header
 */
export const TricolorFlourish: React.FC<{ className?: string }> = ({ className = 'w-56 h-16' }) => (
  <svg viewBox="0 0 200 60" fill="none" className={className} preserveAspectRatio="none">
    {/* Saffron Wave */}
    <path
      d="M0 10 C60 0, 140 30, 200 5 L200 22 C140 45, 60 15, 0 25 Z"
      fill="#ff9933"
      opacity="0.85"
    />
    {/* White Ribbon */}
    <path
      d="M0 24 C60 14, 140 44, 200 21 L200 36 C140 58, 60 28, 0 38 Z"
      fill="#ffffff"
      opacity="0.9"
    />
    {/* Green Wave */}
    <path
      d="M0 37 C60 27, 140 57, 200 35 L200 52 C140 70, 60 40, 0 50 Z"
      fill="#138808"
      opacity="0.85"
    />
  </svg>
);

/**
 * Make in India Lion Silhouette with Gears
 */
export const MakeInIndiaLogo: React.FC<{ className?: string }> = ({ className = 'h-8 w-auto' }) => (
  <div className={`flex items-center gap-2 ${className}`}>
    {/* Silhouette of Gear Lion */}
    <svg viewBox="0 0 120 60" fill="currentColor" className="w-20 h-10 text-slate-800">
      <path d="M10 38 C12 30, 20 22, 32 20 C42 16, 52 18, 64 22 C75 16, 88 16, 98 22 C104 26, 110 34, 108 42 C102 48, 92 48, 84 46 C76 48, 68 46, 60 44 C52 46, 44 48, 36 46 C28 48, 18 48, 12 42 Z" />
      <circle cx="34" cy="30" r="4" fill="#ffffff" />
      <circle cx="58" cy="32" r="5" fill="#ffffff" />
      <circle cx="82" cy="30" r="4" fill="#ffffff" />
      {/* Paws */}
      <rect x="22" y="44" width="6" height="12" rx="2" />
      <rect x="36" y="44" width="6" height="12" rx="2" />
      <rect x="74" y="44" width="6" height="12" rx="2" />
      <rect x="88" y="44" width="6" height="12" rx="2" />
      {/* Tail */}
      <path d="M14 34 C8 32, 6 22, 10 18 C12 16, 14 18, 12 22 C10 26, 12 30, 14 34 Z" />
    </svg>
    <div className="leading-tight">
      <div className="text-[11px] font-black tracking-wider text-slate-900 uppercase">
        MAKE IN INDIA
      </div>
      <div className="text-[9px] text-slate-500">
        Atmanirbhar Bharat • Strong Markets
      </div>
    </div>
  </div>
);

/**
 * Generic Official Packaged Commodity Icon Graphic (Neutral, non-branded)
 */
export const GenericPackageIcon: React.FC<{ 
  variant?: 'compliant' | 'violation' | 'neutral'; 
  className?: string;
}> = ({ variant = 'neutral', className = 'w-12 h-14' }) => {
  const bg = variant === 'compliant' 
    ? 'bg-emerald-50 border-emerald-300 text-emerald-700' 
    : variant === 'violation' 
    ? 'bg-red-50 border-red-300 text-red-700' 
    : 'bg-slate-100 border-slate-300 text-slate-700';

  return (
    <div className={`rounded-md border flex flex-col items-center justify-center p-1 relative shadow-2xs ${bg} ${className}`}>
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" className="w-6 h-6 mb-0.5">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
      <span className="text-[7px] font-mono font-bold tracking-tight uppercase">
        SAMPLE
      </span>
    </div>
  );
};

import { motion, MotionValue, useTransform } from "framer-motion";
import { BOTTLE_FILL_START, BOTTLE_FILL_END } from "@/lib/ingredients";

interface BottleProps {
  progress: MotionValue<number>;
}

export function Bottle({ progress }: BottleProps) {
  // Body ellipse: cx=100 cy=158 ry=80 → bottom=238, top=78
  // Fill rises from empty (238) to full (78) across the entire fly phase
  const clipY      = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_END], [238, 78]);
  const oilOpacity = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_START + 0.04], [0, 1]);

  return (
    <div className="relative w-[200px] md:w-[280px] max-w-full">
      <svg
        viewBox="0 0 200 260"
        className="w-full h-auto overflow-visible"
        style={{ filter: "drop-shadow(0px 16px 36px rgba(0,0,0,0.10))" }}
      >
        <defs>
          <linearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#edd96a" stopOpacity="0.80" />
            <stop offset="50%"  stopColor="#c9a84c" stopOpacity="0.88" />
            <stop offset="100%" stopColor="#9a7020" stopOpacity="0.94" />
          </linearGradient>

          <linearGradient id="bodyGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="60%"  stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e8e8e8" />
          </linearGradient>

          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#eaca5a" />
            <stop offset="40%"  stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#9a7820" />
          </linearGradient>

          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#f0d870" />
            <stop offset="100%" stopColor="#9a7830" />
          </linearGradient>

          <radialGradient id="bodySheen" cx="35%" cy="35%" r="55%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.90)" />
            <stop offset="60%"  stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
          </radialGradient>

          {/* Clip the oil to the bottle body shape */}
          <clipPath id="bodyClip">
            <ellipse cx="100" cy="158" rx="82" ry="80" />
          </clipPath>

          {/* Fill level: rect's Y-top rises as ingredients pour in */}
          <clipPath id="fillClip">
            <motion.rect x="0" y={clipY} width="200" height="180" />
          </clipPath>
        </defs>

        {/* Ring */}
        <circle cx="100" cy="16" r="11"
          fill="none" stroke="url(#ringGrad)" strokeWidth="5.5" />

        {/* Cap neck */}
        <rect x="88" y="24" width="24" height="8" rx="2" fill="url(#capGrad)" />

        {/* Cap body */}
        <rect x="78" y="30" width="44" height="42" rx="5" fill="url(#capGrad)" />

        {/* Cap ribs */}
        {[36, 42, 48, 54, 60, 66].map((ry, i) => (
          <rect key={i} x="78" y={ry} width="44" height="2.5" rx="1"
            fill="rgba(0,0,0,0.07)" />
        ))}

        {/* Cap rim */}
        <rect x="75" y="68" width="50" height="8" rx="3" fill="url(#capGrad)" />

        {/* Bottle body */}
        <ellipse cx="100" cy="158" rx="82" ry="80"
          fill="url(#bodyGrad)" stroke="#e0e0e0" strokeWidth="1" />

        {/* Oil fill (clipped to bottle body + rising fill level) */}
        <motion.g style={{ opacity: oilOpacity }}>
          <ellipse cx="100" cy="158" rx="82" ry="80"
            fill="url(#oilFill)" clipPath="url(#fillClip)" />
        </motion.g>

        {/* Sheen on top */}
        <ellipse cx="100" cy="158" rx="82" ry="80" fill="url(#bodySheen)" />

        {/* Outline */}
        <ellipse cx="100" cy="158" rx="82" ry="80"
          fill="none" stroke="#d8d8d8" strokeWidth="1.5" />

        {/* Brand */}
        <text x="100" y="152" textAnchor="middle"
          fontSize="22" fontWeight="700" letterSpacing="3"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#c9a84c">
          YACHU
        </text>

        <path d="M 68,160 Q 100,168 132,160"
          fill="none" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.55" />

        <text x="100" y="174" textAnchor="middle"
          fontSize="9.5" fontStyle="italic" letterSpacing="1"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#999">
          Hair Oil
        </text>

        {/* Shine dots */}
        <ellipse cx="68" cy="120" rx="9"  ry="14" fill="rgba(255,255,255,0.40)" />
        <ellipse cx="73" cy="116" rx="4"  ry="6"  fill="rgba(255,255,255,0.55)" />
      </svg>
    </div>
  );
}

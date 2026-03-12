import { motion, MotionValue, useTransform } from "framer-motion";

interface BottleProps {
  progress: MotionValue<number>;
}

export function Bottle({ progress }: BottleProps) {
  const clipY = useTransform(progress, [0, 1], [195, 95]);
  const oilOpacity = useTransform(progress, [0, 0.04], [0, 1]);

  return (
    <div className="relative w-[260px] md:w-[340px] max-w-full">
      <svg
        viewBox="0 0 200 260"
        className="w-full h-auto overflow-visible"
        style={{ filter: "drop-shadow(0px 20px 40px rgba(0,0,0,0.12))" }}
      >
        <defs>
          <linearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8cf66" stopOpacity="0.82" />
            <stop offset="50%" stopColor="#c9a84c" stopOpacity="0.85" />
            <stop offset="100%" stopColor="#a07830" stopOpacity="0.9" />
          </linearGradient>

          <linearGradient id="bodyGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#ffffff" />
            <stop offset="60%" stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e8e8e8" />
          </linearGradient>

          <linearGradient id="capGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8c95a" />
            <stop offset="40%" stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#9a7830" />
          </linearGradient>

          <linearGradient id="ringGradient" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor="#f0d870" />
            <stop offset="100%" stopColor="#9a7830" />
          </linearGradient>

          <radialGradient id="bodySheen" cx="35%" cy="35%" r="55%">
            <stop offset="0%" stopColor="rgba(255,255,255,0.9)" />
            <stop offset="60%" stopColor="rgba(255,255,255,0.2)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)" />
          </radialGradient>

          <clipPath id="bodyClip">
            <ellipse cx="100" cy="158" rx="82" ry="80" />
          </clipPath>

          <clipPath id="fillClip">
            <motion.rect
              x="18"
              y={clipY}
              width="164"
              height="140"
            />
          </clipPath>
        </defs>

        {/* ── RING at the top ── */}
        <circle
          cx="100" cy="16" r="11"
          fill="none"
          stroke="url(#ringGradient)"
          strokeWidth="5.5"
        />

        {/* ── CAP / LID ── */}
        {/* Cap neck connector */}
        <rect x="88" y="24" width="24" height="8" rx="2" fill="url(#capGradient)" />

        {/* Main ribbed cap body */}
        <rect x="78" y="30" width="44" height="42" rx="5" fill="url(#capGradient)" />

        {/* Ribs on cap */}
        {[36, 42, 48, 54, 60, 66].map((y, i) => (
          <rect key={i} x="78" y={y} width="44" height="2.5" rx="1"
            fill="rgba(0,0,0,0.08)" />
        ))}

        {/* Cap bottom rim */}
        <rect x="75" y="68" width="50" height="8" rx="3" fill="url(#capGradient)" />

        {/* ── BOTTLE BODY (white round/globe shape) ── */}
        {/* Main body ellipse */}
        <ellipse
          cx="100" cy="158" rx="82" ry="80"
          fill="url(#bodyGradient)"
          stroke="#e0e0e0"
          strokeWidth="1"
        />

        {/* Oil fill (clipped to body shape) */}
        <motion.g style={{ opacity: oilOpacity }}>
          <ellipse
            cx="100" cy="158" rx="82" ry="80"
            fill="url(#oilFill)"
            clipPath="url(#fillClip)"
          />
        </motion.g>

        {/* Body sheen highlight */}
        <ellipse
          cx="100" cy="158" rx="82" ry="80"
          fill="url(#bodySheen)"
        />

        {/* Subtle outline */}
        <ellipse
          cx="100" cy="158" rx="82" ry="80"
          fill="none"
          stroke="#d8d8d8"
          strokeWidth="1.5"
        />

        {/* ── LABEL ── */}
        <text
          x="100" y="152"
          textAnchor="middle"
          fontSize="22"
          fontWeight="700"
          fontFamily="'Playfair Display', Georgia, serif"
          letterSpacing="3"
          fill="#c9a84c"
        >
          YACHU
        </text>

        {/* Decorative line under brand name */}
        <path
          d="M 68,160 Q 100,168 132,160"
          fill="none"
          stroke="#c9a84c"
          strokeWidth="1"
          strokeOpacity="0.6"
        />

        {/* Sub-label */}
        <text
          x="100" y="174"
          textAnchor="middle"
          fontSize="9.5"
          fontStyle="italic"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#888"
          letterSpacing="1"
        >
          Hair Oil
        </text>

        {/* Small shine dot */}
        <ellipse cx="68" cy="120" rx="9" ry="14" fill="rgba(255,255,255,0.45)" />
        <ellipse cx="73" cy="116" rx="4" ry="6" fill="rgba(255,255,255,0.6)" />
      </svg>
    </div>
  );
}

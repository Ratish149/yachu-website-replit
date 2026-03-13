import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import {
  BOTTLE_FILL_START,
  BOTTLE_FILL_END,
  CAP_LIFT_START,
  CAP_LIFT_END,
  CAP_RETURN_START,
  CAP_RETURN_END,
} from "@/lib/ingredients";

interface BottleProps {
  progress: MotionValue<number>;
}

// ── SVG coordinate plan ────────────────────────────────────────────────────
// ViewBox: 0 0 200 260
//
// Body ellipse: cx=100 cy=186 rx=86 ry=70
//   BODY_TOP = 116   (= cy - ry)
//   BODY_BOT = 256   (= cy + ry)
//
// Cap at y=0 (locked / seated position):
//   Flange  : x=77  y=103  w=46  h=13  → bottom = 116 = BODY_TOP  ✓
//   Cap body: x=81  y=54   w=38  h=52  → y 54–106
//   Neck pin: x=91  y=42   w=18  h=15  → y 42–57
//   Ring    : cx=100 cy=34  r=10  stroke=5.5
//
// Neck (always visible, bottle side):
//   Trapezoid from y=116 (body top) tapering up to y=105 (open mouth)
//   Covered by flange when cap is seated.
// ──────────────────────────────────────────────────────────────────────────

const BODY_CX  = 100;
const BODY_CY  = 186;
const BODY_RX  = 86;
const BODY_RY  = 70;
const BODY_TOP = BODY_CY - BODY_RY;   // 116
const BODY_BOT = BODY_CY + BODY_RY;   // 256

export function Bottle({ progress }: BottleProps) {

  // ── Oil fill ─────────────────────────────────────────────────────────────
  const clipY      = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_END], [BODY_BOT, BODY_TOP]);
  const oilOpacity = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_START + 0.04], [0, 1]);

  // ── Cap vertical position ─────────────────────────────────────────────────
  // Progress map:
  //   0 → CAP_LIFT_END          : cap lifts from 0 → -145  (leaves bottle)
  //   CAP_LIFT_END → CAP_RETURN_START : stays at -145 (floating above)
  //   CAP_RETURN_START → CAP_RETURN_END : drops from -145 → 0  (locks back on)
  const rawCapY = useTransform(
    progress,
    [CAP_LIFT_START, CAP_LIFT_END, CAP_RETURN_START, CAP_RETURN_END],
    [0, -145, -145, 0],
  );
  // Spring gives the cap a satisfying physical settle when it locks back on
  const capY = useSpring(rawCapY, { stiffness: 200, damping: 22, restDelta: 0.3 });

  return (
    <div className="relative" style={{ width: 220 }}>
      <svg
        viewBox="0 0 200 260"
        width={220}
        height={286}
        style={{ overflow: "visible", filter: "drop-shadow(0px 20px 44px rgba(0,0,0,0.12))" }}
      >
        <defs>
          {/* Oil gradient */}
          <linearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f2e07a" stopOpacity="0.80" />
            <stop offset="50%"  stopColor="#c9a84c" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#9a7020" stopOpacity="0.96" />
          </linearGradient>

          {/* Bottle body white gloss */}
          <linearGradient id="bodyGrad" x1="0.12" y1="0" x2="0.88" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="50%"  stopColor="#f5f5f5" />
            <stop offset="100%" stopColor="#e8e8e8" />
          </linearGradient>

          {/* Gold cap */}
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f2dc72" />
            <stop offset="35%"  stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#8a6410" />
          </linearGradient>

          {/* Gold ring */}
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#fae890" />
            <stop offset="100%" stopColor="#9a7830" />
          </linearGradient>

          {/* Body specular sheen */}
          <radialGradient id="bodySheen" cx="30%" cy="28%" r="50%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.94)" />
            <stop offset="55%"  stopColor="rgba(255,255,255,0.18)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
          </radialGradient>

          {/* Clip oil to body shape */}
          <clipPath id="bodyClip">
            <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY} />
          </clipPath>
        </defs>

        {/* ── Bottle body ────────────────────────────────────────────────── */}
        <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY}
          fill="url(#bodyGrad)" stroke="#e0e0e0" strokeWidth="1" />

        {/* ── Rising oil fill ─────────────────────────────────────────────── */}
        <motion.g style={{ opacity: oilOpacity }} clipPath="url(#bodyClip)">
          <motion.rect x="0" y={clipY} width="200" height="260" fill="url(#oilFill)" />
        </motion.g>

        {/* ── Sheen over body (always on top of oil) ──────────────────────── */}
        <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY} fill="url(#bodySheen)" />

        {/* ── Body outline ─────────────────────────────────────────────────── */}
        <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY}
          fill="none" stroke="#d0d0d0" strokeWidth="1.5" />

        {/* ── Neck (bottle side, always visible) ───────────────────────────── */}
        {/* Trapezoid: wide at body-top (y=116), narrows to mouth (y=104) */}
        <path d="M 87,116 L 87,108 C 87,105 90,103 93,103 L 107,103 C 110,103 113,105 113,108 L 113,116 Z"
          fill="#f2f2f2" stroke="#d5d5d5" strokeWidth="0.8" />
        {/* Mouth rim ring */}
        <rect x="89" y="100" width="22" height="6" rx="3"
          fill="#e6e6e6" stroke="#c8c8c8" strokeWidth="0.8" />

        {/* ── Brand text ────────────────────────────────────────────────────── */}
        <text x="100" y="178" textAnchor="middle"
          fontSize="23" fontWeight="700" letterSpacing="3"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#c9a84c">
          YACHU
        </text>
        <path d="M 65,191 Q 100,200 135,191"
          fill="none" stroke="#c9a84c" strokeWidth="0.9" strokeOpacity="0.48" />
        <text x="100" y="206" textAnchor="middle"
          fontSize="10" fontStyle="italic" letterSpacing="1"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#aaaaaa">
          Hair Oil
        </text>

        {/* ── Specular highlight dots ─────────────────────────────────────── */}
        <ellipse cx="62" cy="150" rx="8" ry="13" fill="rgba(255,255,255,0.36)" />
        <ellipse cx="67" cy="146" rx="3.5" ry="5.5" fill="rgba(255,255,255,0.50)" />

        {/* ════════════════════════════════════════════════════════════════════
            CAP GROUP
            At y=0  → cap is fully seated: flange bottom (y=116) = BODY_TOP ✓
            At y=-145 → cap is lifted clear of the bottle
        ════════════════════════════════════════════════════════════════════ */}
        <motion.g style={{ y: capY }}>

          {/* Ring */}
          <circle cx="100" cy="34" r="10"
            fill="none" stroke="url(#ringGrad)" strokeWidth="5.5" />

          {/* Neck pin (ring → cap body) */}
          <rect x="91" y="42" width="18" height="15" rx="3"
            fill="url(#capGrad)" />

          {/* Cap body — ribbed cylinder */}
          <rect x="81" y="54" width="38" height="52" rx="5"
            fill="url(#capGrad)" />

          {/* Horizontal ribs */}
          {[58, 64, 70, 76, 82, 88, 94, 100].map((ribY) => (
            <rect key={ribY} x="81" y={ribY} width="38" height="2.5" rx="1"
              fill="rgba(0,0,0,0.09)" />
          ))}

          {/* Left-edge highlight */}
          <rect x="81" y="54" width="7" height="52" rx="3"
            fill="rgba(255,255,255,0.20)" />

          {/* Flange — sits over the bottle neck rim
              bottom of flange = y 103+13 = 116 = BODY_TOP → perfect flush fit */}
          <rect x="77" y="103" width="46" height="13" rx="4"
            fill="url(#capGrad)" stroke="rgba(0,0,0,0.07)" strokeWidth="0.5" />

          {/* Flange inner rim line (gives depth / 3-D locked feel) */}
          <rect x="77" y="113" width="46" height="3" rx="1.5"
            fill="rgba(0,0,0,0.10)" />
        </motion.g>
      </svg>
    </div>
  );
}

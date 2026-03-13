import { motion, MotionValue, useTransform, useSpring } from "framer-motion";
import { BOTTLE_FILL_START, BOTTLE_FILL_END } from "@/lib/ingredients";

interface BottleProps {
  progress: MotionValue<number>;
}

// ViewBox: 200 × 310
// Body: wide oblate ellipse  cx=100 cy=208  rx=90 ry=72
//   top-of-body  y = 208-72 = 136
//   bottom       y = 208+72 = 280
// Neck (body side): y 128-140, x 86-114
// Cap final resting position: bottom at y=140, top ~y=70
// Ring at ~y=62, r=11

const BODY_CX  = 100;
const BODY_CY  = 208;
const BODY_RX  = 90;
const BODY_RY  = 72;
const BODY_TOP = BODY_CY - BODY_RY;   // 136
const BODY_BOT = BODY_CY + BODY_RY;   // 280

// fill: clip rect rises from BODY_BOT → BODY_TOP
const FILL_EMPTY = BODY_BOT;
const FILL_FULL  = BODY_TOP;

export function Bottle({ progress }: BottleProps) {
  // ── Oil fill level ─────────────────────────────────────────────────────
  const clipY      = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_END], [FILL_EMPTY, FILL_FULL]);
  const oilOpacity = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_START + 0.04], [0, 1]);

  // ── Cap drop-in animation ───────────────────────────────────────────────
  // Cap stays hidden above viewport until bottle is nearly full,
  // then drops down with a spring bounce to lock in place.
  const CAP_DROP_START = BOTTLE_FILL_END - 0.02;
  const CAP_DROP_END   = BOTTLE_FILL_END + 0.06;

  const rawCapY = useTransform(
    progress,
    [0,    CAP_DROP_START, CAP_DROP_END],
    [-300, -300,            0],
  );
  const capY = useSpring(rawCapY, { stiffness: 90, damping: 13, restDelta: 0.5 });
  const capOpacity = useTransform(progress, [CAP_DROP_START - 0.01, CAP_DROP_START + 0.01], [0, 1]);

  return (
    <div className="relative" style={{ width: 220 }}>
      <svg
        viewBox="0 0 200 310"
        width={220}
        height={341}
        style={{ overflow: "visible", filter: "drop-shadow(0px 18px 40px rgba(0,0,0,0.13))" }}
      >
        <defs>
          {/* Oil golden gradient */}
          <linearGradient id="oilFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0dc78" stopOpacity="0.82" />
            <stop offset="45%"  stopColor="#c9a84c" stopOpacity="0.90" />
            <stop offset="100%" stopColor="#9a7020" stopOpacity="0.96" />
          </linearGradient>

          {/* Bottle body: white with slight grey gradient */}
          <linearGradient id="bodyGrad" x1="0.15" y1="0" x2="0.85" y2="1">
            <stop offset="0%"   stopColor="#ffffff" />
            <stop offset="55%"  stopColor="#f4f4f4" />
            <stop offset="100%" stopColor="#e6e6e6" />
          </linearGradient>

          {/* Gold cap gradient */}
          <linearGradient id="capGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor="#f0d870" />
            <stop offset="38%"  stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#8a6410" />
          </linearGradient>

          {/* Lighter gold for highlights */}
          <linearGradient id="capHighlight" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%"   stopColor="#f5e080" />
            <stop offset="40%"  stopColor="#c9a84c" />
            <stop offset="100%" stopColor="#9a7820" />
          </linearGradient>

          {/* Ring gold */}
          <linearGradient id="ringGrad" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%"   stopColor="#f8e888" />
            <stop offset="100%" stopColor="#9a7830" />
          </linearGradient>

          {/* Sheen / specular highlight on body */}
          <radialGradient id="bodySheen" cx="32%" cy="30%" r="52%">
            <stop offset="0%"   stopColor="rgba(255,255,255,0.92)" />
            <stop offset="55%"  stopColor="rgba(255,255,255,0.20)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0)"    />
          </radialGradient>

          {/* Clip: the body outline shape */}
          <clipPath id="bodyClip">
            <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY} />
          </clipPath>

          {/* Clip: rising fill rect */}
          <clipPath id="fillClip">
            <motion.rect x="0" y={clipY} width="200" height="280" />
          </clipPath>
        </defs>

        {/* ── Bottle body ─────────────────────────────────────────────── */}
        <ellipse
          cx={BODY_CX} cy={BODY_CY}
          rx={BODY_RX}  ry={BODY_RY}
          fill="url(#bodyGrad)"
          stroke="#e0e0e0" strokeWidth="1"
        />

        {/* ── Oil fill (clipped to body shape AND rising fill level) ─── */}
        <motion.g style={{ opacity: oilOpacity }} clipPath="url(#bodyClip)">
          <motion.rect
            x="0"
            y={clipY}
            width="200"
            height="280"
            fill="url(#oilFill)"
          />
        </motion.g>

        {/* ── Body sheen on top (always) ──────────────────────────────── */}
        <ellipse cx={BODY_CX} cy={BODY_CY} rx={BODY_RX} ry={BODY_RY} fill="url(#bodySheen)" />

        {/* ── Body outline ─────────────────────────────────────────────── */}
        <ellipse
          cx={BODY_CX} cy={BODY_CY}
          rx={BODY_RX}  ry={BODY_RY}
          fill="none" stroke="#d4d4d4" strokeWidth="1.5"
        />

        {/* ── Neck (always visible — part of bottle body) ───────────────── */}
        {/* Smooth tapered neck — fills the gap between body top and cap base */}
        <path
          d="M 86,136 C 86,128 88,124 92,122 L 108,122 C 112,124 114,128 114,136 Z"
          fill="#efefef" stroke="#d8d8d8" strokeWidth="1"
        />
        {/* Neck top rim ring */}
        <rect x="87" y="119" width="26" height="7" rx="3.5"
          fill="#e4e4e4" stroke="#ccc" strokeWidth="1" />

        {/* ── Brand text ───────────────────────────────────────────────── */}
        <text x="100" y="200" textAnchor="middle"
          fontSize="24" fontWeight="700" letterSpacing="3"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#c9a84c">
          YACHU
        </text>
        <path d="M 65,213 Q 100,222 135,213"
          fill="none" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.50" />
        <text x="100" y="228" textAnchor="middle"
          fontSize="10" fontStyle="italic" letterSpacing="1"
          fontFamily="'Playfair Display', Georgia, serif"
          fill="#aaa">
          Hair Oil
        </text>

        {/* ── Specular dots ─────────────────────────────────────────────── */}
        <ellipse cx="62" cy="162" rx="8"  ry="13" fill="rgba(255,255,255,0.38)" />
        <ellipse cx="67" cy="158" rx="3.5" ry="5.5" fill="rgba(255,255,255,0.52)" />

        {/* ════════════════════════════════════════════════════════════════
            CAP GROUP — drops down from above when bottle is full
        ════════════════════════════════════════════════════════════════ */}
        <motion.g style={{ y: capY, opacity: capOpacity }}>
          {/* Ring at the very top */}
          <circle cx="100" cy="52" r="11"
            fill="none"
            stroke="url(#ringGrad)"
            strokeWidth="6"
          />

          {/* Cap neck connector (narrow cylinder between ring and cap body) */}
          <rect x="91" y="60" width="18" height="14" rx="3"
            fill="url(#capGrad)" />

          {/* Cap body (ribbed cylinder) */}
          <rect x="80" y="72" width="40" height="52" rx="5"
            fill="url(#capGrad)" />

          {/* Ribs on cap */}
          {[78, 84, 90, 96, 102, 108, 114].map((ry) => (
            <rect key={ry} x="80" y={ry} width="40" height="2.5" rx="1"
              fill="rgba(0,0,0,0.09)" />
          ))}

          {/* Cap left-edge highlight */}
          <rect x="80" y="72" width="7" height="52" rx="3"
            fill="rgba(255,255,255,0.18)" />

          {/* Cap bottom flange (fits over neck rim) */}
          <rect x="77" y="120" width="46" height="10" rx="4"
            fill="url(#capGrad)" stroke="rgba(0,0,0,0.08)" strokeWidth="0.5" />
        </motion.g>
      </svg>
    </div>
  );
}

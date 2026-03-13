import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Droplet, Leaf, Sparkles } from "lucide-react";
import {
  INGREDIENTS,
  HERO_POSITIONS,
  BATCH_TIMING,
  BOTTLE_FILL_START,
  BOTTLE_FILL_END,
} from "@/lib/ingredients";
import { Bottle }             from "@/components/Bottle";
import { IngredientParticle } from "@/components/IngredientParticle";
import { BatchDot }           from "@/components/BatchDot";

// Bottle pinned to viewport center
const BOTTLE_X = 0.50;
const BOTTLE_Y = 0.50;

// ─── Per-ingredient timing ────────────────────────────────────────────────
// Items inside a batch get a slight stagger so they don't all pop/fly at once.
function getTimings(batch: 1 | 2 | 3, localIdx: number) {
  const { appearBase, flyBase, batchSize } = BATCH_TIMING[batch];
  const t = localIdx / batchSize; // 0 → 1 within the batch

  const appearStart = appearBase + t * 0.09;
  const appearEnd   = appearStart + 0.065;
  const flyStart    = flyBase    + t * 0.11;
  const flyEnd      = flyStart   + 0.115;

  return { appearStart, appearEnd, flyStart, flyEnd };
}

// ─── Phase label ──────────────────────────────────────────────────────────
function StatusLabel({ progress }: { progress: MotionValue<number> }) {
  const [label, setLabel] = useState("Scroll to reveal the ingredients");
  useEffect(() => {
    return progress.on("change", (p) => {
      if      (p < 0.04)  setLabel("Scroll to begin the ritual…");
      else if (p < 0.08)  setLabel("Opening the bottle…");
      else if (p < 0.36)  setLabel("Wave 1 · 10 botanicals awakening…");
      else if (p < 0.42)  setLabel("Wave 1 blending · Wave 2 appearing…");
      else if (p < 0.58)  setLabel("Wave 2 · 10 more botanicals revealed…");
      else if (p < 0.64)  setLabel("Wave 2 blending · Wave 3 appearing…");
      else if (p < 0.86)  setLabel("Wave 3 · 13 final botanicals revealed…");
      else if (p < 0.96)  setLabel("Sealing the ancient formula…");
      else                setLabel("All 33 botanicals blended ✨");
    });
  }, [progress]);

  return (
    <p className="text-[10px] tracking-widest uppercase text-gray-400 font-medium">
      {label}
    </p>
  );
}

// ─── Blended count ────────────────────────────────────────────────────────
function BlendedCount({ progress }: { progress: MotionValue<number> }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    return progress.on("change", (p) => {
      const b1Fly = BATCH_TIMING[1].flyBase;
      const b2Fly = BATCH_TIMING[2].flyBase;
      const b3Fly = BATCH_TIMING[3].flyBase;
      if      (p < b1Fly) setCount(0);
      else if (p < b2Fly) setCount(Math.round(((p - b1Fly) / (b2Fly - b1Fly)) * 10));
      else if (p < b3Fly) setCount(10 + Math.round(((p - b2Fly) / (b3Fly - b2Fly)) * 10));
      else if (p < 0.87)  setCount(20 + Math.round(((p - b3Fly) / (0.87  - b3Fly)) * 13));
      else                setCount(33);
    });
  }, [progress]);

  return (
    <div className="flex items-center gap-1.5">
      <span className="tabular-nums font-serif text-primary text-xl font-semibold leading-none">
        {count}
      </span>
      <span className="text-gray-400 text-xs">/ 33 blended</span>
    </div>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────
export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vpW, setVpW] = useState(typeof window !== "undefined" ? window.innerWidth  : 1200);
  const [vpH, setVpH] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    const onResize = () => { setVpW(window.innerWidth); setVpH(window.innerHeight); };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  // Smooth spring — gentle on mobile (lower stiffness avoids jank)
  const progress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping:   22,
    restDelta: 0.0005,
  });

  // Gold glow behind bottle (grows as bottle fills)
  const glowOpacity = useTransform(progress, [BOTTLE_FILL_START, 0.70, BOTTLE_FILL_END], [0, 0.20, 0.32]);
  const glowScale   = useTransform(progress, [BOTTLE_FILL_START, BOTTLE_FILL_END], [0.5, 1.9]);

  // Hero title fades out as cap lifts (first 8% of scroll)
  const titleOpacity = useTransform(progress, [0, 0.08], [1, 0]);
  const titleY       = useTransform(progress, [0, 0.08], [0, -20]);

  // Per-ingredient render data
  const particles = INGREDIENTS.map((ingredient, i) => {
    const localIdx = ingredient.batch === 1 ? i
                   : ingredient.batch === 2 ? i - 10
                   :                          i - 20;
    const timings  = getTimings(ingredient.batch, localIdx);
    const pos      = HERO_POSITIONS[i];
    const targetDx = (BOTTLE_X - pos.xFrac) * vpW;
    const targetDy = (BOTTLE_Y - pos.yFrac) * vpH;

    return { ingredient, pos, timings, targetDx, targetDy };
  });

  return (
    <div className="bg-white text-foreground">

      {/* ══════════════════════════════════════════════════════════════════
          STICKY SCROLL SECTION  (8 000 px — extra dwell for sealed bottle)
      ══════════════════════════════════════════════════════════════════ */}
      <section ref={containerRef} className="relative" style={{ height: "8000px" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-white via-amber-50/10 to-white">

          {/* Ambient gold glow (appears during fly phase) */}
          <motion.div
            className="absolute rounded-full pointer-events-none"
            style={{
              left: "50%", top: "50%",
              translateX: "-50%", translateY: "-50%",
              width: "480px", height: "480px",
              background: "radial-gradient(circle, rgba(201,168,76,0.85) 0%, transparent 68%)",
              filter:  "blur(52px)",
              opacity: glowOpacity,
              scale:   glowScale,
            }}
          />

          {/* ── Hero title ── */}
          <motion.div
            className="absolute inset-x-0 top-0 z-30 flex flex-col items-center pt-9 pointer-events-none"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-medium mb-3">
              Botanical Alchemy
            </p>
            <h1 className="text-4xl md:text-6xl font-serif text-gray-900 text-center leading-none mb-3">
              Essence of{" "}
              <em className="text-primary not-italic italic">Nature</em>
            </h1>
            <p className="text-sm text-gray-400 font-light tracking-wide">
              33 hand-picked botanicals · one perfect blend
            </p>
            <motion.div
              className="mt-6 flex flex-col items-center gap-1 text-gray-300"
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[8px] tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-px h-6 bg-gradient-to-b from-gray-300 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ── Bottle (center of viewport) ── */}
          <div
            className="absolute z-10"
            style={{
              left: `${BOTTLE_X * 100}%`,
              top:  `${BOTTLE_Y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Bottle progress={progress} />
          </div>

          {/* ── 33 ingredient particles ── */}
          {particles.map(({ ingredient, pos, timings, targetDx, targetDy }) => (
            <IngredientParticle
              key={ingredient.id}
              ingredient={ingredient}
              index={ingredient.id - 1}
              progress={progress}
              xFrac={pos.xFrac}
              yFrac={pos.yFrac}
              targetDx={targetDx}
              targetDy={targetDy}
              floatDelay={pos.delay}
              appearStart={timings.appearStart}
              appearEnd={timings.appearEnd}
              flyStart={timings.flyStart}
              flyEnd={timings.flyEnd}
            />
          ))}

          {/* ── Bottom status bar ── */}
          <div className="absolute bottom-0 inset-x-0 z-30 flex items-center justify-between px-6 md:px-10 py-4 border-t border-gray-100/90 bg-white/88 backdrop-blur-sm">
            <BlendedCount progress={progress} />

            <div className="absolute left-1/2 -translate-x-1/2 hidden sm:block">
              <StatusLabel progress={progress} />
            </div>

            <div className="flex items-center gap-3">
              <BatchDot batchStart={BATCH_TIMING[1].appearBase} label="10"  progress={progress} />
              <BatchDot batchStart={BATCH_TIMING[2].appearBase} label="+10" progress={progress} />
              <BatchDot batchStart={BATCH_TIMING[3].appearBase} label="+13" progress={progress} />
            </div>
          </div>
        </div>
      </section>

      {/* ══════════════════════════════════════════════════════════════════
          BELOW-FOLD CONTENT
      ══════════════════════════════════════════════════════════════════ */}

      {/* Stats */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "33",   label: "Potent Actives" },
            { value: "100%", label: "Pure Botanical" },
            { value: "0",    label: "Synthetics" },
            { value: "Cold", label: "Pressed" },
          ].map((s) => (
            <div key={s.label} className="space-y-2">
              <p className="text-4xl md:text-5xl font-serif text-primary">{s.value}</p>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">{s.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 bg-gray-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-serif text-gray-900 mb-4">The Art of Extraction</h2>
            <p className="text-gray-400 max-w-lg mx-auto text-sm leading-relaxed">
              Ancient apothecary wisdom combined with modern clinical precision.
            </p>
          </div>
          <div className="grid md:grid-cols-3 gap-5">
            {[
              { icon: Leaf,     title: "Uncompromising Purity",  desc: "No fillers, no water, no artificial fragrances. Pure botanical earth magic." },
              { icon: Sparkles, title: "Ancient Wisdom",          desc: "Formulated using techniques passed down through generations of apothecaries." },
              { icon: Droplet,  title: "Micro-Batch Crafting",   desc: "Blended by hand in small batches for absolute freshness and integrity." },
            ].map((f) => (
              <div
                key={f.title}
                className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group"
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/20 transition-colors">
                  <f.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <footer className="py-24 px-6 text-center border-t border-gray-100 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-primary tracking-[0.35em] uppercase text-[10px] mb-5 font-medium">Limited Batches</p>
          <h2 className="text-3xl md:text-5xl font-serif text-gray-900 mb-4">Experience the Blend</h2>
          <p className="text-gray-400 text-sm mb-10 font-light">The world's most potent multi-botanical hair oil.</p>
          <button
            data-testid="button-acquire"
            className="px-10 py-4 rounded-full font-medium tracking-[0.2em] uppercase text-sm bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
          >
            Acquire Now
          </button>
        </div>
        <div className="mt-16 pt-6 border-t border-gray-100 text-xs text-gray-300 flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-3">
          <p>© 2025 YACHU. All rights reserved.</p>
          <div className="flex gap-8">
            {["Ingredients", "Process", "Sustainability"].map((link) => (
              <a key={link} href="#" className="hover:text-primary transition-colors tracking-widest uppercase">{link}</a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

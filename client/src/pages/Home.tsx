import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Droplet, Leaf, Sparkles } from "lucide-react";
import { INGREDIENTS, HERO_POSITIONS, BATCH_TIMING } from "@/lib/ingredients";
import { Bottle } from "@/components/Bottle";
import { IngredientParticle } from "@/components/IngredientParticle";
import { BatchDot } from "@/components/BatchDot";

// Bottle center as fraction of the sticky viewport
const BOTTLE_X = 0.50;
const BOTTLE_Y = 0.50;

// Per-ingredient timing
// Each item in a batch gets a small stagger within the batch's window
function getTimings(batch: 1 | 2 | 3, localIdx: number) {
  const { appearBase, flyBase, batchSize } = BATCH_TIMING[batch];
  const APPEAR_SPAN = 0.13;
  const FLY_SPAN    = 0.08;

  const appearStagger = (localIdx / batchSize) * APPEAR_SPAN * 0.65;
  const flyStagger    = (localIdx / batchSize) * FLY_SPAN   * 0.60;

  const appearStart = appearBase + appearStagger;
  const appearEnd   = appearStart + 0.07;
  const flyStart    = flyBase + flyStagger;
  const flyEnd      = Math.min(flyStart + FLY_SPAN, flyBase + FLY_SPAN + 0.06);

  return { appearStart, appearEnd, flyStart, flyEnd };
}

// ─── Status label driven by scroll progress ───
function StatusLabel({ progress }: { progress: MotionValue<number> }) {
  const [label, setLabel] = useState("Scroll to reveal the ingredients");
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if      (p < 0.02) setLabel("Scroll to reveal the ingredients");
      else if (p < 0.20) setLabel("Wave 1 · 10 ingredients revealing…");
      else if (p < 0.42) setLabel("Wave 2 · 10 more ingredients…");
      else if (p < 0.62) setLabel("Wave 3 · 13 final ingredients…");
      else if (p < 0.64) setLabel("All 33 visible · Beginning the blend…");
      else if (p < 0.76) setLabel("Wave 1 blending into the bottle…");
      else if (p < 0.88) setLabel("Wave 2 blending…");
      else if (p < 0.99) setLabel("Wave 3 blending…");
      else               setLabel("All 33 ingredients blended ✨");
    });
    return () => unsub();
  }, [progress]);

  return (
    <p className="text-[10px] tracking-widest uppercase text-gray-400 font-medium transition-all">
      {label}
    </p>
  );
}

// ─── Animated visible-ingredient counter ───
function VisibleCount({ progress }: { progress: MotionValue<number> }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      // Count appears in steps matching appear phases, then resets as they fly
      if      (p < BATCH_TIMING[1].appearBase + 0.03) setCount(0);
      else if (p < BATCH_TIMING[2].appearBase)         setCount(10);
      else if (p < BATCH_TIMING[3].appearBase)         setCount(20);
      else if (p < BATCH_TIMING[1].flyBase)            setCount(33);
      else if (p < BATCH_TIMING[2].flyBase)            setCount(23);
      else if (p < BATCH_TIMING[3].flyBase)            setCount(13);
      else if (p < 0.99)                               setCount(Math.max(0, 33 - Math.round((p - 0.88) / 0.12 * 13)));
      else                                             setCount(0);
    });
    return () => unsub();
  }, [progress]);

  return (
    <span className="tabular-nums font-serif text-primary text-2xl font-semibold">
      {count}
    </span>
  );
}

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
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  // Ambient gold glow grows during fly phase
  const glowOpacity = useTransform(smoothProgress, [0.60, 0.80, 1.0], [0, 0.18, 0.28]);
  const glowScale   = useTransform(smoothProgress, [0.60, 1.0], [0.6, 1.8]);

  // Title fades out as first wave appears
  const titleOpacity = useTransform(smoothProgress, [0, 0.08], [1, 0]);
  const titleY       = useTransform(smoothProgress, [0, 0.08], [0, -24]);

  // Build per-ingredient data
  const ingredientData = INGREDIENTS.map((ingredient, i) => {
    const localIdx = ingredient.batch === 1 ? i
                   : ingredient.batch === 2 ? i - 10
                   :                          i - 20;
    const timings  = getTimings(ingredient.batch, localIdx);
    const pos      = HERO_POSITIONS[i];

    const targetDx = (BOTTLE_X - pos.xFrac) * vpW;
    const targetDy = (BOTTLE_Y - pos.yFrac) * vpH;

    return { ingredient, pos, ...timings, targetDx, targetDy };
  });

  return (
    <div className="bg-white text-foreground">

      {/* ── STICKY SCROLL SECTION ── */}
      <section ref={containerRef} className="relative" style={{ height: "6200px" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-white via-amber-50/15 to-white">

          {/* Gold ambient glow behind bottle (grows when fly phase starts) */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              left: "50%",
              top: "50%",
              translateX: "-50%",
              translateY: "-50%",
              width: "460px",
              height: "460px",
              background: "radial-gradient(circle, rgba(201,168,76,0.9) 0%, transparent 68%)",
              opacity: glowOpacity,
              scale: glowScale,
              filter: "blur(50px)",
            }}
          />

          {/* ── TITLE (visible at start, fades when scroll begins) ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-10 pointer-events-none"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-medium mb-3">
              Botanical Alchemy
            </p>
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 text-center leading-none mb-3">
              Essence of{" "}
              <em className="text-primary not-italic font-serif italic">Nature</em>
            </h1>
            <p className="text-sm text-gray-400 font-light tracking-wide">
              33 hand-picked botanicals · one perfect blend
            </p>
            <motion.div
              className="mt-7 flex flex-col items-center gap-1 text-gray-300"
              animate={{ y: [0, 9, 0] }}
              transition={{ duration: 1.9, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="text-[8px] tracking-[0.3em] uppercase">Scroll</span>
              <div className="w-px h-7 bg-gradient-to-b from-gray-300 to-transparent" />
            </motion.div>
          </motion.div>

          {/* ── BOTTLE ── pinned to center */}
          <div
            className="absolute z-10"
            style={{
              left: `${BOTTLE_X * 100}%`,
              top:  `${BOTTLE_Y * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Bottle progress={smoothProgress} />
          </div>

          {/* ── 33 INGREDIENT PARTICLES (each starts invisible, appears on scroll) ── */}
          {ingredientData.map(({ ingredient, pos, appearStart, appearEnd, flyStart, flyEnd, targetDx, targetDy }) => (
            <IngredientParticle
              key={ingredient.id}
              ingredient={ingredient}
              index={ingredient.id - 1}
              progress={smoothProgress}
              xFrac={pos.xFrac}
              yFrac={pos.yFrac}
              targetDx={targetDx}
              targetDy={targetDy}
              delay={pos.delay}
              appearStart={appearStart}
              appearEnd={appearEnd}
              flyStart={flyStart}
              flyEnd={flyEnd}
            />
          ))}

          {/* ── BOTTOM STATUS BAR ── */}
          <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-5 border-t border-gray-100/90 bg-white/85 backdrop-blur-sm">
            {/* Left: visible ingredient counter */}
            <div className="flex items-center gap-1.5">
              <VisibleCount progress={smoothProgress} />
              <span className="text-gray-400 text-sm">/ 33 ingredients</span>
            </div>

            {/* Center: phase label */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <StatusLabel progress={smoothProgress} />
            </div>

            {/* Right: batch dots (light up as each batch appears) */}
            <div className="flex items-center gap-3">
              <BatchDot batchStart={BATCH_TIMING[1].appearBase} label="10"  progress={smoothProgress} />
              <BatchDot batchStart={BATCH_TIMING[2].appearBase} label="+10" progress={smoothProgress} />
              <BatchDot batchStart={BATCH_TIMING[3].appearBase} label="+13" progress={smoothProgress} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "33",   label: "Potent Actives" },
            { value: "100%", label: "Pure Botanical" },
            { value: "0",    label: "Synthetics" },
            { value: "Cold", label: "Pressed" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-4xl md:text-5xl font-serif text-primary">{stat.value}</p>
              <p className="text-[10px] tracking-[0.2em] text-gray-400 uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 px-6 bg-gray-50/60">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl font-serif text-gray-900 mb-4">The Art of Extraction</h2>
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
                <div className="w-10 h-10 rounded-full bg-primary/8 flex items-center justify-center mb-4 text-primary group-hover:bg-primary/15 transition-colors">
                  <f.icon className="w-4 h-4" />
                </div>
                <h3 className="text-base font-serif text-gray-900 mb-2">{f.title}</h3>
                <p className="text-gray-400 text-xs leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FOOTER ── */}
      <footer className="py-24 px-6 text-center border-t border-gray-100 bg-white">
        <div className="max-w-xl mx-auto">
          <p className="text-primary tracking-[0.35em] uppercase text-[10px] mb-5 font-medium">Limited Batches</p>
          <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">Experience the Blend</h2>
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

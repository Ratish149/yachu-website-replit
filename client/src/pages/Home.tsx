import { useRef, useState, useEffect } from "react";
import {
  motion,
  useScroll,
  useSpring,
  useTransform,
  MotionValue,
} from "framer-motion";
import { Droplet, Leaf, Sparkles } from "lucide-react";
import { INGREDIENTS, HERO_POSITIONS, BATCH_RANGES } from "@/lib/ingredients";
import { Bottle } from "@/components/Bottle";
import { IngredientParticle } from "@/components/IngredientParticle";
import { BatchDot } from "@/components/BatchDot";

// Bottle center within the sticky viewport (fraction of viewport)
const BOTTLE_X_FRAC = 0.50;
const BOTTLE_Y_FRAC = 0.50;

function BatchLabel({ progress }: { progress: MotionValue<number> }) {
  const [label, setLabel] = useState("Scroll to begin the blend");

  useEffect(() => {
    const unsub = progress.on("change", (p) => {
      if (p <= 0.01)      setLabel("Scroll to begin the blend");
      else if (p < 0.33)  setLabel("Wave 1 of 3 · 10 ingredients blending…");
      else if (p < 0.66)  setLabel("Wave 2 of 3 · 10 more ingredients…");
      else if (p < 0.99)  setLabel("Wave 3 of 3 · 13 final ingredients…");
      else                setLabel("All 33 ingredients blended. ✨");
    });
    return () => unsub();
  }, [progress]);

  return (
    <p className="text-xs tracking-widest uppercase text-gray-400 font-medium">
      {label}
    </p>
  );
}

function IngredientCount({ progress }: { progress: MotionValue<number> }) {
  const count = useTransform(progress, [0, 1], [0, 33]);
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    const unsub = count.on("change", (v) => setDisplay(Math.round(v)));
    return () => unsub();
  }, [count]);
  return (
    <span className="tabular-nums font-serif text-primary text-2xl font-semibold">
      {display}
    </span>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const [vpW, setVpW] = useState(typeof window !== "undefined" ? window.innerWidth  : 1200);
  const [vpH, setVpH] = useState(typeof window !== "undefined" ? window.innerHeight : 800);

  useEffect(() => {
    const onResize = () => {
      setVpW(window.innerWidth);
      setVpH(window.innerHeight);
    };
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, []);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 55,
    damping: 18,
    restDelta: 0.001,
  });

  // Background glow that grows as bottle fills
  const glowOpacity = useTransform(smoothProgress, [0, 0.5, 1], [0, 0.12, 0.22]);
  const glowScale   = useTransform(smoothProgress, [0, 1], [0.5, 1.6]);

  // Title fades gently as scroll starts
  const titleOpacity = useTransform(smoothProgress, [0, 0.12], [1, 0]);
  const titleY       = useTransform(smoothProgress, [0, 0.12], [0, -30]);

  // Compute per-ingredient fly timings & pixel offsets
  const ingredientData = INGREDIENTS.map((ingredient, i) => {
    const batchRange = BATCH_RANGES[ingredient.batch];
    const batchSize  = ingredient.batch === 3 ? 13 : 10;
    const localIdx   = ingredient.batch === 1 ? i
                     : ingredient.batch === 2 ? i - 10
                     :                          i - 20;
    const batchSpan  = batchRange.end - batchRange.start;
    const stagger    = (localIdx / batchSize) * batchSpan * 0.30;
    const flyDuration = batchSpan * 0.52;

    const flyStart = batchRange.start + stagger;
    const flyEnd   = Math.min(flyStart + flyDuration, batchRange.end + 0.04);

    const pos = HERO_POSITIONS[i];
    const targetDx = (BOTTLE_X_FRAC - pos.xFrac) * vpW;
    const targetDy = (BOTTLE_Y_FRAC - pos.yFrac) * vpH;

    return { ingredient, pos, flyStart, flyEnd, targetDx, targetDy };
  });

  return (
    <div className="bg-white text-foreground">

      {/* ── TALL STICKY SCROLL CONTAINER ── */}
      <section ref={containerRef} className="relative" style={{ height: "5500px" }}>
        <div className="sticky top-0 h-screen w-full overflow-hidden bg-gradient-to-b from-white via-amber-50/20 to-white">

          {/* Gold ambient glow behind bottle */}
          <motion.div
            className="absolute pointer-events-none rounded-full"
            style={{
              left: `${BOTTLE_X_FRAC * 100}%`,
              top:  `${BOTTLE_Y_FRAC * 100}%`,
              translateX: "-50%",
              translateY: "-50%",
              width: "420px",
              height: "420px",
              background: "radial-gradient(circle, rgba(201,168,76,1) 0%, transparent 70%)",
              opacity: glowOpacity,
              scale: glowScale,
              filter: "blur(40px)",
            }}
          />

          {/* ── TITLE (fades on scroll) ── */}
          <motion.div
            className="absolute top-0 left-0 right-0 z-30 flex flex-col items-center pt-10 pointer-events-none"
            style={{ opacity: titleOpacity, y: titleY }}
          >
            <p className="text-[10px] tracking-[0.35em] uppercase text-primary font-medium mb-3">
              Botanical Alchemy
            </p>
            <h1 className="text-5xl md:text-7xl font-serif text-gray-900 text-center leading-none mb-3">
              Essence of <span className="text-primary italic">Nature</span>
            </h1>
            <p className="text-sm text-gray-400 font-light tracking-wide">
              33 hand-picked botanicals · one perfect blend
            </p>
            <div className="mt-6 flex items-center gap-2 text-gray-300">
              <motion.div
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
                className="flex flex-col items-center gap-1"
              >
                <span className="text-[9px] tracking-[0.3em] uppercase">Scroll</span>
                <div className="w-px h-8 bg-gradient-to-b from-gray-300 to-transparent" />
              </motion.div>
            </div>
          </motion.div>

          {/* ── BOTTLE ── centered in viewport */}
          <div
            className="absolute z-10"
            style={{
              left: `${BOTTLE_X_FRAC * 100}%`,
              top:  `${BOTTLE_Y_FRAC * 100}%`,
              transform: "translate(-50%, -50%)",
            }}
          >
            <Bottle progress={smoothProgress} />
          </div>

          {/* ── 33 INGREDIENT PARTICLES scattered across full viewport ── */}
          {ingredientData.map(({ ingredient, pos, flyStart, flyEnd, targetDx, targetDy }) => (
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
              flyStart={flyStart}
              flyEnd={flyEnd}
            />
          ))}

          {/* ── BOTTOM STATUS BAR ── */}
          <div className="absolute bottom-0 left-0 right-0 z-30 flex items-center justify-between px-8 py-6 border-t border-gray-100/80 bg-white/80 backdrop-blur-sm">
            {/* Left: counter */}
            <div className="flex items-center gap-2">
              <IngredientCount progress={smoothProgress} />
              <span className="text-gray-400 text-sm">/ 33 blended</span>
            </div>

            {/* Center: batch label */}
            <div className="absolute left-1/2 -translate-x-1/2">
              <BatchLabel progress={smoothProgress} />
            </div>

            {/* Right: progress dots */}
            <div className="flex items-center gap-3">
              <BatchDot batchStart={0}    label="10"  progress={smoothProgress} />
              <BatchDot batchStart={0.33} label="+10" progress={smoothProgress} />
              <BatchDot batchStart={0.66} label="+13" progress={smoothProgress} />
            </div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-10 text-center">
          {[
            { value: "33", label: "Potent Actives" },
            { value: "100%", label: "Pure Botanical" },
            { value: "0", label: "Synthetics" },
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
              { icon: Leaf,     title: "Uncompromising Purity",  desc: "No fillers, no water, no artificial fragrances. Pure, unadulterated earth magic." },
              { icon: Sparkles, title: "Ancient Wisdom",          desc: "Formulated using techniques passed down through generations of apothecaries." },
              { icon: Droplet,  title: "Micro-Batch Crafting",   desc: "Blended by hand in small batches for absolute freshness and molecular integrity." },
            ].map((f) => (
              <div key={f.title} className="bg-white border border-gray-100 rounded-2xl p-7 hover:border-primary/30 hover:shadow-lg transition-all duration-300 group">
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

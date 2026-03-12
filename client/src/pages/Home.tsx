import { useRef } from "react";
import { motion, useScroll, useSpring, MotionValue, useTransform } from "framer-motion";
import { Droplet, Leaf, Sparkles, ArrowDown, Check } from "lucide-react";
import { INGREDIENTS, PARTICLE_POSITIONS } from "@/lib/ingredients";
import { Bottle } from "@/components/Bottle";
import { IngredientParticle } from "@/components/IngredientParticle";
import type { Ingredient } from "@/lib/ingredients";

interface IngredientListItemProps {
  ingredient: Ingredient;
  index: number;
  total: number;
  progress: MotionValue<number>;
}

function IngredientListItem({ ingredient, index, total, progress }: IngredientListItemProps) {
  const endTrigger = (index + 1) / total;
  const startTrigger = index / total;

  const itemOpacity = useTransform(progress, (p) =>
    p > endTrigger ? 1 : p >= startTrigger ? 1 : 0.38
  );
  const textColor = useTransform(progress, (p) =>
    p > endTrigger || (p >= startTrigger && p <= endTrigger)
      ? ingredient.color
      : "#9ca3af"
  );
  const bgOpacity = useTransform(progress, (p) =>
    p >= startTrigger && p <= endTrigger ? 1 : 0
  );
  const checkOpacity = useTransform(progress, (p) => (p > endTrigger ? 1 : 0));
  const checkScale = useTransform(progress, (p) => (p > endTrigger ? 1 : 0.4));

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-xl relative"
      style={{ opacity: itemOpacity }}
    >
      <motion.div
        className="absolute inset-0 rounded-xl"
        style={{ backgroundColor: ingredient.color + "14", opacity: bgOpacity }}
      />
      <span className="text-base w-6 text-center relative z-10 flex-shrink-0">
        {ingredient.icon}
      </span>
      <motion.span
        className="text-sm font-medium relative z-10 flex-1"
        style={{ color: textColor }}
      >
        {ingredient.name}
      </motion.span>
      <motion.div
        className="flex-shrink-0 relative z-10 w-4 h-4 rounded-full flex items-center justify-center"
        style={{
          opacity: checkOpacity,
          scale: checkScale,
          backgroundColor: ingredient.color + "22",
        }}
      >
        <Check className="w-2.5 h-2.5" style={{ color: ingredient.color }} strokeWidth={3} />
      </motion.div>
    </motion.div>
  );
}

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 60,
    damping: 20,
    restDelta: 0.001,
  });

  return (
    <div className="bg-white text-foreground min-h-screen">

      {/* ── HERO ── */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden bg-white">
        {/* Subtle gold radial glow */}
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[70vw] h-[70vw] max-w-[700px] max-h-[700px] bg-primary/8 rounded-full blur-[160px]" />
        </div>

        <div className="z-10 text-center px-6 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, delay: 0.2 }}
            className="mb-5"
          >
            <span className="text-primary font-medium tracking-[0.35em] uppercase text-xs">
              The Botanical Alchemy
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-gray-900 mb-5 leading-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.1, delay: 0.4 }}
          >
            Essence of{" "}
            <span className="text-primary-gold italic">Nature</span>
          </motion.h1>

          <motion.p
            className="text-base md:text-lg text-gray-500 max-w-xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            33 hand-picked, cold-pressed botanicals.
            <br />
            One perfect blend. Scroll to witness the alchemy.
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-2 z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
        >
          <span className="text-[10px] uppercase tracking-[0.3em] text-gray-400">Scroll to extract</span>
          <motion.div
            animate={{ y: [0, 8, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-4 h-4 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── BOTTLE FILL SCROLL SECTION ── */}
      <section ref={containerRef} className="relative" style={{ height: "4500px" }}>
        <div className="sticky top-0 h-screen w-full flex overflow-hidden bg-white">

          {/* LEFT: Ingredient List */}
          <div className="w-[38%] h-full flex flex-col border-r border-gray-100 bg-gray-50/80 z-30 p-6 lg:p-10">
            <div className="mb-4 flex-shrink-0 pb-4 border-b border-gray-100">
              <h2 className="text-2xl lg:text-3xl font-serif text-gray-900 mb-1">The Formula</h2>
              <p className="text-gray-400 text-xs tracking-wide">33 actives, one perfect blend.</p>
            </div>

            <div
              className="flex-1 overflow-y-auto space-y-0.5 pr-1"
              style={{ scrollbarWidth: "thin", scrollbarColor: "#e5e7eb transparent" }}
            >
              {INGREDIENTS.map((ingredient, i) => (
                <IngredientListItem
                  key={ingredient.id}
                  ingredient={ingredient}
                  index={i}
                  total={INGREDIENTS.length}
                  progress={smoothProgress}
                />
              ))}
            </div>
          </div>

          {/* RIGHT: Bottle + Particles */}
          <div className="flex-1 h-full relative flex items-center justify-center overflow-hidden bg-white">
            {/* Very subtle gold background glow that grows with fill */}
            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] rounded-full pointer-events-none"
              style={{
                background: "radial-gradient(circle, rgba(201,168,76,0.10) 0%, transparent 70%)",
                opacity: smoothProgress,
                scale: useTransform(smoothProgress, [0, 1], [0.6, 1.4]),
              }}
            />

            <div className="relative z-10">
              <Bottle progress={smoothProgress} />
            </div>

            {INGREDIENTS.map((ingredient, i) => (
              <IngredientParticle
                key={ingredient.id}
                ingredient={ingredient}
                index={i}
                total={INGREDIENTS.length}
                progress={smoothProgress}
                startPos={PARTICLE_POSITIONS[i]}
              />
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="py-20 px-6 bg-white border-t border-gray-100">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "33", label: "Potent Actives" },
            { value: "100%", label: "Pure Botanical" },
            { value: "0", label: "Synthetics" },
            { value: "Cold", label: "Pressed Extraction" },
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
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-4xl md:text-5xl font-serif text-gray-900 mb-4">The Art of Extraction</h2>
            <p className="text-gray-400 max-w-xl mx-auto text-base leading-relaxed">
              Combining ancient apothecary wisdom with modern clinical precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-5">
            {[
              {
                icon: Leaf,
                title: "Uncompromising Purity",
                desc: "Every drop is rigorously tested. No fillers, no water, no artificial fragrances. Just raw, unadulterated earth magic.",
              },
              {
                icon: Sparkles,
                title: "Ancient Wisdom",
                desc: "Formulated using techniques passed down through generations of apothecaries, respecting the delicate nature of each plant.",
              },
              {
                icon: Droplet,
                title: "Micro-Batch Crafting",
                desc: "Blended by hand in small quantities to ensure absolute freshness and optimal molecular integrity.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-white border border-gray-100 rounded-2xl p-8 hover:border-primary/30 hover:shadow-lg transition-all duration-400 group"
              >
                <div className="w-11 h-11 rounded-full bg-primary/8 flex items-center justify-center mb-5 text-primary group-hover:bg-primary/14 transition-colors duration-300">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-serif text-gray-900 mb-2">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER CTA ── */}
      <footer className="relative py-28 px-6 text-center border-t border-gray-100 bg-white overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[60vw] h-[30vw] bg-primary/6 rounded-full blur-[100px]" />
        </div>

        <div className="relative z-10 max-w-2xl mx-auto">
          <p className="text-primary tracking-[0.35em] uppercase text-[10px] mb-5 font-medium">
            Limited Batches
          </p>
          <h2 className="text-5xl md:text-6xl font-serif text-gray-900 mb-4">
            Experience the Blend
          </h2>
          <p className="text-gray-400 text-base mb-10 font-light">
            Elevate your ritual with the world's most potent multi-botanical hair oil.
          </p>

          <button
            data-testid="button-acquire"
            className="px-12 py-4 rounded-full font-medium tracking-[0.2em] uppercase text-sm bg-primary text-white hover:bg-primary/90 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
          >
            Acquire Now
          </button>
        </div>

        <div className="mt-20 pt-6 border-t border-gray-100 text-xs text-gray-300 flex flex-col md:flex-row justify-between items-center max-w-5xl mx-auto gap-3">
          <p>© 2025 YACHU. All rights reserved.</p>
          <div className="flex gap-8">
            {["Ingredients", "Process", "Sustainability"].map((link) => (
              <a
                key={link}
                href="#"
                className="hover:text-primary transition-colors duration-300 tracking-widest uppercase"
              >
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

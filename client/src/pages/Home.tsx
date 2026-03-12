import { useRef } from "react";
import { motion, useScroll, useSpring, MotionValue, useTransform } from "framer-motion";
import { Droplet, Leaf, Sparkles, ArrowDown } from "lucide-react";
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
  const startTrigger = index / total;
  const endTrigger = (index + 1) / total;

  const isEntered = useTransform(progress, (p) => p > endTrigger);
  const isActive = useTransform(progress, (p) => p >= startTrigger && p <= endTrigger);
  const itemOpacity = useTransform(progress, (p) =>
    p > endTrigger ? 1 : p >= startTrigger ? 1 : 0.35
  );
  const dropletOpacity = useTransform(progress, (p) => (p > endTrigger ? 1 : 0));
  const dropletScale = useTransform(progress, (p) => (p > endTrigger ? 1 : 0));
  const bgOpacity = useTransform(progress, (p) =>
    p >= startTrigger && p <= endTrigger ? 1 : 0
  );

  return (
    <motion.div
      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors duration-300 relative"
      style={{ opacity: itemOpacity }}
    >
      <motion.div
        className="absolute inset-0 rounded-lg"
        style={{
          backgroundColor: ingredient.color + "18",
          opacity: bgOpacity,
        }}
      />
      <span className="text-lg w-6 text-center relative z-10 flex-shrink-0">{ingredient.icon}</span>
      <motion.span
        className="font-medium tracking-wide text-sm relative z-10 flex-1"
        style={{
          color: useTransform(progress, (p) =>
            p > endTrigger || (p >= startTrigger && p <= endTrigger)
              ? ingredient.color
              : "hsl(var(--muted-foreground))"
          ),
        }}
      >
        {ingredient.name}
      </motion.span>

      <motion.div
        className="ml-auto relative z-10 flex-shrink-0"
        style={{ opacity: dropletOpacity, scale: dropletScale }}
      >
        <Droplet className="w-3.5 h-3.5" style={{ color: ingredient.color }} />
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
    <div className="bg-background text-foreground min-h-screen">

      {/* 1. HERO */}
      <section className="relative h-screen flex flex-col items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[80vw] h-[80vw] max-w-[800px] max-h-[800px] bg-primary/10 rounded-full blur-[150px]" />
        </div>

        <div className="z-10 text-center px-4 max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="mb-6"
          >
            <span className="text-primary font-medium tracking-[0.35em] uppercase text-sm">
              The Botanical Alchemy
            </span>
          </motion.div>

          <motion.h1
            className="text-6xl md:text-8xl lg:text-9xl font-serif text-foreground text-glow mb-8 leading-none"
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4 }}
          >
            Essence of
            <br />
            <span className="text-primary italic">Nature</span>
          </motion.h1>

          <motion.p
            className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto font-light leading-relaxed"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.9 }}
          >
            33 hand-picked, cold-pressed botanicals — one perfect blend.
            <br />
            Scroll to witness the alchemy.
          </motion.p>
        </div>

        <motion.div
          className="absolute bottom-10 flex flex-col items-center gap-3 text-muted-foreground z-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.6 }}
        >
          <span className="text-xs uppercase tracking-[0.25em]">Scroll to extract</span>
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown className="w-5 h-5 text-primary" />
          </motion.div>
        </motion.div>
      </section>

      {/* 2. BOTTLE FILL SCROLL SECTION */}
      <section ref={containerRef} className="relative" style={{ height: "4500px" }}>
        <div className="sticky top-0 h-screen w-full flex overflow-hidden">

          {/* LEFT: Ingredient List */}
          <div className="w-[38%] h-full flex flex-col border-r border-border/30 bg-background/95 z-30 p-8 lg:p-12">
            <div className="mb-5 flex-shrink-0">
              <h2 className="text-3xl lg:text-4xl font-serif text-primary mb-1">The Formula</h2>
              <p className="text-muted-foreground text-sm">33 actives, one perfect blend.</p>
            </div>

            <div className="flex-1 overflow-y-auto space-y-0.5 pr-1" style={{ scrollbarWidth: "thin" }}>
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
          <div className="flex-1 h-full relative flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_70%_at_center,rgba(201,168,76,0.07),transparent)]" />

            <motion.div
              className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[280px] h-[380px] bg-primary/15 blur-[80px] rounded-full pointer-events-none"
              style={{ opacity: smoothProgress }}
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

      {/* 3. STATS */}
      <section className="py-24 px-6 md:px-12 bg-card border-t border-border/50 relative z-20">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
          {[
            { value: "33", label: "Potent Actives" },
            { value: "100%", label: "Pure Botanical" },
            { value: "0", label: "Synthetics" },
            { value: "Cold", label: "Pressed Extraction" },
          ].map((stat) => (
            <div key={stat.label} className="space-y-2">
              <p className="text-4xl md:text-5xl font-serif text-primary">{stat.value}</p>
              <p className="text-xs tracking-[0.2em] text-muted-foreground uppercase">{stat.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 4. FEATURES */}
      <section className="py-28 px-6 md:px-12 relative z-20">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-serif text-foreground mb-5">The Art of Extraction</h2>
            <p className="text-muted-foreground max-w-2xl mx-auto text-lg leading-relaxed">
              We travel the globe to source the finest ingredients — combining ancient apothecary wisdom with modern clinical precision.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
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
                desc: "Blended by hand in small quantities to ensure absolute freshness and optimal molecular integrity of every ingredient.",
              },
            ].map((feature) => (
              <div
                key={feature.title}
                className="bg-card/50 border border-border/50 rounded-2xl p-8 hover:bg-card hover:border-primary/25 transition-all duration-500 group relative overflow-hidden"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
                <div className="w-12 h-12 rounded-full bg-background border border-border flex items-center justify-center mb-5 text-primary group-hover:border-primary/40 group-hover:scale-110 transition-all duration-500">
                  <feature.icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-serif text-foreground mb-3">{feature.title}</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. FOOTER CTA */}
      <footer className="relative py-28 px-6 text-center border-t border-border overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_60%_at_50%_100%,rgba(201,168,76,0.08),transparent)] pointer-events-none" />

        <div className="relative z-10 max-w-3xl mx-auto">
          <p className="text-primary tracking-[0.3em] uppercase text-xs mb-6">Limited Batches</p>
          <h2 className="text-5xl md:text-6xl font-serif text-foreground mb-6 text-glow">Experience the Blend</h2>
          <p className="text-xl text-muted-foreground mb-12 font-light">
            Elevate your ritual with the world's most potent multi-botanical face oil.
          </p>

          <button
            data-testid="button-acquire"
            className="px-12 py-4 rounded-full font-medium tracking-[0.2em] uppercase text-sm bg-primary text-primary-foreground hover:shadow-[0_0_40px_rgba(201,168,76,0.35)] hover:-translate-y-1 transition-all duration-300 active:translate-y-0"
          >
            Acquire Now — $185
          </button>
        </div>

        <div className="mt-24 pt-6 border-t border-border/30 text-xs text-muted-foreground flex flex-col md:flex-row justify-between items-center max-w-6xl mx-auto gap-4">
          <p>© 2025 ESSENCE OF NATURE. All rights reserved.</p>
          <div className="flex gap-8">
            {["Ingredients", "Process", "Sustainability"].map((link) => (
              <a key={link} href="#" className="hover:text-primary transition-colors duration-300 tracking-wider uppercase">
                {link}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}

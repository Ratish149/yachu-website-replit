import { motion, MotionValue, useTransform } from "framer-motion";
import { Ingredient } from "@/lib/ingredients";

interface Props {
  ingredient: Ingredient;
  index: number;
  progress: MotionValue<number>;
  xFrac: number;
  yFrac: number;
  targetDx: number;
  targetDy: number;
  floatDelay: number;   // CSS animation-delay (s)
  appearStart: number;
  appearEnd: number;
  flyStart: number;
  flyEnd: number;
}

export function IngredientParticle({
  ingredient,
  progress,
  xFrac,
  yFrac,
  targetDx,
  targetDy,
  floatDelay,
  appearStart,
  appearEnd,
  flyStart,
  flyEnd,
}: Props) {

  // ── Opacity: invisible → fade in → stay → fade out into bottle ──
  const opacity = useTransform(
    progress,
    [appearStart, appearEnd, flyStart, flyEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // ── Position: starts at (0,0) relative to scatter pos, moves to bottle ──
  const flyT  = useTransform(progress, [flyStart, flyEnd], [0, 1], { clamp: true });
  const x     = useTransform(flyT, [0, 1], [0, targetDx]);
  const y     = useTransform(flyT, [0, 1], [0, targetDy]);
  const scale = useTransform(flyT, [0, 0.55, 1], [1, 0.85, 0.05]);

  return (
    /*
     * Layer 1 – static anchor (CSS left/top = scatter position).
     *   Nothing animates here; no reflows from JS.
     */
    <div
      className="absolute pointer-events-none"
      style={{
        left:      `${xFrac * 100}%`,
        top:       `${yFrac * 100}%`,
        transform: "translate(-50%, -50%)",
        zIndex:    20,
      }}
    >
      {/*
       * Layer 2 – scroll-driven motion (GPU: x, y, scale, opacity).
       *   framer-motion composes these into a single CSS transform,
       *   which runs entirely on the compositor thread.
       */}
      <motion.div style={{ x, y, scale, opacity }}>
        {/*
         * Layer 3 – idle float (pure CSS keyframe).
         *   Runs on compositor thread independently; no JS per frame.
         *   Uses a separate element so it doesn't fight with Layer 2's transform.
         */}
        <div
          className="particle-float flex flex-col items-center gap-1"
          style={{ animationDelay: `${floatDelay}s` }}
        >
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl border shadow-sm"
            style={{
              backgroundColor: ingredient.color + "15",
              borderColor:     ingredient.color + "38",
            }}
          >
            {ingredient.icon}
          </div>
          <span
            className="px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-semibold tracking-wide border whitespace-nowrap"
            style={{
              background:  "white",
              borderColor: ingredient.color + "30",
              color:       ingredient.color,
            }}
          >
            {ingredient.name}
          </span>
        </div>
      </motion.div>
    </div>
  );
}

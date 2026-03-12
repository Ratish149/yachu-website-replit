import { motion, MotionValue, useTransform } from "framer-motion";
import { Ingredient } from "@/lib/ingredients";

interface IngredientParticleProps {
  ingredient: Ingredient;
  index: number;
  progress: MotionValue<number>;
  xFrac: number;
  yFrac: number;
  targetDx: number;
  targetDy: number;
  delay: number;
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
  delay,
  flyStart,
  flyEnd,
}: IngredientParticleProps) {
  const journey = useTransform(progress, [flyStart, flyEnd], [0, 1], { clamp: true });

  const x       = useTransform(journey, [0, 1], [0, targetDx]);
  const y       = useTransform(journey, [0, 1], [0, targetDy]);
  const scale   = useTransform(journey, [0, 0.72, 1], [1, 0.85, 0.1]);
  const opacity = useTransform(journey, [0, 0.80, 1], [1, 1, 0]);

  return (
    /* Outer div: absolute positioned to xFrac/yFrac, centered on that point */
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${xFrac * 100}%`,
        top:  `${yFrac * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Inner motion div: handles all animation transforms */}
      <motion.div style={{ x, y, scale, opacity }}>
        {/* Float animation while waiting to fly */}
        <motion.div
          animate={{ y: [0, -7, 0] }}
          transition={{ duration: 2.6 + delay * 0.4, repeat: Infinity, ease: "easeInOut", delay }}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl border shadow-sm"
            style={{
              backgroundColor: ingredient.color + "14",
              borderColor:     ingredient.color + "40",
              boxShadow:       `0 3px 12px ${ingredient.color}20`,
            }}
          >
            {ingredient.icon}
          </div>
          <div
            className="px-2 py-0.5 rounded-full text-[8px] md:text-[9px] font-semibold tracking-wide border whitespace-nowrap shadow-sm"
            style={{
              backgroundColor: "white",
              borderColor:     ingredient.color + "30",
              color:           ingredient.color,
            }}
          >
            {ingredient.name}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
}

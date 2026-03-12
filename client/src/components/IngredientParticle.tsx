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
  // When this ingredient fades IN at its random position
  appearStart: number;
  appearEnd: number;
  // When this ingredient flies into the bottle
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
  appearStart,
  appearEnd,
  flyStart,
  flyEnd,
}: IngredientParticleProps) {
  // Opacity: invisible → fade in → stay → fade out as it enters bottle
  const opacity = useTransform(
    progress,
    [appearStart, appearEnd, flyStart, flyEnd],
    [0, 1, 1, 0],
    { clamp: true }
  );

  // Only move during fly phase (0 = resting at scatter position, 1 = bottle center)
  const flyJourney = useTransform(progress, [flyStart, flyEnd], [0, 1], { clamp: true });
  const x     = useTransform(flyJourney, [0, 1], [0, targetDx]);
  const y     = useTransform(flyJourney, [0, 1], [0, targetDy]);
  const scale = useTransform(flyJourney, [0, 0.65, 1], [1, 0.82, 0.08]);

  return (
    /* Outer div: pinned to its random scatter position */
    <div
      className="absolute pointer-events-none z-20"
      style={{
        left: `${xFrac * 100}%`,
        top:  `${yFrac * 100}%`,
        transform: "translate(-50%, -50%)",
      }}
    >
      {/* Motion div: handles fly-toward-bottle + fade */}
      <motion.div style={{ x, y, scale, opacity }}>
        {/* Gentle idle float */}
        <motion.div
          animate={{ y: [0, -8, 0] }}
          transition={{
            duration: 2.4 + (delay % 1.2),
            repeat: Infinity,
            ease: "easeInOut",
            delay,
          }}
          className="flex flex-col items-center gap-1.5"
        >
          <div
            className="w-11 h-11 md:w-12 md:h-12 rounded-full flex items-center justify-center text-lg md:text-xl border shadow-sm"
            style={{
              backgroundColor: ingredient.color + "13",
              borderColor:     ingredient.color + "40",
              boxShadow:       `0 3px 14px ${ingredient.color}20`,
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

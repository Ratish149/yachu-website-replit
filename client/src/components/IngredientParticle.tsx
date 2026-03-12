import { motion, MotionValue, useTransform } from "framer-motion";
import { Ingredient } from "@/lib/ingredients";

interface IngredientParticleProps {
  ingredient: Ingredient;
  index: number;
  total: number;
  progress: MotionValue<number>;
  startPos: { x: number; y: number; delay: number };
}

export function IngredientParticle({
  ingredient,
  index,
  total,
  progress,
  startPos,
}: IngredientParticleProps) {
  const startTrigger = index / total;
  const endTrigger = (index + 1) / total;

  const journey = useTransform(progress, [startTrigger, endTrigger], [0, 1]);

  const x = useTransform(journey, [0, 1], [startPos.x, 0]);
  const y = useTransform(journey, [0, 1], [startPos.y, -100]);
  const scale = useTransform(journey, [0, 0.75, 1], [1, 0.9, 0.15]);
  const opacity = useTransform(progress, [0, endTrigger - 0.015, endTrigger], [1, 1, 0]);

  return (
    <motion.div
      style={{ x, y, scale, opacity }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
    >
      <motion.div
        animate={{ y: [0, -6, 0] }}
        transition={{
          duration: 2.8,
          repeat: Infinity,
          ease: "easeInOut",
          delay: startPos.delay,
        }}
        className="flex flex-col items-center gap-1.5"
      >
        <div
          className="w-12 h-12 md:w-14 md:h-14 rounded-full flex items-center justify-center text-xl md:text-2xl border shadow-md"
          style={{
            backgroundColor: `${ingredient.color}16`,
            borderColor: `${ingredient.color}40`,
            boxShadow: `0 4px 16px ${ingredient.color}20`,
          }}
        >
          {ingredient.icon}
        </div>
        <div
          className="px-2.5 py-0.5 rounded-full text-[9px] md:text-[10px] font-semibold tracking-wider border shadow-sm"
          style={{
            backgroundColor: "white",
            borderColor: ingredient.color + "30",
            color: ingredient.color,
          }}
        >
          {ingredient.name}
        </div>
      </motion.div>
    </motion.div>
  );
}

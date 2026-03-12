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
  startPos 
}: IngredientParticleProps) {
  
  // Define the window during which this specific particle flies
  // It starts flying when global progress reaches startTrigger
  // It finishes entering the bottle at endTrigger
  const startTrigger = index / total;
  const endTrigger = (index + 1) / total;
  
  // Transform the global scroll progress into a local 0-1 journey for this particle
  const journey = useTransform(progress, [startTrigger, endTrigger], [0, 1]);

  // Motion transforms
  // X: from random start to center (0)
  const x = useTransform(journey, [0, 1], [startPos.x, 0]);
  // Y: from random start to neck of bottle (-120 relative to absolute center)
  const y = useTransform(journey, [0, 1], [startPos.y, -120]);
  
  // Scale: normal size, shrinks as it enters the bottle
  const scale = useTransform(journey, [0, 0.8, 1], [1, 1, 0.2]);
  
  // Opacity: Visible before journey, fades out at the very end of the journey
  const opacity = useTransform(progress, 
    [0, endTrigger - 0.01, endTrigger], 
    [1, 1, 0]
  );

  return (
    <motion.div
      style={{
        x,
        y,
        scale,
        opacity,
      }}
      className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-20 pointer-events-none"
    >
      <motion.div 
        animate={{ y: [0, -6, 0] }}
        transition={{ 
          duration: 3, 
          repeat: Infinity, 
          ease: "easeInOut",
          delay: startPos.delay 
        }}
        className="flex flex-col items-center gap-2"
      >
        <div 
          className="w-12 h-12 md:w-16 md:h-16 rounded-full flex items-center justify-center text-2xl md:text-3xl shadow-xl backdrop-blur-sm border"
          style={{ 
            backgroundColor: `${ingredient.color}20`, // 20% opacity hex
            borderColor: `${ingredient.color}50`,
            boxShadow: `0 0 20px ${ingredient.color}15, inset 0 0 10px ${ingredient.color}30`
          }}
        >
          {ingredient.icon}
        </div>
        <div 
          className="px-3 py-1 rounded-full text-[10px] md:text-xs font-medium tracking-wider backdrop-blur-md border border-white/10"
          style={{ 
            backgroundColor: 'rgba(10, 18, 8, 0.6)',
            color: ingredient.color 
          }}
        >
          {ingredient.name}
        </div>
      </motion.div>
    </motion.div>
  );
}

import { motion, MotionValue, useTransform } from "framer-motion";

interface BatchDotProps {
  batchStart: number;
  label: string;
  progress: MotionValue<number>;
}

export function BatchDot({ batchStart, label, progress }: BatchDotProps) {
  const opacity = useTransform(progress, [batchStart - 0.01, batchStart + 0.01], [0.2, 1], { clamp: true });

  return (
    <motion.div className="flex items-center gap-1.5" style={{ opacity }}>
      <div className="w-2 h-2 rounded-full bg-primary" />
      <span className="text-[10px] text-gray-500 font-medium tracking-wide">{label}</span>
    </motion.div>
  );
}

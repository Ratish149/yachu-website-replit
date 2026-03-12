import { motion, MotionValue, useTransform } from "framer-motion";

interface BottleProps {
  progress: MotionValue<number>;
}

export function Bottle({ progress }: BottleProps) {
  // Map progress (0 to 1) to clipPath Y coordinate (370 empty down to 110 full)
  // The rect starts at y=370 and moves UP to y=110 to reveal the fill
  const clipY = useTransform(progress, [0, 1], [370, 110]);

  return (
    <div className="relative w-[200px] md:w-[300px] max-w-full drop-shadow-[0_0_40px_rgba(201,168,76,0.15)]">
      <svg 
        viewBox="0 0 200 400" 
        className="w-full h-auto overflow-visible"
        style={{ filter: "drop-shadow(0px 20px 30px rgba(0,0,0,0.5))" }}
      >
        <defs>
          <linearGradient id="oilGradient" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#e8cf66" stopOpacity="0.95" />
            <stop offset="40%" stopColor="#c9a84c" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#7a5c43" stopOpacity="1" />
          </linearGradient>
          
          <linearGradient id="glassShine" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="rgba(255,255,255,0.05)" />
            <stop offset="20%" stopColor="rgba(255,255,255,0.3)" />
            <stop offset="40%" stopColor="rgba(255,255,255,0.0)" />
            <stop offset="100%" stopColor="rgba(255,255,255,0.0)" />
          </linearGradient>

          <clipPath id="fillClip">
            <motion.rect 
              x="0" 
              y={clipY} 
              width="200" 
              height="300" 
            />
          </clipPath>
        </defs>

        {/* Bottle Back Outline (behind oil) */}
        <path 
          d="M90,40 L110,40 L110,80 C110,95 160,110 160,130 L160,360 C160,380 140,390 100,390 C60,390 40,380 40,360 L40,130 C40,110 90,95 90,80 Z" 
          fill="rgba(10, 18, 8, 0.4)" 
          stroke="hsl(var(--primary) / 0.3)" 
          strokeWidth="1" 
        />

        {/* Oil Fill (clipped) */}
        <path 
          d="M90,80 C110,95 160,110 160,130 L160,360 C160,380 140,390 100,390 C60,390 40,380 40,360 L40,130 C40,110 90,95 90,80 Z" 
          fill="url(#oilGradient)" 
          clipPath="url(#fillClip)" 
        />

        {/* Bottle Front Glass (semi-transparent) */}
        <path 
          d="M90,40 L110,40 L110,80 C110,95 160,110 160,130 L160,360 C160,380 140,390 100,390 C60,390 40,380 40,360 L40,130 C40,110 90,95 90,80 Z" 
          fill="url(#glassShine)" 
          stroke="hsl(var(--primary))" 
          strokeWidth="2" 
        />

        {/* Cork */}
        <path 
          d="M85,20 L115,20 C118,20 118,40 115,40 L85,40 C82,40 82,20 85,20 Z" 
          fill="#5e412f" 
        />
        <path 
          d="M85,15 L115,15 L115,20 L85,20 Z" 
          fill="#3a281d" 
        />

        {/* Neck tying / string detail */}
        <path 
          d="M90,60 L110,65" 
          stroke="#c9a84c" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <path 
          d="M90,65 L110,70" 
          stroke="#c9a84c" 
          strokeWidth="2" 
          strokeLinecap="round" 
        />

        {/* Shine Highlights */}
        <path 
          d="M50,150 L50,330" 
          stroke="rgba(255,255,255,0.2)" 
          strokeWidth="3" 
          strokeLinecap="round" 
        />
        <path 
          d="M60,160 L60,320" 
          stroke="rgba(255,255,255,0.1)" 
          strokeWidth="1.5" 
          strokeLinecap="round" 
        />
        
        {/* Label Base */}
        <rect 
          x="75" y="200" width="50" height="70" 
          rx="4" 
          fill="rgba(10, 18, 8, 0.7)" 
          stroke="#c9a84c" 
          strokeWidth="1"
        />
        {/* Label Text/Logo Lines */}
        <circle cx="100" cy="225" r="8" fill="none" stroke="#c9a84c" strokeWidth="1"/>
        <path d="M100,220 L100,230 M95,225 L105,225" stroke="#c9a84c" strokeWidth="0.5"/>
        <line x1="85" y1="245" x2="115" y2="245" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
        <line x1="90" y1="255" x2="110" y2="255" stroke="#c9a84c" strokeWidth="1" strokeOpacity="0.5"/>
      </svg>
    </div>
  );
}

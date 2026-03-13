export interface Ingredient {
  id: number;
  name: string;
  icon: string;
  color: string;
  batch: 1 | 2 | 3;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 1,  name: "Olive",         icon: "🫒", color: "#6b8f3a", batch: 1 },
  { id: 2,  name: "Argan",         icon: "🌿", color: "#a07c4a", batch: 1 },
  { id: 3,  name: "Jojoba",        icon: "🌱", color: "#c9a84c", batch: 1 },
  { id: 4,  name: "Rosehip",       icon: "🌹", color: "#c25e5e", batch: 1 },
  { id: 5,  name: "Lavender",      icon: "💜", color: "#8c72a6", batch: 1 },
  { id: 6,  name: "Eucalyptus",    icon: "🍃", color: "#4a8c75", batch: 1 },
  { id: 7,  name: "Peppermint",    icon: "🌿", color: "#3a8c5e", batch: 1 },
  { id: 8,  name: "Tea Tree",      icon: "🌿", color: "#2d7345", batch: 1 },
  { id: 9,  name: "Frankincense",  icon: "✨", color: "#c9a84c", batch: 1 },
  { id: 10, name: "Myrrh",         icon: "🟤", color: "#7a5c43", batch: 1 },

  { id: 11, name: "Chamomile",     icon: "🌼", color: "#d4a820", batch: 2 },
  { id: 12, name: "Calendula",     icon: "🌸", color: "#e0813a", batch: 2 },
  { id: 13, name: "Sea Buckthorn", icon: "🟠", color: "#d95f1a", batch: 2 },
  { id: 14, name: "Black Seed",    icon: "🖤", color: "#555555", batch: 2 },
  { id: 15, name: "Castor",        icon: "💧", color: "#5b8fa8", batch: 2 },
  { id: 16, name: "Coconut",       icon: "🥥", color: "#b0956e", batch: 2 },
  { id: 17, name: "Sunflower",     icon: "🌻", color: "#d4a80e", batch: 2 },
  { id: 18, name: "Almond",        icon: "🤎", color: "#9b6c3e", batch: 2 },
  { id: 19, name: "Grape Seed",    icon: "🍇", color: "#7a4a8a", batch: 2 },
  { id: 20, name: "Hemp Seed",     icon: "🌿", color: "#4a6e30", batch: 2 },

  { id: 21, name: "Marula",        icon: "🌳", color: "#9a7040", batch: 3 },
  { id: 22, name: "Baobab",        icon: "🌲", color: "#7a8a50", batch: 3 },
  { id: 23, name: "Tamanu",        icon: "🍀", color: "#2d5a27", batch: 3 },
  { id: 24, name: "Pumpkin Seed",  icon: "🎃", color: "#a05e20", batch: 3 },
  { id: 25, name: "Pomegranate",   icon: "❤️", color: "#ab2e3e", batch: 3 },
  { id: 26, name: "Turmeric",      icon: "🟡", color: "#c99010", batch: 3 },
  { id: 27, name: "Ginger",        icon: "🫚", color: "#c08840", batch: 3 },
  { id: 28, name: "Clove",         icon: "🟤", color: "#6a4230", batch: 3 },
  { id: 29, name: "Cinnamon",      icon: "🟫", color: "#8a4a28", batch: 3 },
  { id: 30, name: "Bergamot",      icon: "🍋", color: "#a0b030", batch: 3 },
  { id: 31, name: "Rose",          icon: "🌹", color: "#c0405a", batch: 3 },
  { id: 32, name: "Neroli",        icon: "🌺", color: "#c8a060", batch: 3 },
  { id: 33, name: "Sandalwood",    icon: "🪵", color: "#9a6840", batch: 3 },
];

// ─── Positions: each batch independently scatters across the full screen ───
const TWO_PI = Math.PI * 2;

function generateBatchPositions(count: number, batchSeed: number) {
  const angleStep = TWO_PI / count;
  return Array.from({ length: count }, (_, i) => {
    const seedAngle = (i * 89 + batchSeed * 43 + 31)  % 97;
    const seedDist  = (i * 137 + batchSeed * 67 + 53) % 251;
    const seedDelay = (i * 71  + batchSeed * 29 + 17) % 97;

    const jitter = ((seedAngle / 97) - 0.5) * angleStep * 1.2;
    const angle  = i * angleStep + jitter;
    const dist   = 0.20 + (seedDist / 251) * 0.24;

    const xFrac = 0.5 + dist * Math.cos(angle) * 1.6;
    const yFrac = 0.5 + dist * Math.sin(angle);

    return {
      xFrac:  Math.max(0.05, Math.min(0.94, xFrac)),
      yFrac:  Math.max(0.07, Math.min(0.88, yFrac)),
      delay:  (seedDelay / 97) * 2.4,
    };
  });
}

const batch1Pos = generateBatchPositions(10, 1);
const batch2Pos = generateBatchPositions(10, 2);
const batch3Pos = generateBatchPositions(13, 3);

export const HERO_POSITIONS = [...batch1Pos, ...batch2Pos, ...batch3Pos];

// ─── Scroll-progress windows ────────────────────────────────────────────────
//
//  [0.00–0.07]  Cap lifts off the bottle
//  [0.08–0.20]  Batch 1 APPEARS
//  [0.22–0.44]  Batch 1 FLIES → oil starts rising
//  [0.36–0.48]  Batch 2 APPEARS  ← halfway through batch 1 fly
//  [0.50–0.66]  Batch 2 FLIES
//  [0.58–0.66]  Batch 3 APPEARS  ← halfway through batch 2 fly
//  [0.66–0.86]  Batch 3 FLIES → oil fully risen
//  [0.87–0.96]  Cap drops back and locks onto bottle
//  [0.96–1.00]  Sealed bottle dwell before next section

export const BATCH_TIMING = {
  1: { appearBase: 0.08, flyBase: 0.22, batchSize: 10 },
  2: { appearBase: 0.36, flyBase: 0.50, batchSize: 10 },
  3: { appearBase: 0.58, flyBase: 0.66, batchSize: 13 },
} as const;

// Bottle fill: starts when batch 1 starts flying, ends when batch 3 finishes
export const BOTTLE_FILL_START = 0.22;
export const BOTTLE_FILL_END   = 0.87;

// Cap animation progress points (used by Bottle component)
export const CAP_LIFT_START   = 0.00;
export const CAP_LIFT_END     = 0.07;
export const CAP_RETURN_START = 0.87;
export const CAP_RETURN_END   = 0.96;

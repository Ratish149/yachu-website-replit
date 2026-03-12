export interface Ingredient {
  id: number;
  name: string;
  icon: string;
  color: string;
  batch: 1 | 2 | 3;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 1,  name: "Olive",        icon: "🫒", color: "#6b8f3a", batch: 1 },
  { id: 2,  name: "Argan",        icon: "🌿", color: "#a07c4a", batch: 1 },
  { id: 3,  name: "Jojoba",       icon: "🌱", color: "#c9a84c", batch: 1 },
  { id: 4,  name: "Rosehip",      icon: "🌹", color: "#c25e5e", batch: 1 },
  { id: 5,  name: "Lavender",     icon: "💜", color: "#8c72a6", batch: 1 },
  { id: 6,  name: "Eucalyptus",   icon: "🍃", color: "#4a8c75", batch: 1 },
  { id: 7,  name: "Peppermint",   icon: "🌿", color: "#3a8c5e", batch: 1 },
  { id: 8,  name: "Tea Tree",     icon: "🌿", color: "#2d7345", batch: 1 },
  { id: 9,  name: "Frankincense", icon: "✨", color: "#c9a84c", batch: 1 },
  { id: 10, name: "Myrrh",        icon: "🟤", color: "#7a5c43", batch: 1 },

  { id: 11, name: "Chamomile",    icon: "🌼", color: "#d4a820", batch: 2 },
  { id: 12, name: "Calendula",    icon: "🌸", color: "#e0813a", batch: 2 },
  { id: 13, name: "Sea Buckthorn",icon: "🟠", color: "#d95f1a", batch: 2 },
  { id: 14, name: "Black Seed",   icon: "🖤", color: "#555555", batch: 2 },
  { id: 15, name: "Castor",       icon: "💧", color: "#5b8fa8", batch: 2 },
  { id: 16, name: "Coconut",      icon: "🥥", color: "#b0956e", batch: 2 },
  { id: 17, name: "Sunflower",    icon: "🌻", color: "#d4a80e", batch: 2 },
  { id: 18, name: "Almond",       icon: "🤎", color: "#9b6c3e", batch: 2 },
  { id: 19, name: "Grape Seed",   icon: "🍇", color: "#7a4a8a", batch: 2 },
  { id: 20, name: "Hemp Seed",    icon: "🌿", color: "#4a6e30", batch: 2 },

  { id: 21, name: "Marula",       icon: "🌳", color: "#9a7040", batch: 3 },
  { id: 22, name: "Baobab",       icon: "🌲", color: "#7a8a50", batch: 3 },
  { id: 23, name: "Tamanu",       icon: "🍀", color: "#2d5a27", batch: 3 },
  { id: 24, name: "Pumpkin Seed", icon: "🎃", color: "#a05e20", batch: 3 },
  { id: 25, name: "Pomegranate",  icon: "❤️", color: "#ab2e3e", batch: 3 },
  { id: 26, name: "Turmeric",     icon: "🟡", color: "#c99010", batch: 3 },
  { id: 27, name: "Ginger",       icon: "🫚", color: "#c08840", batch: 3 },
  { id: 28, name: "Clove",        icon: "🟤", color: "#6a4230", batch: 3 },
  { id: 29, name: "Cinnamon",     icon: "🟫", color: "#8a4a28", batch: 3 },
  { id: 30, name: "Bergamot",     icon: "🍋", color: "#a0b030", batch: 3 },
  { id: 31, name: "Rose",         icon: "🌹", color: "#c0405a", batch: 3 },
  { id: 32, name: "Neroli",       icon: "🌺", color: "#c8a060", batch: 3 },
  { id: 33, name: "Sandalwood",   icon: "🪵", color: "#9a6840", batch: 3 },
];

// Spread positions across the full viewport using deterministic pseudo-random
// vw/vh fractions (0–1), converted to pixel offsets at render time
export const HERO_POSITIONS: { xFrac: number; yFrac: number; delay: number }[] =
  INGREDIENTS.map((_, i) => {
    const seed1 = (i * 137 + 17) % 251;
    const seed2 = (i * 271 + 31) % 349;
    const seed3 = (i * 89  + 7)  % 97;
    return {
      // spread across 5–95% of viewport width/height
      xFrac: 0.05 + (seed1 / 251) * 0.90,
      yFrac: 0.05 + (seed2 / 349) * 0.90,
      delay:  (seed3 / 97) * 2.0,
    };
  });

export const BATCH_RANGES = {
  1: { start: 0,    end: 0.33 },
  2: { start: 0.33, end: 0.66 },
  3: { start: 0.66, end: 1.00 },
} as const;

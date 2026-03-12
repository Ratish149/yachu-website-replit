export interface Ingredient {
  id: number;
  name: string;
  icon: string;
  color: string;
}

export const INGREDIENTS: Ingredient[] = [
  { id: 1, name: "Olive", icon: "🫒", color: "#8b9c45" },
  { id: 2, name: "Argan", icon: "🌿", color: "#a89063" },
  { id: 3, name: "Jojoba", icon: "🌱", color: "#c9a84c" },
  { id: 4, name: "Rosehip", icon: "🌹", color: "#c25e5e" },
  { id: 5, name: "Lavender", icon: "💜", color: "#8c72a6" },
  { id: 6, name: "Eucalyptus", icon: "🍃", color: "#567d6c" },
  { id: 7, name: "Peppermint", icon: "🌿", color: "#459c76" },
  { id: 8, name: "Tea Tree", icon: "🌿", color: "#3d7350" },
  { id: 9, name: "Frankincense", icon: "✨", color: "#d9c388" },
  { id: 10, name: "Myrrh", icon: "🟤", color: "#7a5c43" },
  { id: 11, name: "Chamomile", icon: "🌼", color: "#e8cf66" },
  { id: 12, name: "Calendula", icon: "🌸", color: "#e8994a" },
  { id: 13, name: "Sea Buckthorn", icon: "🟠", color: "#e06c24" },
  { id: 14, name: "Black Seed", icon: "🖤", color: "#404040" },
  { id: 15, name: "Castor", icon: "💧", color: "#a8c8db" },
  { id: 16, name: "Coconut", icon: "🥥", color: "#e3dfd3" },
  { id: 17, name: "Sunflower", icon: "🌻", color: "#e6c735" },
  { id: 18, name: "Almond", icon: "🤎", color: "#a37e5c" },
  { id: 19, name: "Grape Seed", icon: "🍇", color: "#77548a" },
  { id: 20, name: "Hemp Seed", icon: "🌿", color: "#587841" },
  { id: 21, name: "Marula", icon: "🌳", color: "#ad8c53" },
  { id: 22, name: "Baobab", icon: "🌲", color: "#8c946c" },
  { id: 23, name: "Tamanu", icon: "🍀", color: "#2d5a27" },
  { id: 24, name: "Pumpkin Seed", icon: "🎃", color: "#3b522b" },
  { id: 25, name: "Pomegranate", icon: "❤️", color: "#ab2e3e" },
  { id: 26, name: "Turmeric", icon: "🟡", color: "#e6ad27" },
  { id: 27, name: "Ginger", icon: "🫚", color: "#cfb078" },
  { id: 28, name: "Clove", icon: "🟤", color: "#5e412f" },
  { id: 29, name: "Cinnamon", icon: "🟫", color: "#8a5739" },
  { id: 30, name: "Bergamot", icon: "🍋", color: "#c2cc58" },
  { id: 31, name: "Rose", icon: "🌹", color: "#d15c73" },
  { id: 32, name: "Neroli", icon: "🌺", color: "#f0d5a3" },
  { id: 33, name: "Sandalwood", icon: "🪵", color: "#a88560" },
];

// Pre-calculate deterministic random positions for particles so they don't jump on re-renders
// Spread around the right side of the screen
export const PARTICLE_POSITIONS = INGREDIENTS.map((_, i) => {
  // Use a pseudo-random generator based on index
  const seed1 = (i * 137) % 251;
  const seed2 = (i * 271) % 349;
  
  return {
    // x: between -350 and 350
    x: (seed1 / 251) * 700 - 350,
    // y: between -300 and 300
    y: (seed2 / 349) * 600 - 300,
    // random animation delay
    delay: (i * 0.1) % 2,
  };
});

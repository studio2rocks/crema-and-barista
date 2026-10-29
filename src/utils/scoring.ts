import { CoffeeTypeDefinition, CoffeeTypeKey, CupSizeDefinition, CupSizeKey, ScoreBreakdown } from '../types/coffee';

export const COFFEE_TYPES: CoffeeTypeDefinition[] = [
  {
    key: 'pourover',
    name: 'V60 / Chemex Pour Over',
    basePoints: 28,
    description: 'Manual single-origin extraction craft, clarity of tasting notes',
    category: 'filter-brew',
  },
  {
    key: 'siphon',
    name: 'Siphon / Vacuum Brew',
    basePoints: 30,
    description: 'Ultimate artisan theater, immaculate clarity and temperature control',
    category: 'filter-brew',
  },
  {
    key: 'cortado',
    name: 'Cortado / Gibraltar',
    basePoints: 25,
    description: 'The barista standard: 1:1 balance of textured microfoam & espresso',
    category: 'espresso-based',
  },
  {
    key: 'flat_white',
    name: 'Flat White',
    basePoints: 24,
    description: 'Silky microfoam over double ristretto, sweet milk sweetness',
    category: 'espresso-based',
  },
  {
    key: 'espresso',
    name: 'Double Espresso / Ristretto',
    basePoints: 23,
    description: 'Pure terroir extraction, crema tiger striping, intense aromatic oils',
    category: 'espresso-based',
  },
  {
    key: 'aeropress',
    name: 'AeroPress Specialty',
    basePoints: 24,
    description: 'Inverted pressure brew, full body with high clarity',
    category: 'filter-brew',
  },
  {
    key: 'nitro_coldbrew',
    name: 'Nitro Cold Brew',
    basePoints: 23,
    description: 'Micro-nitrogen cascade, creamy velvet mouthfeel, chilled sweetness',
    category: 'cold-brew',
  },
  {
    key: 'cappuccino',
    name: 'Specialty Cappuccino',
    basePoints: 21,
    description: 'Equal thirds harmonized foam, steamed milk, and rich espresso',
    category: 'espresso-based',
  },
  {
    key: 'macchiato',
    name: 'Traditional Macchiato',
    basePoints: 22,
    description: 'Espresso marked with dollop of textured foam',
    category: 'espresso-based',
  },
  {
    key: 'turkish',
    name: 'Turkish / Ibrik Cezve',
    basePoints: 22,
    description: 'Fine grind decoction brewing with traditional foam foam head',
    category: 'traditional',
  },
  {
    key: 'cold_brew',
    name: 'Slow Drip Cold Brew',
    basePoints: 20,
    description: '18-hour cold percolation, low acidity and chocolate sweetness',
    category: 'cold-brew',
  },
  {
    key: 'latte',
    name: 'Artisan Latte',
    basePoints: 18,
    description: 'Smooth steamed milk canvas with signature barista latte art',
    category: 'espresso-based',
  },
  {
    key: 'batch_brew',
    name: 'Specialty Batch Brew / Americano',
    basePoints: 15,
    description: 'Precision automated batch filter brew or diluted espresso',
    category: 'filter-brew',
  },
];

export const CUP_SIZES: CupSizeDefinition[] = [
  {
    key: 'single',
    name: 'Single / Piccolo',
    volume: '30–90 ml',
    multiplier: 1.1,
    description: 'High concentration of espresso flavor and crema density',
  },
  {
    key: 'double',
    name: 'Double / Regular Barista',
    volume: '150–220 ml (5–7 oz)',
    multiplier: 1.15,
    description: 'Golden specialty cup ratio; ideal espresso to milk equilibrium',
  },
  {
    key: 'regular',
    name: 'Standard Cup',
    volume: '240–300 ml (8–10 oz)',
    multiplier: 1.0,
    description: 'Standard daily morning drink size',
  },
  {
    key: 'large',
    name: 'Large',
    volume: '350–450 ml (12–16 oz)',
    multiplier: 0.92,
    description: 'More volume with milk dilution or extended water ratio',
  },
  {
    key: 'triple',
    name: 'Triple Shot Artisan',
    volume: '220–280 ml',
    multiplier: 1.12,
    description: 'Triple dose specialty pull for maximum caffeine and body',
  },
];

/**
 * Calculates detailed score breakdown for a cup of coffee:
 * 1. Coffee Type Base: 15 to 30 pts
 * 2. Size multiplier bonus: applied to base points
 * 3. Location Rating (1-10): 5 to 25 pts
 * 4. Barista Look & Craft (1-10): 6 to 30 pts
 * 5. Coffee Shop Look & Vibe (1-10): 4 to 20 pts
 * 6. Single Origin bonus: +5 pts
 */
export function calculateCoffeePoints(params: {
  coffeeType: CoffeeTypeKey;
  size: CupSizeKey;
  locationRating: number;
  baristaLookRating: number;
  shopLookRating: number;
  isSingleOrigin: boolean;
}): ScoreBreakdown {
  const typeDef = COFFEE_TYPES.find((t) => t.key === params.coffeeType) || COFFEE_TYPES[0];
  const sizeDef = CUP_SIZES.find((s) => s.key === params.size) || CUP_SIZES[1];

  const typePoints = typeDef.basePoints;
  const sizeMultiplier = sizeDef.multiplier;
  const sizeBonusPoints = Math.round(typePoints * (sizeMultiplier - 1.0));

  // Location: rating 1-10 mapped to 5 - 25 points
  const safeLoc = Math.min(10, Math.max(1, params.locationRating));
  const locationPoints = Math.round(5 + ((safeLoc - 1) / 9) * 20);

  // Barista Look & Latte Art: rating 1-10 mapped to 6 - 30 points
  const safeBarista = Math.min(10, Math.max(1, params.baristaLookRating));
  const baristaCraftPoints = Math.round(6 + ((safeBarista - 1) / 9) * 24);

  // Coffee Shop Aesthetic & Atmosphere: rating 1-10 mapped to 4 - 20 points
  const safeShop = Math.min(10, Math.max(1, params.shopLookRating));
  const shopLookPoints = Math.round(4 + ((safeShop - 1) / 9) * 16);

  // Specialty bonus
  const specialtyBonus = params.isSingleOrigin ? 5 : 0;

  const totalPoints =
    typePoints +
    sizeBonusPoints +
    locationPoints +
    baristaCraftPoints +
    shopLookPoints +
    specialtyBonus;

  return {
    typePoints,
    sizeMultiplier,
    sizeBonusPoints,
    locationPoints,
    baristaCraftPoints,
    shopLookPoints,
    specialtyBonus,
    totalPoints,
  };
}

export function getScoreTier(score: number): {
  label: string;
  badgeClass: string;
  description: string;
} {
  if (score >= 95) {
    return {
      label: 'Grand Connoisseur',
      badgeClass: 'text-amber-800 bg-amber-100 border-amber-300',
      description: 'World-tier cup with master extraction and elite barista execution',
    };
  }
  if (score >= 85) {
    return {
      label: 'Specialty Gold',
      badgeClass: 'text-yellow-800 bg-yellow-100 border-yellow-300',
      description: 'Exemplary artisanal craft and aesthetic coffee shop ambiance',
    };
  }
  if (score >= 70) {
    return {
      label: 'Third Wave Standard',
      badgeClass: 'text-stone-800 bg-stone-100 border-stone-300',
      description: 'Solid specialty coffee with great barista care and vibe',
    };
  }
  return {
    label: 'Daily Fuel',
    badgeClass: 'text-zinc-700 bg-zinc-100 border-zinc-200',
    description: 'Casual coffee intake with baseline scoring',
  };
}

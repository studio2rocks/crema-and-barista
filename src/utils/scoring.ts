import {
  CarCategoryKey,
  CarsAndCoffeeScoreBreakdown,
  CoffeeTypeDefinition,
  CoffeeTypeKey,
  CupSizeDefinition,
  CupSizeKey,
} from '../types/coffee';

export const COFFEE_TYPES: CoffeeTypeDefinition[] = [
  {
    key: 'pourover',
    name: 'V60 / Chemex Hand Pour',
    basePoints: 28,
    description: 'Precision manual extraction, single-origin clarity for morning drives',
    category: 'filter-brew',
  },
  {
    key: 'siphon',
    name: 'Siphon / Vacuum Brew',
    basePoints: 30,
    description: 'Paddock theater, extreme clarity and aromatic profile',
    category: 'filter-brew',
  },
  {
    key: 'cortado',
    name: 'Cortado / Gibraltar',
    basePoints: 25,
    description: 'The driver standard: 1:1 textured microfoam & double shot espresso',
    category: 'espresso-based',
  },
  {
    key: 'flat_white',
    name: 'Flat White',
    basePoints: 24,
    description: 'Velvet microfoam over double ristretto, sweet microfoam gloss',
    category: 'espresso-based',
  },
  {
    key: 'espresso',
    name: 'Double Espresso / Ristretto',
    basePoints: 23,
    description: 'Pure high-octane extraction, tiger crema striping',
    category: 'espresso-based',
  },
  {
    key: 'aeropress',
    name: 'AeroPress Specialty',
    basePoints: 24,
    description: 'Manual inverted extraction, high body and bright citrus finish',
    category: 'filter-brew',
  },
  {
    key: 'nitro_coldbrew',
    name: 'Nitro Cold Brew on Tap',
    basePoints: 23,
    description: 'Micro-nitrogen cascade, creamy chilled fuel for summer meets',
    category: 'cold-brew',
  },
  {
    key: 'cappuccino',
    name: 'Specialty Cappuccino',
    basePoints: 21,
    description: 'Equal thirds harmonious textured foam, milk, and espresso',
    category: 'espresso-based',
  },
  {
    key: 'macchiato',
    name: 'Traditional Macchiato',
    basePoints: 22,
    description: 'Double espresso marked with dollop of textured foam',
    category: 'espresso-based',
  },
  {
    key: 'cold_brew',
    name: 'Slow Drip Cold Brew',
    basePoints: 20,
    description: '18-hour cold percolation, smooth chocolate and caramel profile',
    category: 'cold-brew',
  },
  {
    key: 'latte',
    name: 'Artisan Latte',
    basePoints: 18,
    description: 'Smooth steamed milk canvas with signature barista rosette or swan',
    category: 'espresso-based',
  },
  {
    key: 'batch_brew',
    name: 'Specialty Batch Brew Filter',
    basePoints: 16,
    description: 'High-volume morning fuel, clean temperature-controlled brew',
    category: 'filter-brew',
  },
];

export const CUP_SIZES: CupSizeDefinition[] = [
  {
    key: 'single',
    name: 'Single / Piccolo',
    volume: '30–90 ml',
    multiplier: 1.1,
    description: 'High concentration espresso punch',
  },
  {
    key: 'double',
    name: 'Double / Barista Standard',
    volume: '150–220 ml (5–7 oz)',
    multiplier: 1.15,
    description: 'Golden ratio for specialty morning meets',
  },
  {
    key: 'regular',
    name: 'Standard Cup',
    volume: '240–300 ml (8–10 oz)',
    multiplier: 1.0,
    description: 'Comfortable road-trip mug size',
  },
  {
    key: 'large',
    name: 'Large Travel Cup',
    volume: '350–450 ml (12–16 oz)',
    multiplier: 0.94,
    description: 'Extended volume for long scenic cruises',
  },
  {
    key: 'triple',
    name: 'Triple Shot Paddock Dose',
    volume: '220–280 ml',
    multiplier: 1.12,
    description: 'High octane caffeine boost for early dawn starts',
  },
];

export const CAR_CATEGORIES: { key: CarCategoryKey; basePts: number; description: string }[] = [
  { key: 'Air-Cooled Classic', basePts: 28, description: 'Vintage Porsche 911, 356, air-cooled engineering icons' },
  { key: 'JDM Tuner', basePts: 26, description: 'Skyline GT-R, RX-7, Supra, NSX, Evolution, Chaser' },
  { key: 'Euro Classic', basePts: 26, description: 'E30 M3, Alfa Romeo Giulia, Lancia Delta, Vintage Ferrari' },
  { key: 'American Muscle', basePts: 25, description: '1969 Camaro, Boss 302 Mustang, C2/C3 Corvette Stingray' },
  { key: 'Modern GT', basePts: 25, description: 'Porsche GT3, BMW M2 CS, Cayman GT4, AMG GT, Audi R8' },
  { key: 'Hot Hatch / Restomod', basePts: 24, description: 'Singer/Gunther inspired builds, Golf R32, Integrale' },
  { key: 'Exotic Supercar', basePts: 26, description: 'Lamborghini, McLaren, vintage Ferrari Berlinetta' },
  { key: 'Vintage Roadster', basePts: 24, description: 'Datsun 240Z, Austin-Healey, Mazda Miata NA, Triumph' },
];

/**
 * Calculates combined Cars & Coffee Points
 */
export function calculateCarsAndCoffeePoints(params: {
  carCategory: CarCategoryKey;
  carYear: number;
  carLookRating: number; // 1-10
  mods: string;
  coffeeCupsCount: number; // 1-6
  primaryCoffeeType: CoffeeTypeKey;
  baristaLookRating: number; // 1-10
  locationRating: number; // 1-10
  shopLookRating: number; // 1-10
  isSingleOrigin: boolean;
}): CarsAndCoffeeScoreBreakdown {
  // 1. Car Build Points
  const cat = CAR_CATEGORIES.find((c) => c.key === params.carCategory) || CAR_CATEGORIES[0];
  const eraBonus = params.carYear <= 1999 ? 4 : params.carYear <= 2010 ? 2 : 1;
  const safeCarLook = Math.min(10, Math.max(1, params.carLookRating));
  const carLookAdd = Math.round(((safeCarLook - 1) / 9) * 12);
  const carBuildPoints = cat.basePts + eraBonus + carLookAdd; // range ~ 25 to 44 pts

  // 2. Mods Bonus
  const modString = (params.mods || '').trim();
  let modsBonusPoints = 0;
  if (modString.length > 5) {
    const commas = modString.split(',').length;
    modsBonusPoints = commas >= 4 ? 15 : commas >= 2 ? 10 : 6;
  }

  // 3. Coffee Craft Points
  const typeDef = COFFEE_TYPES.find((t) => t.key === params.primaryCoffeeType) || COFFEE_TYPES[0];
  const cupsCount = Math.min(6, Math.max(1, params.coffeeCupsCount));
  const cupBonus = (cupsCount - 1) * 4; // +4 pts per cup after the first
  const originBonus = params.isSingleOrigin ? 5 : 0;
  const coffeeCraftPoints = typeDef.basePoints + cupBonus + originBonus; // range ~ 16 to 47 pts

  // 4. Barista Look & Craft Points
  const safeBarista = Math.min(10, Math.max(1, params.baristaLookRating));
  const baristaLookPoints = Math.round(6 + ((safeBarista - 1) / 9) * 24); // range 6 to 30 pts

  // 5. Meet Location & Cafe Aesthetic Points
  const safeLoc = Math.min(10, Math.max(1, params.locationRating));
  const safeShop = Math.min(10, Math.max(1, params.shopLookRating));
  const meetAndShopPoints = Math.round(
    4 + ((safeLoc - 1) / 9) * 11 + (4 + ((safeShop - 1) / 9) * 10)
  ); // range 8 to 25 pts

  const totalPoints =
    carBuildPoints +
    modsBonusPoints +
    coffeeCraftPoints +
    baristaLookPoints +
    meetAndShopPoints;

  return {
    carBuildPoints,
    modsBonusPoints,
    coffeeCraftPoints,
    baristaLookPoints,
    meetAndShopPoints,
    totalPoints,
  };
}

export function getCarsAndCoffeeTier(score: number): {
  label: string;
  badgeClass: string;
  description: string;
} {
  if (score >= 120) {
    return {
      label: 'Paddock Legend',
      badgeClass: 'text-amber-700 bg-amber-100 border-amber-300',
      description: 'Iconic vehicle build paired with master artisan coffee execution',
    };
  }
  if (score >= 100) {
    return {
      label: 'Grand Tourer',
      badgeClass: 'text-yellow-700 bg-yellow-100 border-yellow-300',
      description: 'Exceptional automotive presence and top-tier morning coffee craft',
    };
  }
  if (score >= 80) {
    return {
      label: 'Dawn Patrol',
      badgeClass: 'text-stone-700 bg-stone-100 border-stone-300',
      description: 'Solid enthusiast build and passionate coffee meet participant',
    };
  }
  return {
    label: 'Morning Cruiser',
    badgeClass: 'text-zinc-700 bg-zinc-100 border-zinc-200',
    description: 'Casual Sunday morning drive and warm cup of coffee',
  };
}

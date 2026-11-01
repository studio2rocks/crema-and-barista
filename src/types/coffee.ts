export type CoffeeTypeKey =
  | 'espresso'
  | 'cortado'
  | 'flat_white'
  | 'pourover'
  | 'aeropress'
  | 'siphon'
  | 'cappuccino'
  | 'macchiato'
  | 'cold_brew'
  | 'nitro_coldbrew'
  | 'latte'
  | 'turkish'
  | 'batch_brew';

export type CupSizeKey = 'single' | 'double' | 'regular' | 'large' | 'triple';

export type CarCategoryKey =
  | 'Euro Classic'
  | 'JDM Tuner'
  | 'American Muscle'
  | 'Air-Cooled Classic'
  | 'Modern GT'
  | 'Exotic Supercar'
  | 'Vintage Roadster'
  | 'Hot Hatch / Restomod';

export interface CoffeeTypeDefinition {
  key: CoffeeTypeKey;
  name: string;
  basePoints: number;
  description: string;
  category: 'espresso-based' | 'filter-brew' | 'cold-brew' | 'traditional';
}

export interface CupSizeDefinition {
  key: CupSizeKey;
  name: string;
  volume: string;
  multiplier: number;
  description: string;
}

export interface CarsAndCoffeeScoreBreakdown {
  carBuildPoints: number; // based on car era, category & car look rating (10 to 35 pts)
  coffeeCraftPoints: number; // based on coffee types and cup count (15 to 40 pts)
  baristaLookPoints: number; // based on barista rating (6 to 30 pts)
  meetAndShopPoints: number; // based on location & cafe aesthetic (8 to 25 pts)
  modsBonusPoints: number; // bonus for curated mods (+5 to +15 pts)
  totalPoints: number;
}

export interface CarsAndCoffeeEntry {
  id: string;
  dateTime: string; // ISO string e.g. "2026-11-01T07:30:00"
  
  // Car Specs
  carYear: number;
  carMake: string;
  carModel: string;
  carCategory: CarCategoryKey;
  mods: string; // Freeform user input e.g. "KW V3 coilovers, BBS LM wheels, titanium exhaust, Stage 2 tune"
  carPhotoUrl: string;
  stampedCarPhotoUrl?: string; // Stamped with vehicle specs, timestamp & meet score
  carLookRating: number; // 1 to 10 (stance, paint polish, build taste, presence)
  
  // Coffee & Barista Specs
  coffeeCupsCount: number; // 1 to 6 cups consumed at the morning meet
  coffeeTypes: CoffeeTypeKey[]; // List of coffee types enjoyed
  primaryCoffeeType: CoffeeTypeKey;
  size: CupSizeKey;
  baristaPhotoUrl: string;
  stampedBaristaPhotoUrl?: string;
  baristaLookRating: number; // 1 to 10 (latte art, presentation, craft)
  baristaName?: string;
  
  // Meet Location & Cafe Aesthetic
  shopName: string;
  meetName: string; // e.g. "Daikanyama T-Site Morning Drive" or "Crystal Cove Sunrise"
  city: string;
  country: string;
  locationRating: number; // 1 to 10 (roastery quality & meet venue)
  shopLookRating: number; // 1 to 10 (cafe aesthetic, atmosphere)
  isSingleOrigin: boolean;
  notes?: string;
  
  // Score
  points: CarsAndCoffeeScoreBreakdown;
}

export interface WorldwidePaddockDriver {
  id: string;
  name: string;
  handle: string;
  avatarUrl: string;
  city: string;
  country: string;
  countryCode: string;
  region: 'Global' | 'Europe' | 'Asia-Pacific' | 'North America' | 'Latin America';
  rankToday: number;
  rankAllTime: number;
  todayMeets: number;
  todayPoints: number;
  allTimeMeets: number;
  allTimePoints: number;
  avgScore: number;
  featuredCar: {
    year: number;
    make: string;
    model: string;
    category: CarCategoryKey;
    mods: string;
    photoUrl: string;
  };
  signatureCoffee: {
    type: CoffeeTypeKey;
    cups: number;
    shop: string;
  };
  titleBadge: string;
}

export interface GlobalPaddockActivityItem {
  id: string;
  driverName: string;
  driverAvatar: string;
  city: string;
  countryCode: string;
  carTitle: string; // e.g. "1994 Porsche 911 (993) Carrera 4"
  modsExcerpt: string;
  coffeeSummary: string; // e.g. "2x Cortado & V60 Pour Over"
  shopName: string;
  meetName: string;
  points: number;
  timeAgo: string;
  carPhotoUrl?: string;
  baristaPhotoUrl?: string;
  carLookRating: number;
  baristaRating: number;
}

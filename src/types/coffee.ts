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

export interface ScoreBreakdown {
  typePoints: number;
  sizeMultiplier: number;
  sizeBonusPoints: number;
  locationPoints: number;
  baristaCraftPoints: number;
  shopLookPoints: number;
  specialtyBonus: number;
  totalPoints: number;
}

export interface CoffeeEntry {
  id: string;
  dateTime: string; // ISO string e.g. "2026-10-29T09:45:00"
  coffeeName: string; // e.g. "Geisha V60 Hand Pour" or "Double Flat White"
  coffeeType: CoffeeTypeKey;
  size: CupSizeKey;
  shopName: string;
  city: string;
  country: string;
  locationRating: number; // 1 to 10
  baristaLookRating: number; // 1 to 10 (latte art, craft & barista presentation)
  shopLookRating: number; // 1 to 10 (cafe interior aesthetic, atmosphere)
  baristaPhotoUrl: string; // Uploaded or sample image
  watermarkedPhotoUrl?: string; // Stamped image with datetime, shop & score
  isSingleOrigin: boolean;
  notes?: string;
  points: ScoreBreakdown;
  baristaName?: string;
}

export interface WorldwideConnoisseur {
  id: string;
  name: string;
  username: string;
  avatarUrl: string;
  city: string;
  country: string;
  countryCode: string;
  region: 'Global' | 'Europe' | 'Asia-Pacific' | 'North America' | 'Latin America';
  rankToday: number;
  rankAllTime: number;
  todayCups: number;
  todayPoints: number;
  allTimeCups: number;
  allTimePoints: number;
  avgDrinkScore: number;
  favoriteType: CoffeeTypeKey;
  favoriteShop: string;
  titleBadge: string;
  recentDrink?: {
    name: string;
    points: number;
    timeAgo: string;
    shop: string;
    city: string;
    photoUrl?: string;
  };
}

export interface GlobalActivityFeedItem {
  id: string;
  userName: string;
  userAvatar: string;
  city: string;
  countryCode: string;
  coffeeName: string;
  coffeeType: CoffeeTypeKey;
  shopName: string;
  points: number;
  timeAgo: string;
  photoUrl?: string;
  baristaRating: number;
  shopRating: number;
}

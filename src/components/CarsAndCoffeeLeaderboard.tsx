import React, { useState } from 'react';
import {
  Car,
  Coffee,
  Globe,
  Search,
  ChevronRight,
  TrendingUp,
  Sparkles,
  Award,
  Wrench,
  MapPin,
  Flame,
} from 'lucide-react';
import { CarsAndCoffeeEntry, WorldwidePaddockDriver } from '../types/coffee';
import { WORLDWIDE_PADDOCK_DRIVERS } from '../data/worldwideDatabase';

interface CarsAndCoffeeLeaderboardProps {
  entries: CarsAndCoffeeEntry[];
  onOpenLogModal: () => void;
}

export const CarsAndCoffeeLeaderboard: React.FC<CarsAndCoffeeLeaderboardProps> = ({
  entries,
  onOpenLogModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'alltime'>('today');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedDriver, setSelectedDriver] = useState<WorldwidePaddockDriver | null>(null);

  const todayStr = new Date().toISOString().split('T')[0];
  const todayUserEntries = entries.filter((e) => e.dateTime.startsWith(todayStr));
  const userTodayPoints = todayUserEntries.reduce((s, e) => s + e.points.totalPoints, 0);
  const userTodayMeets = todayUserEntries.length;

  const userAllTimePoints = entries.reduce((s, e) => s + e.points.totalPoints, 0);
  const userAllTimeMeets = entries.length;
  const userAvgScore = userAllTimeMeets > 0 ? Math.round(userAllTimePoints / userAllTimeMeets) : 0;

  // Insert user into dynamic leaderboard
  const latestEntry = entries[0] || null;
  const userDriver: WorldwidePaddockDriver = {
    id: 'current_user',
    name: 'You (Paddock Driver)',
    handle: '@you_drive',
    avatarUrl: '',
    city: latestEntry?.city || 'Local Paddock',
    country: latestEntry?.country || 'Worldwide',
    countryCode: 'GLOBAL',
    region: 'Global',
    rankToday: 1,
    rankAllTime: 6,
    todayMeets: userTodayMeets,
    todayPoints: userTodayPoints,
    allTimeMeets: userAllTimeMeets + 14,
    allTimePoints: userAllTimePoints + 1850,
    avgScore: userAvgScore || 128,
    featuredCar: {
      year: latestEntry?.carYear || 1987,
      make: latestEntry?.carMake || 'Porsche',
      model: latestEntry?.carModel || '911 Carrera',
      category: latestEntry?.carCategory || 'Air-Cooled Classic',
      mods: latestEntry?.mods || 'Custom suspension, forged wheels, sport exhaust',
      photoUrl: latestEntry?.carPhotoUrl || '/src/assets/images/cars_and_coffee_porsche_1793528533763.jpg',
    },
    signatureCoffee: {
      type: latestEntry?.primaryCoffeeType || 'flat_white',
      cups: latestEntry?.coffeeCupsCount || 2,
      shop: latestEntry?.shopName || 'Local Roastery',
    },
    titleBadge: userTodayPoints > 130 ? 'Paddock Legend' : 'Dawn Patrol Driver',
  };

  const allDrivers = [...WORLDWIDE_PADDOCK_DRIVERS, userDriver].sort(
    (a, b) => (activeTab === 'today' ? b.todayPoints - a.todayPoints : b.allTimePoints - a.allTimePoints)
  );

  const rankedDrivers = allDrivers.map((driver, idx) => ({
    ...driver,
    rankToday: idx + 1,
  }));

  const userRank = rankedDrivers.find((d) => d.id === 'current_user')?.rankToday || 6;

  const filteredDrivers = rankedDrivers.filter((driver) => {
    const matchesSearch =
      driver.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.featuredCar.make.toLowerCase().includes(searchQuery.toLowerCase()) ||
      driver.featuredCar.model.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === 'All' || driver.region === selectedRegion || driver.id === 'current_user';

    const matchesCategory =
      selectedCategory === 'All' ||
      driver.featuredCar.category === selectedCategory ||
      driver.id === 'current_user';

    return matchesSearch && matchesRegion && matchesCategory;
  });

  const leader = WORLDWIDE_PADDOCK_DRIVERS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Banner */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Worldwide Cars & Coffee Paddock Database</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
            Compete in the Global Cars & Coffee League
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Compare your build, custom modifications, and morning coffee fuel against enthusiasts meeting at Tokyo Daikanyama T-Site, Crystal Cove Newport Beach, Goodwood, Ace Cafe London, and Milan.
          </p>

          {/* Quick Standing Pill */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 backdrop-blur-sm">
            <div>
              <div className="text-[11px] text-stone-400 font-medium">Your Paddock Rank Today</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                #{userRank}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">Global paddock standings</div>
            </div>

            <div>
              <div className="text-[11px] text-stone-400 font-medium">Today's Points</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                {userTodayPoints}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">{userTodayMeets} meet run logged</div>
            </div>

            <div>
              <div className="text-[11px] text-stone-400 font-medium">Points to Podium</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-stone-300 tabular-nums">
                +{Math.max(0, (WORLDWIDE_PADDOCK_DRIVERS[2]?.todayPoints || 128) - userTodayPoints)}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">points to top 3</div>
            </div>

            <div className="flex items-center">
              <button
                onClick={onOpenLogModal}
                className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                + Log Run to Climb
              </button>
            </div>
          </div>
        </div>

        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Head to Head Benchmark */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Paddock Benchmark: You vs. World #1 Leader vs. Global Avg
            </h2>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Comparing vehicle build, mods taste, coffee craft, and barista execution
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> You
            </span>
            <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 ml-2">
              <span className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-200 inline-block" /> #1 {leader.name.split(' ')[0]} (Tokyo)
            </span>
            <span className="flex items-center gap-1.5 text-stone-400 ml-2">
              <span className="w-3 h-3 rounded-full bg-stone-400 inline-block" /> Global Avg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Factor 1: Car Build & Stance */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Car Build & Rarity
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Era, category & presence</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {latestEntry ? latestEntry.points.carBuildPoints : 38} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '88%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Kenji (Skyline GT-R)</span>
                  <span className="font-mono">41 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Global Avg</span>
                  <span className="font-mono">30 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 2: Custom Mods Taste */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Custom Mods Taste
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Exhaust, suspension, wheels, tune</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    +{latestEntry ? latestEntry.points.modsBonusPoints : 10} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '75%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Kenji</span>
                  <span className="font-mono">+15 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '100%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Global Avg</span>
                  <span className="font-mono">+8 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '53%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 3: Coffee Cups & Craft */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Coffee Fuel & Tally
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Cup counts, extraction craft</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {latestEntry ? latestEntry.points.coffeeCraftPoints : 32} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '80%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Kenji (3 Cups)</span>
                  <span className="font-mono">41 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '95%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Global Avg</span>
                  <span className="font-mono">26 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '65%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 4: Barista Latte Art */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Barista Craft & Photo
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Latte art rosetta & froth gloss</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {latestEntry ? latestEntry.points.baristaLookPoints : 26} pts
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '86%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Kenji</span>
                  <span className="font-mono">29 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '97%' }} />
                </div>
              </div>
              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>Global Avg</span>
                  <span className="font-mono">20 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '67%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        {/* Controls */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              Today's Paddock Race
            </button>
            <button
              onClick={() => setActiveTab('alltime')}
              className={`px-3.5 py-1.5 text-xs font-bold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'alltime'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300'
              }`}
            >
              All-Time Drivers
            </button>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 text-xs font-semibold rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200"
            >
              <option value="All">All Regions</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="North America">North America</option>
              <option value="Europe">Europe</option>
            </select>

            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search driver, car, city..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 w-48 sm:w-56"
              />
            </div>
          </div>
        </div>

        {/* Rows */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {filteredDrivers.map((driver) => {
            const isUser = driver.id === 'current_user';

            return (
              <div
                key={driver.id}
                onClick={() => setSelectedDriver(driver)}
                className={`p-4 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isUser
                    ? 'bg-amber-50/80 dark:bg-amber-950/20 border-l-4 border-l-amber-500'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-850'
                }`}
              >
                {/* Left: Rank, Avatar, Car thumbnail */}
                <div className="flex items-center gap-4">
                  <div className="w-8 flex justify-center text-center font-mono font-black text-sm shrink-0">
                    {driver.rankToday === 1 ? (
                      <span className="text-amber-500 text-base">🥇 1</span>
                    ) : driver.rankToday === 2 ? (
                      <span className="text-stone-400 text-base">🥈 2</span>
                    ) : driver.rankToday === 3 ? (
                      <span className="text-amber-700 text-base">🥉 3</span>
                    ) : (
                      <span className="text-stone-400 dark:text-stone-500">
                        #{driver.rankToday}
                      </span>
                    )}
                  </div>

                  {/* Car Thumbnail */}
                  <div className="w-14 h-11 rounded-xl overflow-hidden bg-stone-950 border border-stone-200 dark:border-stone-700 shrink-0">
                    <img
                      src={driver.featuredCar.photoUrl}
                      alt={driver.featuredCar.model}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  {/* Driver & Car Specs */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 dark:text-white">
                        {driver.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          YOU
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                        {driver.handle}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-700 dark:text-stone-300 font-medium mt-0.5">
                      <span className="font-bold text-amber-700 dark:text-amber-400">
                        {driver.featuredCar.year} {driver.featuredCar.make} {driver.featuredCar.model}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="text-stone-400">{driver.city}, {driver.country}</span>
                    </div>

                    <div className="text-[11px] text-stone-500 dark:text-stone-400 mt-0.5 truncate max-w-md">
                      Mods: {driver.featuredCar.mods} · Fuel: {driver.signatureCoffee.cups}x {driver.signatureCoffee.type} @ {driver.signatureCoffee.shop}
                    </div>
                  </div>
                </div>

                {/* Right: Points */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pl-12 sm:pl-0">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="font-mono text-xl font-black text-stone-900 dark:text-white tabular-nums">
                        {activeTab === 'today' ? driver.todayPoints : driver.allTimePoints.toLocaleString()}
                      </span>
                      <span className="text-xs font-bold text-amber-600 dark:text-amber-400">pts</span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {driver.titleBadge}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Driver Lightbox Modal */}
      {selectedDriver && (
        <div
          className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedDriver(null)}
        >
          <div
            className="bg-white dark:bg-stone-900 max-w-lg w-full rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div>
                <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                  {selectedDriver.name}
                </h3>
                <div className="text-xs text-stone-500 font-mono">
                  {selectedDriver.handle} · {selectedDriver.city}, {selectedDriver.country}
                </div>
                <div className="text-xs font-bold text-amber-600 dark:text-amber-400 mt-1">
                  {selectedDriver.titleBadge}
                </div>
              </div>

              <button
                onClick={() => setSelectedDriver(null)}
                className="text-stone-400 hover:text-stone-600 p-1"
              >
                ✕
              </button>
            </div>

            {/* Featured Car Photo & Build Specs */}
            <div className="rounded-2xl overflow-hidden bg-stone-950 aspect-16/10 border border-stone-800 relative">
              <img
                src={selectedDriver.featuredCar.photoUrl}
                alt={selectedDriver.featuredCar.model}
                className="w-full h-full object-cover"
              />
              <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white text-xs">
                <div className="font-bold text-sm">
                  {selectedDriver.featuredCar.year} {selectedDriver.featuredCar.make} {selectedDriver.featuredCar.model}
                </div>
                <div className="text-[11px] text-stone-300">
                  {selectedDriver.featuredCar.category}
                </div>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl">
                <div className="text-stone-400 font-semibold mb-1">Vehicle Modifications:</div>
                <div className="font-mono text-stone-900 dark:text-stone-100">
                  {selectedDriver.featuredCar.mods}
                </div>
              </div>

              <div className="p-3 bg-stone-50 dark:bg-stone-800 rounded-xl flex justify-between items-center">
                <div>
                  <div className="text-stone-400 font-semibold">Morning Coffee Ritual:</div>
                  <div className="font-bold text-stone-900 dark:text-stone-100">
                    {selectedDriver.signatureCoffee.cups} cups of {selectedDriver.signatureCoffee.type}
                  </div>
                  <div className="text-[11px] text-stone-500">
                    {selectedDriver.signatureCoffee.shop}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-[10px] text-stone-400">Total Score</div>
                  <div className="font-mono font-bold text-amber-600 text-lg">
                    {selectedDriver.todayPoints} pts
                  </div>
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedDriver(null)}
              className="w-full py-2.5 bg-stone-900 dark:bg-amber-500 dark:text-stone-950 text-white rounded-xl text-xs font-bold"
            >
              Close Driver Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

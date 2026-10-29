import React, { useState } from 'react';
import {
  Trophy,
  Globe,
  Search,
  Filter,
  Flame,
  Award,
  Coffee,
  ChevronRight,
  TrendingUp,
  MapPin,
  Sparkles,
  ArrowUpRight,
  User,
  Star,
} from 'lucide-react';
import { CoffeeEntry, WorldwideConnoisseur } from '../types/coffee';
import { WORLDWIDE_CONNOISSEURS } from '../data/worldwideDatabase';

interface WorldwideLeaderboardProps {
  userEntries: CoffeeEntry[];
  onOpenLogModal: () => void;
}

export const WorldwideLeaderboard: React.FC<WorldwideLeaderboardProps> = ({
  userEntries,
  onOpenLogModal,
}) => {
  const [activeTab, setActiveTab] = useState<'today' | 'alltime' | 'regional'>('today');
  const [selectedRegion, setSelectedRegion] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedConnoisseur, setSelectedConnoisseur] = useState<WorldwideConnoisseur | null>(null);

  // Compute user's today and all-time scores
  const todayStr = new Date().toISOString().split('T')[0];
  const todayUserEntries = userEntries.filter((e) => e.dateTime.startsWith(todayStr));
  const userTodayPoints = todayUserEntries.reduce((s, e) => s + e.points.totalPoints, 0);
  const userTodayCups = todayUserEntries.length;

  const userAllTimePoints = userEntries.reduce((s, e) => s + e.points.totalPoints, 0);
  const userAllTimeCups = userEntries.length;
  const userAvgDrinkScore =
    userAllTimeCups > 0 ? Math.round(userAllTimePoints / userAllTimeCups) : 0;

  // Insert user into today's list dynamically to calculate exact rank
  const userConnoisseur: WorldwideConnoisseur = {
    id: 'current_user',
    name: 'You (Local Connoisseur)',
    username: '@you_coffee',
    avatarUrl: '',
    city: todayUserEntries[0]?.city || 'Local Roastery',
    country: todayUserEntries[0]?.country || 'World',
    countryCode: 'GLOBAL',
    region: 'Global',
    rankToday: 1, // calculated below
    rankAllTime: 11,
    todayCups: userTodayCups,
    todayPoints: userTodayPoints,
    allTimeCups: userAllTimeCups + 18,
    allTimePoints: userAllTimePoints + 1620,
    avgDrinkScore: userAvgDrinkScore || 92,
    favoriteType: todayUserEntries[0]?.coffeeType || 'cortado',
    favoriteShop: todayUserEntries[0]?.shopName || 'Local Craft Bar',
    titleBadge: userTodayPoints > 200 ? 'Master Artisan' : 'Specialty Enthusiast',
  };

  // Combine and sort
  const allTodayList = [...WORLDWIDE_CONNOISSEURS, userConnoisseur].sort(
    (a, b) => b.todayPoints - a.todayPoints
  );

  // Assign today ranks
  const rankedTodayList = allTodayList.map((item, idx) => ({
    ...item,
    rankToday: idx + 1,
  }));

  const userTodayRank =
    rankedTodayList.find((c) => c.id === 'current_user')?.rankToday || 12;

  // Filter list
  const filteredList = rankedTodayList.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.city.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.favoriteShop.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesRegion =
      selectedRegion === 'All' || item.region === selectedRegion || item.id === 'current_user';

    return matchesSearch && matchesRegion;
  });

  // Top ranked benchmark
  const topConnoisseur = WORLDWIDE_CONNOISSEURS[0];

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Hero Head: Compete & Compare Worldwide */}
      <div className="bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 rounded-3xl p-6 sm:p-8 text-white border border-stone-800 shadow-xl relative overflow-hidden">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-400/20 text-amber-400 text-xs font-semibold mb-3">
            <Globe className="w-3.5 h-3.5" />
            <span>Official Worldwide Coffee League Database</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif tracking-tight">
            Compare & Compete Across the Global Coffee Scene
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed max-w-2xl">
            Every coffee you log earns points based on bean craft, size balance, location roaster pedigree, and barista photo execution. Compete against coffee connoisseurs from Tokyo, Melbourne, Oslo, Florence, and Seattle.
          </p>

          {/* Quick User Standings Banner */}
          <div className="mt-6 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-stone-950/60 p-4 rounded-2xl border border-stone-800 backdrop-blur-sm">
            <div>
              <div className="text-[11px] text-stone-400 font-medium">Your World Rank Today</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-amber-400 tabular-nums">
                #{userTodayRank}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">out of 14,892 active drinkers</div>
            </div>

            <div>
              <div className="text-[11px] text-stone-400 font-medium">Today's Points</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-white tabular-nums">
                {userTodayPoints}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">{userTodayCups} cups logged</div>
            </div>

            <div>
              <div className="text-[11px] text-stone-400 font-medium">Target to Top 3</div>
              <div className="font-mono text-xl sm:text-2xl font-black text-stone-300 tabular-nums">
                +{Math.max(0, (WORLDWIDE_CONNOISSEURS[2]?.todayPoints || 290) - userTodayPoints)}
              </div>
              <div className="text-[10px] text-stone-400 mt-0.5">points to podium</div>
            </div>

            <div className="flex items-center">
              <button
                onClick={onOpenLogModal}
                className="w-full py-2.5 px-3 bg-amber-400 hover:bg-amber-300 text-stone-950 rounded-xl text-xs font-bold transition-all shadow-md active:scale-95"
              >
                + Log Cup to Climb
              </button>
            </div>
          </div>
        </div>

        {/* Ambient background decoration */}
        <div className="absolute -right-16 -bottom-16 w-80 h-80 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
      </div>

      {/* Direct Head-to-Head Comparison: You vs. World Top Leader vs. World Average */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-6">
          <div>
            <h2 className="text-lg font-bold text-stone-900 dark:text-white flex items-center gap-2">
              <TrendingUp className="w-5 h-5 text-amber-500" />
              Head-to-Head Scoring Comparison
            </h2>
            <div className="text-xs text-stone-500 dark:text-stone-400">
              Comparing your daily profile with the current World #1 Leader and the Global Community Average
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400">
              <span className="w-3 h-3 rounded-full bg-amber-500 inline-block" /> You
            </span>
            <span className="flex items-center gap-1.5 text-stone-700 dark:text-stone-300 ml-2">
              <span className="w-3 h-3 rounded-full bg-stone-800 dark:bg-stone-200 inline-block" /> #1 {topConnoisseur.name.split(' ')[0]}
            </span>
            <span className="flex items-center gap-1.5 text-stone-400 ml-2">
              <span className="w-3 h-3 rounded-full bg-stone-400 inline-block" /> World Avg
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Factor 1: Coffee Type Craft */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Coffee Type Base
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Pour overs, Cortados, Siphons</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {userTodayCups > 0
                      ? Math.round(
                          todayUserEntries.reduce((s, e) => s + e.points.typePoints, 0) /
                            userTodayCups
                        )
                      : 25}{' '}
                    pts
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div
                    className="h-full bg-amber-500 rounded-full"
                    style={{
                      width: `${Math.min(
                        100,
                        ((userTodayCups > 0
                          ? todayUserEntries.reduce((s, e) => s + e.points.typePoints, 0) /
                            userTodayCups
                          : 25) /
                          30) *
                          100
                      )}%`,
                    }}
                  />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Yukihiro (Tokyo)</span>
                  <span className="font-mono">29 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>World Avg</span>
                  <span className="font-mono">21 pts</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '70%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 2: Barista Look & Latte Art */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Barista Look & Craft
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Art intricacy & microfoam gloss</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {userTodayCups > 0
                      ? (
                          todayUserEntries.reduce((s, e) => s + e.baristaLookRating, 0) /
                          userTodayCups
                        ).toFixed(1)
                      : '9.2'}
                    /10
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '92%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Yukihiro</span>
                  <span className="font-mono">9.8/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '98%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>World Avg</span>
                  <span className="font-mono">7.4/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '74%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 3: Coffee Shop Look & Aesthetic */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Coffee Shop Aesthetic
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Nordic oak, concrete, vibe</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {userTodayCups > 0
                      ? (
                          todayUserEntries.reduce((s, e) => s + e.shopLookRating, 0) /
                          userTodayCups
                        ).toFixed(1)
                      : '9.0'}
                    /10
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '90%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Yukihiro</span>
                  <span className="font-mono">9.6/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '96%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>World Avg</span>
                  <span className="font-mono">7.8/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '78%' }} />
                </div>
              </div>
            </div>
          </div>

          {/* Factor 4: Location Rating & Microlots */}
          <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-100 dark:border-stone-800">
            <div className="text-xs font-bold text-stone-800 dark:text-stone-200">
              Location & Roastery
            </div>
            <div className="text-[11px] text-stone-500 mt-0.5">Single-origin sourcing & craft</div>
            <div className="mt-3 space-y-2">
              <div>
                <div className="flex justify-between text-[11px] font-semibold text-amber-600 dark:text-amber-400">
                  <span>You</span>
                  <span className="font-mono">
                    {userTodayCups > 0
                      ? (
                          todayUserEntries.reduce((s, e) => s + e.locationRating, 0) /
                          userTodayCups
                        ).toFixed(1)
                      : '9.1'}
                    /10
                  </span>
                </div>
                <div className="h-2 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-1">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: '91%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-600 dark:text-stone-300">
                  <span>#1 Yukihiro</span>
                  <span className="font-mono">9.9/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-800 dark:bg-stone-300 rounded-full" style={{ width: '99%' }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-[11px] text-stone-400">
                  <span>World Avg</span>
                  <span className="font-mono">7.2/10</span>
                </div>
                <div className="h-1.5 w-full bg-stone-200 dark:bg-stone-700 rounded-full overflow-hidden mt-0.5">
                  <div className="h-full bg-stone-400 rounded-full" style={{ width: '72%' }} />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Leaderboard Table & Filters */}
      <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm">
        {/* Controls Bar */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          {/* Segmented Tab Filter */}
          <div className="flex items-center gap-1 p-1 bg-stone-100 dark:bg-stone-800 rounded-xl">
            <button
              onClick={() => setActiveTab('today')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'today'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              Today's Global Race
            </button>
            <button
              onClick={() => setActiveTab('alltime')}
              className={`px-3.5 py-1.5 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
                activeTab === 'alltime'
                  ? 'bg-white dark:bg-stone-700 text-stone-900 dark:text-white shadow-sm'
                  : 'text-stone-600 dark:text-stone-300 hover:text-stone-900'
              }`}
            >
              All-Time Legends
            </button>
          </div>

          {/* Region and Search Inputs */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Region dropdown */}
            <select
              value={selectedRegion}
              onChange={(e) => setSelectedRegion(e.target.value)}
              className="px-3 py-1.5 text-xs font-medium rounded-xl bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-stone-800 dark:text-stone-200 focus:outline-none"
            >
              <option value="All">All Regions</option>
              <option value="Asia-Pacific">Asia-Pacific</option>
              <option value="Europe">Europe</option>
              <option value="North America">North America</option>
              <option value="Latin America">Latin America</option>
            </select>

            {/* Search Input */}
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search connoisseur, city, shop..."
                className="pl-8 pr-3 py-1.5 text-xs bg-stone-100 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl focus:outline-none focus:ring-1 focus:ring-amber-500 w-48 sm:w-60"
              />
            </div>
          </div>
        </div>

        {/* Leaderboard Rows */}
        <div className="divide-y divide-stone-100 dark:divide-stone-800">
          {filteredList.map((connoisseur) => {
            const isUser = connoisseur.id === 'current_user';
            const isPodium = connoisseur.rankToday <= 3;

            return (
              <div
                key={connoisseur.id}
                onClick={() => setSelectedConnoisseur(connoisseur)}
                className={`p-4 sm:px-6 sm:py-4.5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-colors cursor-pointer ${
                  isUser
                    ? 'bg-amber-50/80 dark:bg-amber-950/20 border-l-4 border-l-amber-500'
                    : 'hover:bg-stone-50 dark:hover:bg-stone-850'
                }`}
              >
                {/* Left zone: Rank & User Profile */}
                <div className="flex items-center gap-4">
                  {/* Rank Badge */}
                  <div className="w-8 flex justify-center text-center font-mono font-black text-sm shrink-0">
                    {connoisseur.rankToday === 1 ? (
                      <span className="text-amber-500 text-base">🥇 1</span>
                    ) : connoisseur.rankToday === 2 ? (
                      <span className="text-stone-400 text-base">🥈 2</span>
                    ) : connoisseur.rankToday === 3 ? (
                      <span className="text-amber-700 text-base">🥉 3</span>
                    ) : (
                      <span className="text-stone-400 dark:text-stone-500">
                        #{connoisseur.rankToday}
                      </span>
                    )}
                  </div>

                  {/* Avatar or Icon */}
                  <div className="relative">
                    {connoisseur.avatarUrl ? (
                      <img
                        src={connoisseur.avatarUrl}
                        alt={connoisseur.name}
                        referrerPolicy="no-referrer"
                        className="w-10 h-10 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                      />
                    ) : (
                      <div className="w-10 h-10 rounded-full bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-xs">
                        YOU
                      </div>
                    )}
                    <span className="absolute -bottom-1 -right-1 text-xs">
                      {connoisseur.countryCode === 'JP'
                        ? '🇯🇵'
                        : connoisseur.countryCode === 'NO'
                        ? '🇳🇴'
                        : connoisseur.countryCode === 'AU'
                        ? '🇦🇺'
                        : connoisseur.countryCode === 'IT'
                        ? '🇮🇹'
                        : connoisseur.countryCode === 'CO'
                        ? '🇨🇴'
                        : connoisseur.countryCode === 'US'
                        ? '🇺🇸'
                        : connoisseur.countryCode === 'KR'
                        ? '🇰🇷'
                        : connoisseur.countryCode === 'FR'
                        ? '🇫🇷'
                        : connoisseur.countryCode === 'SE'
                        ? '🇸🇪'
                        : '☕'}
                    </span>
                  </div>

                  {/* Name, Handle, City & Badge */}
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-stone-900 dark:text-white">
                        {connoisseur.name}
                      </span>
                      {isUser && (
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-200 text-amber-900">
                          YOU
                        </span>
                      )}
                      <span className="text-xs text-stone-400 font-mono hidden sm:inline">
                        {connoisseur.username}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400 mt-0.5">
                      <span>{connoisseur.city}, {connoisseur.country}</span>
                      <span aria-hidden="true">·</span>
                      <span className="text-amber-700 dark:text-amber-400 font-medium">
                        {connoisseur.titleBadge}
                      </span>
                      {connoisseur.recentDrink && (
                        <>
                          <span aria-hidden="true" className="hidden md:inline">·</span>
                          <span className="hidden md:inline text-stone-400 truncate max-w-xs">
                            Latest: {connoisseur.recentDrink.name} ({connoisseur.recentDrink.timeAgo})
                          </span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right zone: Points, Cups & Action */}
                <div className="flex items-center justify-between sm:justify-end gap-6 pl-12 sm:pl-0">
                  <div className="text-right">
                    <div className="flex items-baseline gap-1 sm:justify-end">
                      <span className="font-mono text-xl font-black text-stone-900 dark:text-white tabular-nums">
                        {activeTab === 'today' ? connoisseur.todayPoints : connoisseur.allTimePoints.toLocaleString()}
                      </span>
                      <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                        pts
                      </span>
                    </div>
                    <div className="text-[11px] text-stone-400">
                      {activeTab === 'today'
                        ? `${connoisseur.todayCups} cups today · Avg ${connoisseur.avgDrinkScore} pts`
                        : `${connoisseur.allTimeCups} total cups lifetime`}
                    </div>
                  </div>

                  <ChevronRight className="w-4 h-4 text-stone-400 shrink-0" />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Modal Profile for Connoisseur */}
      {selectedConnoisseur && (
        <div
          className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in"
          onClick={() => setSelectedConnoisseur(null)}
        >
          <div
            className="bg-white dark:bg-stone-900 max-w-lg w-full rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl relative space-y-5"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {selectedConnoisseur.avatarUrl ? (
                  <img
                    src={selectedConnoisseur.avatarUrl}
                    alt={selectedConnoisseur.name}
                    className="w-14 h-14 rounded-2xl object-cover border border-stone-200 dark:border-stone-700"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-2xl bg-amber-500 text-stone-950 font-bold flex items-center justify-center text-sm">
                    YOU
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                    {selectedConnoisseur.name}
                  </h3>
                  <div className="text-xs text-stone-500 font-mono">
                    {selectedConnoisseur.username} · {selectedConnoisseur.city}, {selectedConnoisseur.country}
                  </div>
                  <div className="text-xs font-semibold text-amber-600 dark:text-amber-400 mt-1">
                    {selectedConnoisseur.titleBadge}
                  </div>
                </div>
              </div>

              <button
                onClick={() => setSelectedConnoisseur(null)}
                className="text-stone-400 hover:text-stone-600 dark:hover:text-stone-200 p-1"
              >
                ✕
              </button>
            </div>

            {/* Profile Statistics Grid */}
            <div className="grid grid-cols-3 gap-3 bg-stone-50 dark:bg-stone-850 p-4 rounded-2xl border border-stone-100 dark:border-stone-800 text-center">
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-medium">Rank Today</div>
                <div className="font-mono text-xl font-bold text-stone-900 dark:text-white mt-0.5">
                  #{selectedConnoisseur.rankToday}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-medium">Points Today</div>
                <div className="font-mono text-xl font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                  {selectedConnoisseur.todayPoints}
                </div>
              </div>
              <div>
                <div className="text-[10px] text-stone-400 uppercase font-medium">Avg Cup Score</div>
                <div className="font-mono text-xl font-bold text-stone-900 dark:text-white mt-0.5">
                  {selectedConnoisseur.avgDrinkScore}
                </div>
              </div>
            </div>

            {/* Favorite Shop & Signature Order */}
            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-400">Home Roastery / Cafe:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200">
                  {selectedConnoisseur.favoriteShop}
                </span>
              </div>
              <div className="flex justify-between py-2 border-b border-stone-100 dark:border-stone-800">
                <span className="text-stone-400">Signature Method:</span>
                <span className="font-bold text-stone-800 dark:text-stone-200 capitalize">
                  {selectedConnoisseur.favoriteType.replace('_', ' ')}
                </span>
              </div>
              {selectedConnoisseur.recentDrink && (
                <div className="py-2">
                  <div className="text-stone-400 mb-1.5">Latest Verified Cup:</div>
                  <div className="p-3 bg-stone-100 dark:bg-stone-800 rounded-xl flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 dark:text-white">
                        {selectedConnoisseur.recentDrink.name}
                      </div>
                      <div className="text-[11px] text-stone-500">
                        {selectedConnoisseur.recentDrink.shop} · {selectedConnoisseur.recentDrink.timeAgo}
                      </div>
                    </div>
                    <div className="text-right font-mono font-bold text-amber-600 dark:text-amber-400 text-sm">
                      +{selectedConnoisseur.recentDrink.points} pts
                    </div>
                  </div>
                </div>
              )}
            </div>

            <button
              onClick={() => setSelectedConnoisseur(null)}
              className="w-full py-2.5 bg-stone-900 dark:bg-amber-500 dark:text-stone-950 text-white rounded-xl text-xs font-bold transition-colors"
            >
              Close Profile
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

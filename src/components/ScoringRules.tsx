import React, { useState } from 'react';
import {
  Award,
  Coffee,
  Sliders,
  Sparkles,
  MapPin,
  CheckCircle2,
  HelpCircle,
  Calculator,
} from 'lucide-react';
import { COFFEE_TYPES, CUP_SIZES, calculateCoffeePoints, getScoreTier } from '../utils/scoring';
import { CoffeeTypeKey, CupSizeKey } from '../types/coffee';

export const ScoringRules: React.FC = () => {
  // Interactive sandbox state
  const [testType, setTestType] = useState<CoffeeTypeKey>('pourover');
  const [testSize, setTestSize] = useState<CupSizeKey>('double');
  const [testLocation, setTestLocation] = useState<number>(9.5);
  const [testBarista, setTestBarista] = useState<number>(9.8);
  const [testShop, setTestShop] = useState<number>(9.2);
  const [testSingleOrigin, setTestSingleOrigin] = useState<boolean>(true);

  const sandboxPoints = calculateCoffeePoints({
    coffeeType: testType,
    size: testSize,
    locationRating: testLocation,
    baristaLookRating: testBarista,
    shopLookRating: testShop,
    isSingleOrigin: testSingleOrigin,
  });

  const sandboxTier = getScoreTier(sandboxPoints.totalPoints);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Transparent Scoring Rubric</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 dark:text-white">
          The Crema & Craft Global Point System
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          The worldwide coffee scoring algorithm evaluates coffee craft objectively. Points are awarded across five verified dimensions: extraction method, cup size ratio, location roastery caliber, barista presentation & latte art, and shop atmosphere.
        </p>
      </div>

      {/* Interactive Sandbox Calculator */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              Interactive Point Sandbox
            </h2>
            <div className="text-xs text-stone-400">
              Simulate any coffee order to forecast its global point yield
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-stone-400">Calculated Yield</div>
              <div className="font-mono text-3xl font-black text-amber-400 tabular-nums">
                {sandboxPoints.totalPoints} <span className="text-sm font-normal text-amber-200">pts</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
              {sandboxTier.label}
            </div>
          </div>
        </div>

        {/* Sandbox Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          {/* Coffee Type */}
          <div>
            <label className="block text-stone-300 font-bold mb-2">1. Select Coffee Type</label>
            <select
              value={testType}
              onChange={(e) => setTestType(e.target.value as CoffeeTypeKey)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {COFFEE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name} (+{t.basePoints} pts)
                </option>
              ))}
            </select>
          </div>

          {/* Size */}
          <div>
            <label className="block text-stone-300 font-bold mb-2">2. Cup Size & Concentration</label>
            <select
              value={testSize}
              onChange={(e) => setTestSize(e.target.value as CupSizeKey)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 focus:outline-none focus:ring-1 focus:ring-amber-500 font-medium"
            >
              {CUP_SIZES.map((s) => (
                <option key={s.key} value={s.key}>
                  {s.name} ({s.multiplier}x ratio)
                </option>
              ))}
            </select>
          </div>

          {/* Single origin */}
          <div className="flex items-center justify-between sm:col-span-2 lg:col-span-1 p-3 bg-stone-800/60 rounded-xl border border-stone-700/60">
            <div>
              <div className="font-bold text-stone-200">Single Origin Microlot</div>
              <div className="text-[10px] text-stone-400">+5 bonus points</div>
            </div>
            <input
              type="checkbox"
              checked={testSingleOrigin}
              onChange={(e) => setTestSingleOrigin(e.target.checked)}
              className="w-5 h-5 accent-amber-500 cursor-pointer"
            />
          </div>

          {/* Barista Look Slider */}
          <div>
            <div className="flex justify-between font-bold text-stone-300 mb-1">
              <span>3. Barista Look & Craft</span>
              <span className="font-mono text-amber-400">{testBarista.toFixed(1)}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={testBarista}
              onChange={(e) => setTestBarista(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="text-[10px] text-stone-400 mt-1 font-mono">
              Awards +{sandboxPoints.baristaCraftPoints} pts (max 30 pts)
            </div>
          </div>

          {/* Shop Look Slider */}
          <div>
            <div className="flex justify-between font-bold text-stone-300 mb-1">
              <span>4. Shop Look & Aesthetic</span>
              <span className="font-mono text-amber-400">{testShop.toFixed(1)}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={testShop}
              onChange={(e) => setTestShop(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="text-[10px] text-stone-400 mt-1 font-mono">
              Awards +{sandboxPoints.shopLookPoints} pts (max 20 pts)
            </div>
          </div>

          {/* Location Rating Slider */}
          <div>
            <div className="flex justify-between font-bold text-stone-300 mb-1">
              <span>5. Location & Roastery</span>
              <span className="font-mono text-amber-400">{testLocation.toFixed(1)}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={testLocation}
              onChange={(e) => setTestLocation(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
            <div className="text-[10px] text-stone-400 mt-1 font-mono">
              Awards +{sandboxPoints.locationPoints} pts (max 25 pts)
            </div>
          </div>
        </div>
      </div>

      {/* Reference Tables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Table 1: Coffee Types */}
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-4">
            <Coffee className="w-4 h-4 text-amber-500" />
            Coffee Type Base Points
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {COFFEE_TYPES.map((t) => (
              <div key={t.key} className="py-2.5 flex items-center justify-between">
                <div>
                  <div className="font-semibold text-stone-900 dark:text-stone-100">{t.name}</div>
                  <div className="text-[11px] text-stone-400">{t.description}</div>
                </div>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400 shrink-0 ml-3">
                  +{t.basePoints} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Table 2: Size & Ratings rubric */}
        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <Award className="w-4 h-4 text-amber-500" />
              Size & Concentration Multiplier
            </h3>
            <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
              {CUP_SIZES.map((s) => (
                <div key={s.key} className="py-2.5 flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-stone-900 dark:text-stone-100">{s.name}</div>
                    <div className="text-[11px] text-stone-400">{s.volume}</div>
                  </div>
                  <div className="font-mono font-bold text-stone-800 dark:text-stone-200 shrink-0 ml-3">
                    {s.multiplier}x
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4 text-amber-500" />
              Barista Photo & Date-Time Stamp Rules
            </h3>
            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>All uploaded barista and drink photos are stamped with exact local ISO timestamp, shop name, and calculated score.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Stamped photos are burned directly into canvas, allowing export and proof verification in the global database.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Daily rankings reset at midnight UTC; all-time leaderboard maintains cumulative cup career totals.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

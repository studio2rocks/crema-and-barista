import React, { useState } from 'react';
import {
  Car,
  Coffee,
  Wrench,
  Award,
  Sparkles,
  Calculator,
  CheckCircle2,
  MapPin,
} from 'lucide-react';
import {
  CAR_CATEGORIES,
  COFFEE_TYPES,
  calculateCarsAndCoffeePoints,
  getCarsAndCoffeeTier,
} from '../utils/scoring';
import { CarCategoryKey, CoffeeTypeKey } from '../types/coffee';

export const ScoringRules: React.FC = () => {
  const [testCategory, setTestCategory] = useState<CarCategoryKey>('Air-Cooled Classic');
  const [testYear, setTestYear] = useState<number>(1987);
  const [testCarLook, setTestCarLook] = useState<number>(9.8);
  const [testMods, setTestMods] = useState<string>(
    'BBS LM wheels, KW V3 coilovers, Titanium exhaust, Stage 2 tune'
  );
  const [testCups, setTestCups] = useState<number>(2);
  const [testCoffeeType, setTestCoffeeType] = useState<CoffeeTypeKey>('flat_white');
  const [testBarista, setTestBarista] = useState<number>(9.6);
  const [testLocation, setTestLocation] = useState<number>(9.5);
  const [testShop, setTestShop] = useState<number>(9.4);
  const [testSingleOrigin, setTestSingleOrigin] = useState<boolean>(true);

  const sandboxPoints = calculateCarsAndCoffeePoints({
    carCategory: testCategory,
    carYear: testYear,
    carLookRating: testCarLook,
    mods: testMods,
    coffeeCupsCount: testCups,
    primaryCoffeeType: testCoffeeType,
    baristaLookRating: testBarista,
    locationRating: testLocation,
    shopLookRating: testShop,
    isSingleOrigin: testSingleOrigin,
  });

  const sandboxTier = getCarsAndCoffeeTier(sandboxPoints.totalPoints);

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-3">
          <Calculator className="w-3.5 h-3.5" />
          <span>Cars & Coffee Point Rubric</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 dark:text-white">
          The Official Cars & Coffee Point System
        </h1>
        <p className="mt-2 text-stone-600 dark:text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
          Points are awarded for vehicle engineering, modification caliber, stance presentation, number of coffee cups consumed, extraction craft, barista latte art, and paddock atmosphere.
        </p>
      </div>

      {/* Sandbox */}
      <div className="bg-stone-900 text-white p-6 sm:p-8 rounded-3xl border border-stone-800 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6 pb-6 border-b border-stone-800">
          <div>
            <h2 className="text-lg font-bold flex items-center gap-2 text-amber-400">
              <Sparkles className="w-5 h-5" />
              Interactive Cars & Coffee Sandbox
            </h2>
            <div className="text-xs text-stone-400">
              Forecast your morning meet score before driving out
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="text-right">
              <div className="text-[10px] uppercase font-bold text-stone-400">Yield</div>
              <div className="font-mono text-3xl font-black text-amber-400 tabular-nums">
                {sandboxPoints.totalPoints} <span className="text-sm font-normal text-amber-200">pts</span>
              </div>
            </div>
            <div className="px-3 py-1.5 rounded-xl bg-amber-400/10 border border-amber-400/30 text-amber-300 text-xs font-bold">
              {sandboxTier.label}
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-xs">
          <div>
            <label className="block text-stone-300 font-bold mb-2">1. Car Category</label>
            <select
              value={testCategory}
              onChange={(e) => setTestCategory(e.target.value as CarCategoryKey)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-semibold"
            >
              {CAR_CATEGORIES.map((c) => (
                <option key={c.key} value={c.key}>
                  {c.key} (+{c.basePts} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-stone-300 font-bold mb-2">2. Model Year</label>
            <input
              type="number"
              value={testYear}
              onChange={(e) => setTestYear(parseInt(e.target.value) || 2000)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-semibold"
            />
            <span className="text-[10px] text-stone-400 mt-1 block">
              {testYear <= 1999 ? 'Classic era bonus: +4 pts' : 'Modern GT era'}
            </span>
          </div>

          <div>
            <label className="block text-stone-300 font-bold mb-2">3. Number of Coffee Cups</label>
            <select
              value={testCups}
              onChange={(e) => setTestCups(parseInt(e.target.value) || 1)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-semibold"
            >
              {[1, 2, 3, 4, 5, 6].map((num) => (
                <option key={num} value={num}>
                  {num} {num === 1 ? 'cup' : 'cups'} (+{(num - 1) * 4} cup bonus pts)
                </option>
              ))}
            </select>
          </div>

          <div className="sm:col-span-2 lg:col-span-3">
            <label className="block text-stone-300 font-bold mb-1">
              4. Custom Vehicle Mods (Comma-separated)
            </label>
            <input
              type="text"
              value={testMods}
              onChange={(e) => setTestMods(e.target.value)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-mono text-xs"
              placeholder="e.g. BBS LM wheels, KW coilovers, titanium exhaust, tune"
            />
            <span className="text-[10px] text-amber-400 mt-1 block">
              Awards +{sandboxPoints.modsBonusPoints} pts mods bonus
            </span>
          </div>

          <div>
            <label className="block text-stone-300 font-bold mb-2">5. Primary Coffee Type</label>
            <select
              value={testCoffeeType}
              onChange={(e) => setTestCoffeeType(e.target.value as CoffeeTypeKey)}
              className="w-full bg-stone-800 border border-stone-700 rounded-xl p-2.5 text-stone-100 font-semibold"
            >
              {COFFEE_TYPES.map((t) => (
                <option key={t.key} value={t.key}>
                  {t.name} (+{t.basePoints} pts)
                </option>
              ))}
            </select>
          </div>

          <div>
            <div className="flex justify-between font-bold text-stone-300 mb-1">
              <span>Car Look & Stance</span>
              <span className="font-mono text-amber-400">{testCarLook.toFixed(1)}/10</span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              step="0.1"
              value={testCarLook}
              onChange={(e) => setTestCarLook(parseFloat(e.target.value))}
              className="w-full accent-amber-400 cursor-pointer"
            />
          </div>

          <div>
            <div className="flex justify-between font-bold text-stone-300 mb-1">
              <span>Barista Latte Art Craft</span>
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
          </div>
        </div>
      </div>

      {/* Rubric Reference Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
          <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
            <Car className="w-4 h-4 text-amber-500" />
            Car Category Standards
          </h3>
          <div className="divide-y divide-stone-100 dark:divide-stone-800 text-xs">
            {CAR_CATEGORIES.map((c) => (
              <div key={c.key} className="py-2.5 flex justify-between items-center">
                <div>
                  <div className="font-bold text-stone-900 dark:text-white">{c.key}</div>
                  <div className="text-[11px] text-stone-400">{c.description}</div>
                </div>
                <div className="font-mono font-bold text-amber-600 shrink-0 ml-3">
                  +{c.basePts} pts
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 p-6 shadow-sm">
            <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2 mb-3">
              <Wrench className="w-4 h-4 text-amber-500" />
              Modification & Stamping Rules
            </h3>
            <ul className="text-xs text-stone-600 dark:text-stone-300 space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Custom mods (exhaust, suspension, wheels, tune) award up to +15 pts bonus.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Dual photo stamping burns vehicle build specs, mods list, cups tally, and date-time into canvas.</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-500 shrink-0 mt-0.5" />
                <span>Multi-cup coffee consumption awards +4 bonus points per additional cup at the meet.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

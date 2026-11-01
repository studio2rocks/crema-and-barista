import React, { useState } from 'react';
import {
  Calendar,
  Car,
  Coffee,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Edit2,
  Plus,
  Eye,
  CheckCircle2,
  Wrench,
  Award,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CarsAndCoffeeEntry } from '../types/coffee';
import { getCarsAndCoffeeTier } from '../utils/scoring';

interface CarsAndCoffeeDailyProps {
  entries: CarsAndCoffeeEntry[];
  onOpenLogModal: () => void;
  onEditEntry: (entry: CarsAndCoffeeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToLeaderboard: () => void;
  isAdmin?: boolean;
  onNavigateToAdmin?: () => void;
}

export const CarsAndCoffeeDaily: React.FC<CarsAndCoffeeDailyProps> = ({
  entries,
  onOpenLogModal,
  onEditEntry,
  onDeleteEntry,
  onNavigateToLeaderboard,
  isAdmin = false,
  onNavigateToAdmin,
}) => {
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activePhotoPreview, setActivePhotoPreview] = useState<{
    url: string;
    title: string;
    tag: string;
  } | null>(null);

  // Filter entries for selected day
  const dayEntries = entries.filter((e) => e.dateTime.startsWith(selectedDate));

  // Metrics
  const totalDayPoints = dayEntries.reduce((sum, e) => sum + e.points.totalPoints, 0);
  const meetsCount = dayEntries.length;
  const totalCupsConsumed = dayEntries.reduce((sum, e) => sum + e.coffeeCupsCount, 0);
  const avgMeetScore = meetsCount > 0 ? Math.round(totalDayPoints / meetsCount) : 0;

  const estimatedPaddockRank =
    totalDayPoints >= 260
      ? 8
      : totalDayPoints >= 200
      ? 22
      : totalDayPoints >= 130
      ? 64
      : totalDayPoints >= 80
      ? 180
      : 640;

  const worldPercentile =
    totalDayPoints >= 240 ? 'Top 1%' : totalDayPoints >= 130 ? 'Top 5%' : 'Top 18%';

  const shiftDay = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  const handleDownload = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `cars-and-coffee-${name.toLowerCase().replace(/\s+/g, '-')}-${selectedDate}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Admin Mode Active Banner */}
      {isAdmin && (
        <div className="bg-gradient-to-r from-amber-500/15 via-amber-500/10 to-amber-500/5 border border-amber-500/30 rounded-2xl p-3.5 sm:px-5 flex items-center justify-between gap-3 text-xs text-amber-950 dark:text-amber-200">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            <span className="font-bold">Admin Privileges Active:</span>
            <span className="hidden sm:inline text-amber-900/80 dark:text-amber-300/80">
              Full permissions enabled to modify runs, download database backups, and sync to cloud hosts.
            </span>
          </div>
          {onNavigateToAdmin && (
            <button
              onClick={onNavigateToAdmin}
              className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-lg text-[11px] shadow-sm transition-all whitespace-nowrap active:scale-95"
            >
              Open DB & Cloud Hub →
            </button>
          )}
        </div>
      )}

      {/* Date Navigation & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-2xl">
            <button
              onClick={() => shiftDay(-1)}
              className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300 transition-colors"
              title="Previous Day"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="px-2 py-1 bg-transparent text-xs sm:text-sm font-semibold text-stone-900 dark:text-stone-100 focus:outline-none"
            />
            <button
              onClick={() => shiftDay(1)}
              className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-xl text-stone-600 dark:text-stone-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-bold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Jump to Today
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
          <Calendar className="w-4 h-4 text-amber-500" />
          <span>
            {new Date(`${selectedDate}T00:00:00`).toLocaleDateString('en-US', {
              weekday: 'long',
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </span>
          {isToday && (
            <span className="text-amber-900 dark:text-amber-200 bg-amber-100 dark:bg-amber-950/60 px-2.5 py-0.5 rounded-lg text-[10px] font-bold">
              TODAY'S MEET
            </span>
          )}
        </div>
      </div>

      {/* Bento Metric Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Points */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Total Cars & Coffee Points
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
              {totalDayPoints}
            </span>
            <span className="text-xs font-bold text-amber-600 dark:text-amber-400">pts</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Vehicle build + coffee fuel</span>
          </div>
        </div>

        {/* Metric 2: Meets Attended */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Meets / Runs Logged
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
              {meetsCount}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {meetsCount === 1 ? 'meet' : 'meets'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            {meetsCount === 0
              ? 'No meets recorded yet today'
              : meetsCount === 1
              ? 'Morning dawn patrol completed'
              : 'Multi-paddock marathon'}
          </div>
        </div>

        {/* Metric 3: Total Cups of Coffee */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-xs font-semibold text-stone-500 dark:text-stone-400">
            Total Coffee Fuel
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {totalCupsConsumed}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {totalCupsConsumed === 1 ? 'cup' : 'cups'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-400">
            Avg meet score: <span className="font-mono font-bold text-stone-700 dark:text-stone-200">{avgMeetScore} pts</span>
          </div>
        </div>

        {/* Metric 4: Worldwide Paddock Standing */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 bg-white p-5 rounded-3xl border border-amber-300/60 dark:border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Paddock Leaderboard
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                {worldPercentile}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
                #{estimatedPaddockRank}
              </span>
              <span className="text-xs text-stone-500">Worldwide</span>
            </div>
          </div>
          <button
            onClick={onNavigateToLeaderboard}
            className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Compare Global Paddock →
          </button>
        </div>
      </div>

      {/* Main Meet Run List */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white flex items-center gap-2">
              Cars & Coffee Runs ({meetsCount})
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Vehicle Specs</span>
              <span aria-hidden="true">·</span>
              <span>Mods Log</span>
              <span aria-hidden="true">·</span>
              <span>Coffee Cups & Types</span>
              <span aria-hidden="true">·</span>
              <span>Stamped Proof</span>
            </div>
          </div>

          <button
            onClick={onOpenLogModal}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Log Cars & Coffee</span>
          </button>
        </div>

        {dayEntries.length === 0 ? (
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Car className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                No Cars & Coffee run recorded for this date
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Log your car (year, make, model, mods), upload car and barista photos with date-time stamps, and track your coffee cups to compete worldwide!
              </p>
            </div>
            <button
              onClick={onOpenLogModal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log Cars & Coffee Now
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6">
            {dayEntries.map((entry, index) => {
              const tier = getCarsAndCoffeeTier(entry.points.totalPoints);
              const timeDisplay = new Date(entry.dateTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  {/* Top Bar on Card: Vehicle Title & Score */}
                  <div className="p-5 sm:px-6 border-b border-stone-100 dark:border-stone-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-stone-50/60 dark:bg-stone-850/60">
                    <div>
                      <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                        <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          RUN #{index + 1}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" /> {timeDisplay}
                        </span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.meetName}</span>
                        <span aria-hidden="true">·</span>
                        <span>{entry.city}, {entry.country}</span>
                      </div>
                      <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1 flex items-center gap-2">
                        <span>{entry.carYear} {entry.carMake} {entry.carModel}</span>
                        <span className="text-xs px-2.5 py-0.5 rounded-lg bg-stone-200 dark:bg-stone-700 text-stone-700 dark:text-stone-300 font-semibold">
                          {entry.carCategory}
                        </span>
                      </h3>
                    </div>

                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <div className="text-[10px] uppercase font-bold text-stone-400">
                          {tier.label}
                        </div>
                        <div className="font-mono text-2xl font-black text-amber-600 dark:text-amber-400 tabular-nums">
                          {entry.points.totalPoints} <span className="text-xs font-normal">pts</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Dual Photos Grid: Car Photo & Barista Photo */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-0 border-b border-stone-200 dark:border-stone-800 bg-stone-950">
                    {/* 1. Stamped Car Build Photo */}
                    <div className="relative aspect-16/10 group overflow-hidden border-r border-stone-800/80">
                      <img
                        src={entry.stampedCarPhotoUrl || entry.carPhotoUrl}
                        alt={`${entry.carYear} ${entry.carMake} ${entry.carModel}`}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <Car className="w-3.5 h-3.5 text-amber-400" />
                        <span>CAR BUILD & STANCE ({entry.carLookRating.toFixed(1)}/10)</span>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setActivePhotoPreview({
                              url: entry.stampedCarPhotoUrl || entry.carPhotoUrl,
                              title: `${entry.carYear} ${entry.carMake} ${entry.carModel}`,
                              tag: 'CAR SPEC SHEET WATERMARK',
                            })
                          }
                          className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                          title="Expand Car Photo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(
                              entry.stampedCarPhotoUrl || entry.carPhotoUrl,
                              `${entry.carMake}-${entry.carModel}-car`
                            )
                          }
                          className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                          title="Download Stamped Car Photo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* 2. Stamped Barista Photo */}
                    <div className="relative aspect-16/10 group overflow-hidden">
                      <img
                        src={entry.stampedBaristaPhotoUrl || entry.baristaPhotoUrl}
                        alt="Barista & Latte Art"
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <Coffee className="w-3.5 h-3.5 text-amber-400" />
                        <span>BARISTA CRAFT ({entry.baristaLookRating.toFixed(1)}/10)</span>
                      </div>

                      <div className="absolute bottom-3 right-3 flex items-center gap-2">
                        <button
                          onClick={() =>
                            setActivePhotoPreview({
                              url: entry.stampedBaristaPhotoUrl || entry.baristaPhotoUrl,
                              title: `Barista ${entry.baristaName || 'Craft'} · ${entry.shopName}`,
                              tag: 'BARISTA LATTE ART WATERMARK',
                            })
                          }
                          className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                          title="Expand Barista Photo"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() =>
                            handleDownload(
                              entry.stampedBaristaPhotoUrl || entry.baristaPhotoUrl,
                              `${entry.shopName}-barista`
                            )
                          }
                          className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                          title="Download Stamped Barista Photo"
                        >
                          <Download className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-6 space-y-4">
                    {/* Mods Row */}
                    <div className="p-3.5 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-200 dark:border-stone-750">
                      <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 mb-1.5">
                        <Wrench className="w-3.5 h-3.5 text-amber-500" />
                        <span>Vehicle Modifications:</span>
                        <span className="font-mono text-amber-600 dark:text-amber-400 text-[11px]">
                          +{entry.points.modsBonusPoints} pts
                        </span>
                      </div>
                      <p className="text-xs text-stone-700 dark:text-stone-300 font-mono leading-relaxed">
                        {entry.mods || 'No aftermarket mods specified (Factory stock / Concours original).'}
                      </p>
                    </div>

                    {/* Coffee & Barista Row */}
                    <div className="p-3.5 bg-amber-50/60 dark:bg-amber-950/20 rounded-2xl border border-amber-200/60 dark:border-amber-900/40 flex flex-wrap items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-9 h-9 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center font-bold">
                          <Coffee className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="font-bold text-stone-900 dark:text-white flex items-center gap-2">
                            <span>{entry.coffeeCupsCount} {entry.coffeeCupsCount === 1 ? 'Cup' : 'Cups'} Consumed</span>
                            <span>·</span>
                            <span className="capitalize">{entry.primaryCoffeeType.replace('_', ' ')}</span>
                            {entry.isSingleOrigin && (
                              <span className="px-2 py-0.5 rounded bg-amber-200 dark:bg-amber-800 text-amber-900 dark:text-amber-100 text-[10px] font-semibold">
                                Single Origin
                              </span>
                            )}
                          </div>
                          <div className="text-[11px] text-stone-500 dark:text-stone-400">
                            Poured at {entry.shopName} {entry.baristaName ? `by Barista ${entry.baristaName}` : ''}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        {entry.coffeeTypes.map((t) => (
                          <span
                            key={t}
                            className="px-2 py-1 rounded-lg bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-[10px] font-semibold text-stone-700 dark:text-stone-300 capitalize"
                          >
                            {t.replace('_', ' ')}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Driver notes */}
                    {entry.notes && (
                      <p className="text-xs text-stone-600 dark:text-stone-300 italic">
                        "{entry.notes}"
                      </p>
                    )}

                    {/* Points Breakdown Bento */}
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs pt-2">
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <div className="text-[10px] text-stone-400">Car Build</div>
                        <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {entry.points.carBuildPoints} pts
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <div className="text-[10px] text-stone-400">Mods Bonus</div>
                        <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          +{entry.points.modsBonusPoints} pts
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <div className="text-[10px] text-stone-400">Coffee Fuel</div>
                        <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {entry.points.coffeeCraftPoints} pts
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                        <div className="text-[10px] text-stone-400">Barista Look</div>
                        <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                          {entry.points.baristaLookPoints} pts
                        </div>
                      </div>
                      <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800 col-span-2 sm:col-span-1">
                        <div className="text-[10px] text-stone-400">Paddock Venue</div>
                        <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                          {entry.points.meetAndShopPoints} pts
                        </div>
                      </div>
                    </div>

                    {/* Footer Actions */}
                    <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => onEditEntry(entry)}
                          className="px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                        >
                          <Edit2 className="w-3.5 h-3.5" /> Edit Run
                        </button>
                        <button
                          onClick={() => onDeleteEntry(entry.id)}
                          className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                        >
                          <Trash2 className="w-3.5 h-3.5" /> Delete
                        </button>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleDownload(
                              entry.stampedCarPhotoUrl || entry.carPhotoUrl,
                              `${entry.carMake}-${entry.carModel}-stamped`
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" /> Save Stamped Car
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      {activePhotoPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhotoPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[92vh] bg-stone-950 rounded-3xl overflow-hidden shadow-2xl border border-stone-800">
            <img
              src={activePhotoPreview.url}
              alt={activePhotoPreview.title}
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-4 bg-stone-900 flex items-center justify-between text-xs text-stone-300 border-t border-stone-800">
              <div>
                <span className="font-mono text-amber-400 font-bold">
                  {activePhotoPreview.tag}
                </span>
                <span className="text-stone-400 ml-2">· {activePhotoPreview.title}</span>
              </div>
              <button
                onClick={() => setActivePhotoPreview(null)}
                className="px-3 py-1 bg-stone-800 hover:bg-stone-700 text-white rounded-lg"
              >
                Close Preview
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

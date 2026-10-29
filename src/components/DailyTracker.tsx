import React, { useState } from 'react';
import {
  Calendar,
  Coffee,
  Award,
  MapPin,
  Clock,
  Sparkles,
  Download,
  Share2,
  Trash2,
  Edit2,
  Plus,
  Eye,
  CheckCircle2,
  Sliders,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { CoffeeEntry } from '../types/coffee';
import { getScoreTier } from '../utils/scoring';

interface DailyTrackerProps {
  entries: CoffeeEntry[];
  onOpenLogModal: () => void;
  onEditEntry: (entry: CoffeeEntry) => void;
  onDeleteEntry: (id: string) => void;
  onNavigateToLeaderboard: () => void;
}

export const DailyTracker: React.FC<DailyTrackerProps> = ({
  entries,
  onOpenLogModal,
  onEditEntry,
  onDeleteEntry,
  onNavigateToLeaderboard,
}) => {
  // Selected date in YYYY-MM-DD
  const todayStr = new Date().toISOString().split('T')[0];
  const [selectedDate, setSelectedDate] = useState<string>(todayStr);
  const [activePhotoPreview, setActivePhotoPreview] = useState<string | null>(null);

  // Filter entries for the selected day
  const dayEntries = entries.filter((e) => e.dateTime.startsWith(selectedDate));

  // Compute daily metrics
  const totalDayPoints = dayEntries.reduce((sum, e) => sum + e.points.totalPoints, 0);
  const cupsCount = dayEntries.length;
  const avgCupScore = cupsCount > 0 ? Math.round(totalDayPoints / cupsCount) : 0;

  // Global comparison calculation
  // E.g. If today's points > 250 -> Top 1% (#18), > 180 -> Top 5% (#42), etc.
  const estimatedWorldRank =
    totalDayPoints >= 300
      ? 12
      : totalDayPoints >= 240
      ? 38
      : totalDayPoints >= 180
      ? 84
      : totalDayPoints >= 90
      ? 210
      : 840;

  const worldPercentile =
    totalDayPoints >= 250 ? 'Top 1%' : totalDayPoints >= 180 ? 'Top 4%' : 'Top 15%';

  // Quick day shifter
  const shiftDay = (days: number) => {
    const cur = new Date(selectedDate);
    cur.setDate(cur.getDate() + days);
    setSelectedDate(cur.toISOString().split('T')[0]);
  };

  const isToday = selectedDate === todayStr;

  // Download stamped photo
  const handleDownloadStamped = (url: string, name: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `crema-craft-${name.toLowerCase().replace(/\s+/g, '-')}-${selectedDate}.jpg`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Date Navigation & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white dark:bg-stone-900 p-4 sm:p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
            <button
              onClick={() => shiftDay(-1)}
              className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300 transition-colors"
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
              className="p-1.5 hover:bg-white dark:hover:bg-stone-700 rounded-lg text-stone-600 dark:text-stone-300 transition-colors"
              title="Next Day"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

          {!isToday && (
            <button
              onClick={() => setSelectedDate(todayStr)}
              className="text-xs font-semibold text-amber-600 dark:text-amber-400 hover:underline"
            >
              Jump to Today
            </button>
          )}
        </div>

        {/* Date headline */}
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
            <span className="text-amber-800 dark:text-amber-300 bg-amber-100/70 dark:bg-amber-950/60 px-2 py-0.5 rounded text-[11px] font-bold">
              TODAY
            </span>
          )}
        </div>
      </div>

      {/* Daily Metrics Bento Strip */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Metric 1: Total Points */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm relative overflow-hidden">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Daily Coffee Points
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
              {totalDayPoints}
            </span>
            <span className="text-xs font-semibold text-amber-600 dark:text-amber-400">pts</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400 flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>Sum of extraction & aesthetic ratings</span>
          </div>
        </div>

        {/* Metric 2: Cups Consumed */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Cups Logged Today
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
              {cupsCount}
            </span>
            <span className="text-xs font-semibold text-stone-500">
              {cupsCount === 1 ? 'cup' : 'cups'}
            </span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            {cupsCount === 0
              ? 'No coffee recorded yet today'
              : cupsCount === 1
              ? 'Morning cup in the books'
              : cupsCount === 2
              ? 'Balanced daily coffee regimen'
              : 'Connoisseur caffeine marathon'}
          </div>
        </div>

        {/* Metric 3: Avg Cup Score */}
        <div className="bg-white dark:bg-stone-900 p-5 rounded-2xl border border-stone-200 dark:border-stone-800 shadow-sm">
          <div className="text-xs font-medium text-stone-500 dark:text-stone-400">
            Average Cup Quality
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold font-mono text-amber-600 dark:text-amber-400 tabular-nums">
              {avgCupScore}
            </span>
            <span className="text-xs font-semibold text-stone-500">/ 100+</span>
          </div>
          <div className="mt-2 text-[11px] text-stone-500 dark:text-stone-400">
            {avgCupScore >= 95
              ? 'Grand Connoisseur Level'
              : avgCupScore >= 85
              ? 'Gold Standard Specialty'
              : avgCupScore >= 70
              ? 'Third-Wave Quality'
              : 'Log cups to see average'}
          </div>
        </div>

        {/* Metric 4: Worldwide Standing */}
        <div className="bg-gradient-to-br from-amber-500/10 via-amber-500/5 to-transparent dark:from-amber-950/30 dark:via-stone-900 dark:to-stone-900 bg-white p-5 rounded-2xl border border-amber-300/60 dark:border-amber-900/40 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-amber-950 dark:text-amber-200">
                World Rank Today
              </span>
              <span className="text-[11px] font-mono font-bold text-amber-700 dark:text-amber-400">
                {worldPercentile}
              </span>
            </div>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-3xl font-extrabold font-mono text-stone-900 dark:text-white tabular-nums">
                #{estimatedWorldRank}
              </span>
              <span className="text-xs text-stone-500">Worldwide</span>
            </div>
          </div>
          <button
            onClick={onNavigateToLeaderboard}
            className="mt-3 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-1"
          >
            Compare Global Leaderboard →
          </button>
        </div>
      </div>

      {/* Main Coffee List for Selected Day */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-stone-900 dark:text-white">
              Coffees Logged ({cupsCount})
            </h2>
            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
              <span>Verified Barista Look</span>
              <span aria-hidden="true">·</span>
              <span>Shop Aesthetic</span>
              <span aria-hidden="true">·</span>
              <span>Timestamp Burn-in</span>
            </div>
          </div>

          <button
            onClick={onOpenLogModal}
            className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white rounded-xl text-xs font-bold flex items-center gap-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add Coffee</span>
          </button>
        </div>

        {dayEntries.length === 0 ? (
          /* Empty State */
          <div className="bg-white dark:bg-stone-900 rounded-3xl border border-dashed border-stone-300 dark:border-stone-800 p-12 text-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400 mx-auto flex items-center justify-center">
              <Coffee className="w-8 h-8" />
            </div>
            <div className="max-w-md mx-auto">
              <h3 className="text-lg font-bold text-stone-900 dark:text-white">
                No coffees recorded for this date
              </h3>
              <p className="text-xs text-stone-500 dark:text-stone-400 mt-1">
                Log your first cup to score its type, size, location, and upload a barista photo with a date-time stamp to compete globally!
              </p>
            </div>
            <button
              onClick={onOpenLogModal}
              className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all inline-flex items-center gap-2"
            >
              <Plus className="w-4 h-4" /> Log Coffee Now
            </button>
          </div>
        ) : (
          /* List of Logged Cups */
          <div className="grid grid-cols-1 gap-6">
            {dayEntries.map((entry, index) => {
              const tier = getScoreTier(entry.points.totalPoints);
              const timeDisplay = new Date(entry.dateTime).toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
              });

              return (
                <div
                  key={entry.id}
                  className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                    {/* Left: Stamped Barista / Drink Photo */}
                    <div className="lg:col-span-5 relative bg-stone-950 group">
                      <div className="relative aspect-4/3 lg:h-full w-full overflow-hidden">
                        <img
                          src={entry.watermarkedPhotoUrl || entry.baristaPhotoUrl}
                          alt={`${entry.coffeeName} by ${entry.shopName}`}
                          referrerPolicy="no-referrer"
                          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />

                        {/* Top Badge: Stamped proof indicator */}
                        <div className="absolute top-3 left-3 bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-semibold flex items-center gap-1.5">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>DATE-TIME VERIFIED</span>
                        </div>

                        {/* Bottom scrim with quick click to expand */}
                        <div className="absolute bottom-3 right-3 flex items-center gap-2">
                          <button
                            onClick={() =>
                              setActivePhotoPreview(
                                entry.watermarkedPhotoUrl || entry.baristaPhotoUrl
                              )
                            }
                            className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                            title="Expand Watermarked Image"
                          >
                            <Eye className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() =>
                              handleDownloadStamped(
                                entry.watermarkedPhotoUrl || entry.baristaPhotoUrl,
                                entry.coffeeName
                              )
                            }
                            className="p-2 bg-stone-950/80 hover:bg-stone-900 text-white rounded-xl backdrop-blur-sm border border-white/20 transition-colors"
                            title="Download Stamped Photo"
                          >
                            <Download className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>

                    {/* Right: Detailed Scoring & Information */}
                    <div className="lg:col-span-7 p-6 flex flex-col justify-between space-y-5">
                      <div>
                        {/* Header Row: Cup Index, Time & Overall Points */}
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                              <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                                CUP #{index + 1}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span className="flex items-center gap-1">
                                <Clock className="w-3.5 h-3.5" />
                                {timeDisplay}
                              </span>
                              <span aria-hidden="true">·</span>
                              <span>{entry.city}, {entry.country}</span>
                            </div>
                            <h3 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
                              {entry.coffeeName}
                            </h3>
                            <div className="text-xs font-semibold text-amber-700 dark:text-amber-400 mt-0.5">
                              {entry.shopName}
                              {entry.baristaName && (
                                <span className="text-stone-400 dark:text-stone-500 font-normal ml-1">
                                  · Barista {entry.baristaName}
                                </span>
                              )}
                            </div>
                          </div>

                          {/* Big Score Stamp */}
                          <div className="text-right shrink-0">
                            <div className="px-3.5 py-1.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400">
                              <div className="text-[10px] uppercase font-bold tracking-wider text-amber-800 dark:text-amber-300">
                                Cup Score
                              </div>
                              <div className="font-mono text-2xl font-black tabular-nums">
                                {entry.points.totalPoints}
                              </div>
                            </div>
                            <div className="mt-1 text-[10px] font-semibold text-stone-500 dark:text-stone-400">
                              {tier.label}
                            </div>
                          </div>
                        </div>

                        {/* Tasting notes if any */}
                        {entry.notes && (
                          <p className="mt-3 text-xs text-stone-600 dark:text-stone-300 italic bg-stone-50 dark:bg-stone-850 p-2.5 rounded-xl border border-stone-100 dark:border-stone-800">
                            "{entry.notes}"
                          </p>
                        )}

                        {/* Detailed Score Factors Bento */}
                        <div className="mt-4 pt-4 border-t border-stone-100 dark:border-stone-800/80">
                          <div className="text-xs font-bold text-stone-700 dark:text-stone-300 mb-2">
                            Score Factor Breakdown:
                          </div>

                          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs">
                            {/* Factor 1: Type */}
                            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                              <div className="text-[10px] text-stone-400">Coffee Type</div>
                              <div className="font-bold text-stone-800 dark:text-stone-200 capitalize">
                                {entry.coffeeType.replace('_', ' ')}
                              </div>
                              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                                +{entry.points.typePoints} pts
                              </div>
                            </div>

                            {/* Factor 2: Size Multiplier */}
                            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                              <div className="text-[10px] text-stone-400">Size Ratio</div>
                              <div className="font-bold text-stone-800 dark:text-stone-200 capitalize">
                                {entry.size}
                              </div>
                              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                                {entry.points.sizeMultiplier}x ratio
                              </div>
                            </div>

                            {/* Factor 3: Barista Look */}
                            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                              <div className="text-[10px] text-stone-400">Barista Craft</div>
                              <div className="font-bold text-stone-800 dark:text-stone-200">
                                {entry.baristaLookRating.toFixed(1)}/10
                              </div>
                              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                                +{entry.points.baristaCraftPoints} pts
                              </div>
                            </div>

                            {/* Factor 4: Shop Look & Location */}
                            <div className="p-2.5 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-100 dark:border-stone-800">
                              <div className="text-[10px] text-stone-400">Shop Look & Vibe</div>
                              <div className="font-bold text-stone-800 dark:text-stone-200">
                                {entry.shopLookRating.toFixed(1)}/10
                              </div>
                              <div className="text-[11px] font-mono text-amber-600 dark:text-amber-400">
                                +{entry.points.shopLookPoints + entry.points.locationPoints} pts
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Card Footer Actions */}
                      <div className="flex items-center justify-between pt-3 border-t border-stone-100 dark:border-stone-800">
                        <div className="flex items-center gap-2">
                          <button
                            onClick={() => onEditEntry(entry)}
                            className="px-3 py-1.5 text-xs font-semibold text-stone-600 dark:text-stone-300 hover:text-stone-900 dark:hover:text-white rounded-lg hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors flex items-center gap-1.5"
                          >
                            <Edit2 className="w-3.5 h-3.5" /> Edit
                          </button>
                          <button
                            onClick={() => onDeleteEntry(entry.id)}
                            className="px-3 py-1.5 text-xs font-semibold text-red-600 hover:text-red-700 rounded-lg hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors flex items-center gap-1.5"
                          >
                            <Trash2 className="w-3.5 h-3.5" /> Delete
                          </button>
                        </div>

                        <button
                          onClick={() =>
                            handleDownloadStamped(
                              entry.watermarkedPhotoUrl || entry.baristaPhotoUrl,
                              entry.coffeeName
                            )
                          }
                          className="px-3.5 py-1.5 text-xs font-semibold text-stone-800 dark:text-stone-200 hover:bg-stone-100 dark:hover:bg-stone-800 rounded-xl border border-stone-200 dark:border-stone-700 transition-colors flex items-center gap-1.5"
                        >
                          <Download className="w-3.5 h-3.5" />
                          <span>Save Stamped Proof</span>
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

      {/* Modal Lightbox for Watermarked Stamped Photo */}
      {activePhotoPreview && (
        <div
          className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
          onClick={() => setActivePhotoPreview(null)}
        >
          <div className="relative max-w-4xl max-h-[90vh] bg-stone-950 rounded-2xl overflow-hidden shadow-2xl border border-stone-700">
            <img
              src={activePhotoPreview}
              alt="Watermarked Stamped Coffee Photo"
              className="max-h-[80vh] w-auto object-contain mx-auto"
            />
            <div className="p-4 bg-stone-900 flex items-center justify-between text-xs text-stone-300 border-t border-stone-800">
              <span className="font-mono text-amber-400 font-bold">
                CREMA & CRAFT OFFICIAL DATE-TIME STAMP
              </span>
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

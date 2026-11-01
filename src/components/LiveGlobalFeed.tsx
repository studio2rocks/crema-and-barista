import React, { useState, useEffect } from 'react';
import {
  Car,
  Coffee,
  Clock,
  MapPin,
  RefreshCw,
  Flame,
  Wrench,
  CheckCircle2,
} from 'lucide-react';
import { GlobalPaddockActivityItem } from '../types/coffee';
import { INITIAL_PADDOCK_FEED } from '../data/worldwideDatabase';

const SIMULATED_PADDOCK_EVENTS: Omit<GlobalPaddockActivityItem, 'id' | 'timeAgo'>[] = [
  {
    driverName: 'Matteo Bernardi',
    driverAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80',
    city: 'Milan',
    countryCode: 'IT',
    carTitle: '1972 Alfa Romeo GT 2000 Veloce',
    modsExcerpt: 'Weber 40 DCOE carbs, Alfaholics GTA wheels, fast road suspension',
    coffeeSummary: '3 cups · Triple Espresso & Cortado',
    shopName: 'Marchesi 1824',
    meetName: 'Navigli Classic Sunrise Rally',
    points: 128,
    carPhotoUrl: '/src/assets/images/cars_and_coffee_porsche_1793528533763.jpg',
    baristaPhotoUrl: '/src/assets/images/cars_coffee_barista_latte_1793528536261.jpg',
    carLookRating: 9.7,
    baristaRating: 9.6,
  },
  {
    driverName: 'Oliver Thorne',
    driverAvatar: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=150&auto=format&fit=crop&q=80',
    city: 'London',
    countryCode: 'GB',
    carTitle: '1990 BMW M3 Sport Evolution E30',
    modsExcerpt: 'BBS LM 17", S14 2.5L engine, Carbon airbox, H&R roll bars',
    coffeeSummary: '2 cups · Flat White & Gibraltar Cortado',
    shopName: 'Workshop Coffee Marylebone',
    meetName: 'Ace Cafe Sunday Morning Paddock',
    points: 126,
    carPhotoUrl: '/src/assets/images/cars_and_coffee_jdm_1793528536227.jpg',
    baristaPhotoUrl: '/src/assets/images/cortado_gibraltar_glass_1793305259937.jpg',
    carLookRating: 9.8,
    baristaRating: 9.5,
  },
  {
    driverName: 'Liam O’Connor',
    driverAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: 'Melbourne',
    countryCode: 'AU',
    carTitle: '1993 Mazda RX-7 FD3S Series 6',
    modsExcerpt: '13B Twin Rotary, Apex’i PowerFC, Enkei RPF1, Tanabe exhaust',
    coffeeSummary: '3 cups · Double Flat White & Batch Brew',
    shopName: 'Patricia Coffee Brewers',
    meetName: 'Southbank Morning Cruise',
    points: 122,
    carPhotoUrl: '/src/assets/images/cars_and_coffee_jdm_1793528536227.jpg',
    baristaPhotoUrl: '/src/assets/images/specialty_pourover_chemex_1793305260678.jpg',
    carLookRating: 9.6,
    baristaRating: 9.7,
  },
];

export const LiveGlobalFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<GlobalPaddockActivityItem[]>(INITIAL_PADDOCK_FEED);
  const [revCounts, setRevCounts] = useState<Record<string, number>>({});

  useEffect(() => {
    let index = 0;
    const interval = setInterval(() => {
      const template = SIMULATED_PADDOCK_EVENTS[index % SIMULATED_PADDOCK_EVENTS.length];
      index++;

      const newItem: GlobalPaddockActivityItem = {
        ...template,
        id: `paddock_feed_${Date.now()}`,
        timeAgo: 'Just now',
      };

      setFeedItems((prev) => [newItem, ...prev.slice(0, 12)]);
    }, 32000);

    return () => clearInterval(interval);
  }, []);

  const handleRevEngine = (id: string) => {
    setRevCounts((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Global Meets Feed
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            Real-Time Paddock Runs Worldwide
          </h2>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            Enthusiasts logging car builds, mods, and morning coffee runs across Tokyo, Newport Beach, London & Milan
          </div>
        </div>

        <button
          onClick={() => {
            const template =
              SIMULATED_PADDOCK_EVENTS[Math.floor(Math.random() * SIMULATED_PADDOCK_EVENTS.length)];
            const manualItem: GlobalPaddockActivityItem = {
              ...template,
              id: `paddock_feed_${Date.now()}`,
              timeAgo: 'Just now',
            };
            setFeedItems((prev) => [manualItem, ...prev]);
          }}
          className="px-3.5 py-2 text-xs font-bold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
        >
          <RefreshCw className="w-3.5 h-3.5" /> Check Incoming Runs
        </button>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {feedItems.map((item) => {
          const revs = revCounts[item.id] || 0;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Media Header */}
              {item.carPhotoUrl && (
                <div className="relative aspect-16/9 bg-stone-950 overflow-hidden">
                  <img
                    src={item.carPhotoUrl}
                    alt={item.carTitle}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex justify-between items-start">
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-bold flex items-center gap-1.5">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                        <span>DATE-TIME VERIFIED</span>
                      </span>
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-xs font-mono font-black text-amber-400">
                        {item.points} PTS
                      </span>
                    </div>

                    <div>
                      <div className="text-white text-base font-bold truncate">
                        {item.carTitle}
                      </div>
                      <div className="text-stone-300 text-xs truncate">
                        {item.meetName} · {item.city}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feed Content */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.driverAvatar}
                      alt={item.driverName}
                      className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        {item.driverName}
                      </div>
                      <div className="text-[11px] text-stone-400 flex items-center gap-1.5">
                        <MapPin className="w-3 h-3 text-stone-400" />
                        <span>{item.city}</span>
                        <span>·</span>
                        <Clock className="w-3 h-3 text-stone-400" />
                        <span>{item.timeAgo}</span>
                      </div>
                    </div>
                  </div>

                  {!item.carPhotoUrl && (
                    <div className="font-mono text-xl font-black text-amber-600">
                      {item.points} pts
                    </div>
                  )}
                </div>

                {/* Mods & Coffee Badges */}
                <div className="space-y-1.5 text-xs">
                  <div className="flex items-start gap-1.5 text-stone-600 dark:text-stone-300 font-mono text-[11px]">
                    <Wrench className="w-3 h-3 text-amber-500 shrink-0 mt-0.5" />
                    <span className="truncate">{item.modsExcerpt}</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-amber-700 dark:text-amber-400 font-semibold text-[11px]">
                    <Coffee className="w-3 h-3 text-amber-500 shrink-0" />
                    <span>{item.coffeeSummary}</span>
                  </div>
                </div>

                {/* Rev Engine action */}
                <div className="flex items-center justify-between pt-2 border-t border-stone-100 dark:border-stone-800">
                  <span className="text-[11px] text-stone-400">
                    {revs > 0 ? `${revs} paddock revs` : 'Give first rev 🏁'}
                  </span>
                  <button
                    onClick={() => handleRevEngine(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-bold flex items-center gap-1.5 transition-colors active:scale-95"
                  >
                    <Flame className="w-3.5 h-3.5 text-amber-500" />
                    <span>Rev Engine 🏁</span>
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

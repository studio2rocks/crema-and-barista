import React, { useState, useEffect } from 'react';
import {
  Globe,
  Radio,
  Clock,
  Heart,
  Award,
  Sparkles,
  MapPin,
  Coffee,
  CheckCircle2,
  RefreshCw,
} from 'lucide-react';
import { GlobalActivityFeedItem } from '../types/coffee';
import { INITIAL_GLOBAL_FEED } from '../data/worldwideDatabase';

const SIMULATED_STREAM_EVENTS: Omit<GlobalActivityFeedItem, 'id' | 'timeAgo'>[] = [
  {
    userName: 'Kaito Moriyama',
    userAvatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    city: 'Kyoto',
    countryCode: 'JP',
    coffeeName: 'Ethiopia Guji Natural Kalita 155',
    coffeeType: 'pourover',
    shopName: 'Kurasu Kyoto Stand',
    points: 101,
    photoUrl: '/src/assets/images/specialty_pourover_chemex_1793305260678.jpg',
    baristaRating: 9.7,
    shopRating: 9.8,
  },
  {
    userName: 'Freja Knudsen',
    userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    city: 'Copenhagen',
    countryCode: 'DK',
    coffeeName: 'Single Estate Cortado',
    coffeeType: 'cortado',
    shopName: 'The Coffee Collective Jægersborggade',
    points: 97,
    photoUrl: '/src/assets/images/cortado_gibraltar_glass_1793305259937.jpg',
    baristaRating: 9.8,
    shopRating: 9.6,
  },
  {
    userName: 'Giancarlo Bianchi',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    city: 'Rome',
    countryCode: 'IT',
    coffeeName: 'Doppio Ristretto Crema Tiger',
    coffeeType: 'espresso',
    shopName: 'Sant’Eustachio Il Caffè',
    points: 94,
    photoUrl: '/src/assets/images/barista_latte_art_pour_1793305258535.jpg',
    baristaRating: 9.5,
    shopRating: 9.4,
  },
];

export const LiveGlobalFeed: React.FC = () => {
  const [feedItems, setFeedItems] = useState<GlobalActivityFeedItem[]>(INITIAL_GLOBAL_FEED);
  const [toastedIds, setToastedIds] = useState<Record<string, number>>({});
  const [isLiveStreaming, setIsLiveStreaming] = useState<boolean>(true);

  // Periodically add a new live activity event
  useEffect(() => {
    if (!isLiveStreaming) return;

    let simIndex = 0;
    const interval = setInterval(() => {
      const template = SIMULATED_STREAM_EVENTS[simIndex % SIMULATED_STREAM_EVENTS.length];
      simIndex++;

      const newItem: GlobalActivityFeedItem = {
        ...template,
        id: `live_feed_${Date.now()}`,
        timeAgo: 'Just now',
      };

      setFeedItems((prev) => [newItem, ...prev.slice(0, 15)]);
    }, 28000);

    return () => clearInterval(interval);
  }, [isLiveStreaming]);

  const handleToast = (id: string) => {
    setToastedIds((prev) => ({
      ...prev,
      [id]: (prev[id] || 0) + 1,
    }));
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Feed Header */}
      <div className="bg-white dark:bg-stone-900 p-6 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400">
              Live Global Activity Feed
            </span>
          </div>
          <h2 className="text-xl font-bold text-stone-900 dark:text-white mt-1">
            Real-Time Cups Logged Worldwide
          </h2>
          <div className="text-xs text-stone-500 dark:text-stone-400">
            See coffees, barista photos, and scores streaming in from Tokyo, Melbourne, Oslo, Rome & Seattle
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const template = SIMULATED_STREAM_EVENTS[Math.floor(Math.random() * SIMULATED_STREAM_EVENTS.length)];
              const manualItem: GlobalActivityFeedItem = {
                ...template,
                id: `live_feed_${Date.now()}`,
                timeAgo: 'Just now',
              };
              setFeedItems((prev) => [manualItem, ...prev]);
            }}
            className="px-3.5 py-2 text-xs font-semibold rounded-xl bg-stone-100 hover:bg-stone-200 dark:bg-stone-800 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" /> Check Incoming
          </button>
        </div>
      </div>

      {/* Feed Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {feedItems.map((item) => {
          const toasts = toastedIds[item.id] || 0;

          return (
            <div
              key={item.id}
              className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col"
            >
              {/* Image banner with watermark look */}
              {item.photoUrl && (
                <div className="relative aspect-16/9 bg-stone-950 overflow-hidden">
                  <img
                    src={item.photoUrl}
                    alt={item.coffeeName}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-transparent to-transparent flex flex-col justify-between p-3.5">
                    <div className="flex justify-between items-start">
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-bold">
                        TIMESTAMP VERIFIED
                      </span>
                      <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-xs font-mono font-bold text-amber-400">
                        ★ {item.points} PTS
                      </span>
                    </div>

                    <div>
                      <div className="text-white text-sm font-bold truncate">
                        {item.coffeeName}
                      </div>
                      <div className="text-stone-300 text-xs truncate">
                        {item.shopName} · {item.city}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Feed Content Card */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <img
                      src={item.userAvatar}
                      alt={item.userName}
                      referrerPolicy="no-referrer"
                      className="w-9 h-9 rounded-full object-cover border border-stone-200 dark:border-stone-700"
                    />
                    <div>
                      <div className="text-xs font-bold text-stone-900 dark:text-white">
                        {item.userName}
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

                  {!item.photoUrl && (
                    <div className="text-right">
                      <span className="font-mono text-xl font-black text-amber-600 dark:text-amber-400">
                        {item.points}
                      </span>
                      <span className="text-xs text-stone-400 ml-1">pts</span>
                    </div>
                  )}
                </div>

                {/* Score Pills */}
                <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-[11px]">
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium capitalize">
                    {item.coffeeType.replace('_', ' ')}
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                    Barista Craft: {item.baristaRating}/10
                  </span>
                  <span className="px-2.5 py-1 rounded-lg bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 font-medium">
                    Shop Vibe: {item.shopRating}/10
                  </span>
                </div>

                {/* Action Row: Toast Cheers */}
                <div className="flex items-center justify-between pt-2">
                  <span className="text-[11px] text-stone-400">
                    {toasts > 0 ? `${toasts} community cheers` : 'Send first cheers'}
                  </span>
                  <button
                    onClick={() => handleToast(item.id)}
                    className="px-3 py-1.5 rounded-xl bg-amber-50 hover:bg-amber-100 dark:bg-amber-950/40 dark:hover:bg-amber-900/50 text-amber-800 dark:text-amber-300 text-xs font-semibold flex items-center gap-1.5 transition-colors active:scale-95"
                  >
                    <Coffee className="w-3.5 h-3.5" />
                    <span>Cheers ☕</span>
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

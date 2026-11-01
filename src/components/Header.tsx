import React from 'react';
import { Car, Coffee, Plus, Shield, Lock, Database } from 'lucide-react';

interface HeaderProps {
  activeView: 'daily' | 'garage' | 'leaderboard' | 'feed' | 'rules' | 'admin';
  setActiveView: (view: 'daily' | 'garage' | 'leaderboard' | 'feed' | 'rules' | 'admin') => void;
  onOpenLogModal: () => void;
  isAdmin: boolean;
  onOpenAdminLogin: () => void;
  todayMeetsCount: number;
  todayCupsCount: number;
  todayTotalPoints: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeView,
  setActiveView,
  onOpenLogModal,
  isAdmin,
  onOpenAdminLogin,
  todayMeetsCount,
  todayCupsCount,
  todayTotalPoints,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-stone-900/95 dark:bg-stone-950/95 backdrop-blur-md border-b border-stone-800 text-stone-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4 lg:gap-8">
        {/* Zone 1: Brand Wordmark */}
        <button
          onClick={() => setActiveView('daily')}
          className="text-left flex items-center gap-2.5 text-lg sm:text-xl font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-amber-300 transition-colors"
        >
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black shadow-sm">
            <Car className="w-4 h-4" />
          </div>
          <span className="font-serif">Cars & Coffee</span>
        </button>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-5 lg:gap-6 text-xs font-semibold text-stone-300">
          <button
            onClick={() => setActiveView('daily')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeView === 'daily'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Paddock Ledger
          </button>
          <button
            onClick={() => setActiveView('garage')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 flex items-center gap-1 ${
              activeView === 'garage'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            <span>My Garage</span>
          </button>
          <button
            onClick={() => setActiveView('leaderboard')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeView === 'leaderboard'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Worldwide Paddock
          </button>
          <button
            onClick={() => setActiveView('feed')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeView === 'feed'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Live Meets Feed
          </button>
          <button
            onClick={() => setActiveView('rules')}
            className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 ${
              activeView === 'rules'
                ? 'text-amber-400 border-b-2 border-amber-400 font-bold'
                : 'hover:text-white'
            }`}
          >
            Scoring Formula
          </button>

          {/* Admin Navigation Item */}
          {isAdmin ? (
            <button
              onClick={() => setActiveView('admin')}
              className={`whitespace-nowrap shrink-0 transition-colors pb-0.5 flex items-center gap-1.5 px-2 py-0.5 rounded-lg ${
                activeView === 'admin'
                  ? 'bg-amber-500/20 text-amber-300 font-bold border-b-2 border-amber-400'
                  : 'text-amber-400 hover:text-amber-300 hover:bg-stone-800'
              }`}
            >
              <Shield className="w-3.5 h-3.5 text-amber-400" />
              <span>Admin Hub</span>
            </button>
          ) : (
            <button
              onClick={onOpenAdminLogin}
              className="whitespace-nowrap shrink-0 transition-colors pb-0.5 flex items-center gap-1 text-stone-400 hover:text-amber-300"
              title="Admin Login to manage database and backup"
            >
              <Lock className="w-3.5 h-3.5 text-stone-500" />
              <span>Admin</span>
            </button>
          )}
        </nav>

        {/* Zone 3: Daily Summary & Primary Action */}
        <div className="flex items-center gap-3 shrink-0">
          <div className="hidden xl:flex items-center gap-2 px-3 py-1 bg-stone-800/80 rounded-xl border border-stone-700/60 text-xs">
            <span className="text-stone-400">Today:</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {todayMeetsCount} {todayMeetsCount === 1 ? 'meet' : 'meets'}
            </span>
            <span className="text-stone-600">·</span>
            <span className="font-mono font-bold text-amber-300 tabular-nums">
              {todayCupsCount} {todayCupsCount === 1 ? 'cup' : 'cups'}
            </span>
            <span className="text-stone-600">·</span>
            <span className="font-mono font-bold text-amber-400 tabular-nums">
              {todayTotalPoints} pts
            </span>
          </div>

          {/* Admin Indicator Pill for quick toggle */}
          {isAdmin && (
            <button
              onClick={() => setActiveView('admin')}
              className="px-2.5 py-1.5 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-300 hover:bg-amber-500/30 text-xs font-bold transition-all flex items-center gap-1.5"
              title="Open Admin Control Center & Database Hub"
            >
              <Database className="w-3.5 h-3.5 text-amber-400" />
              <span className="hidden sm:inline">Admin Mode</span>
            </button>
          )}

          <button
            onClick={onOpenLogModal}
            className="px-4 py-2 text-xs font-bold text-stone-950 bg-amber-400 hover:bg-amber-300 rounded-xl transition-all shadow-sm flex items-center gap-1.5 whitespace-nowrap shrink-0 active:scale-95"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Log Run</span>
          </button>
        </div>
      </div>

      {/* Mobile Sub-Navigation Bar */}
      <div className="md:hidden flex items-center justify-around border-t border-stone-800/80 px-2 py-2 bg-stone-900/90 text-[11px] font-semibold text-stone-400">
        <button
          onClick={() => setActiveView('daily')}
          className={`px-2.5 py-1 rounded-lg ${
            activeView === 'daily' ? 'bg-amber-500/10 text-amber-400 font-bold' : ''
          }`}
        >
          Paddock
        </button>
        <button
          onClick={() => setActiveView('garage')}
          className={`px-2.5 py-1 rounded-lg ${
            activeView === 'garage' ? 'bg-amber-500/10 text-amber-400 font-bold' : ''
          }`}
        >
          Garage
        </button>
        <button
          onClick={() => setActiveView('leaderboard')}
          className={`px-2.5 py-1 rounded-lg ${
            activeView === 'leaderboard' ? 'bg-amber-500/10 text-amber-400 font-bold' : ''
          }`}
        >
          Worldwide
        </button>
        <button
          onClick={() => setActiveView('feed')}
          className={`px-2.5 py-1 rounded-lg ${
            activeView === 'feed' ? 'bg-amber-500/10 text-amber-400 font-bold' : ''
          }`}
        >
          Feed
        </button>
        <button
          onClick={() => setActiveView('rules')}
          className={`px-2.5 py-1 rounded-lg ${
            activeView === 'rules' ? 'bg-amber-500/10 text-amber-400 font-bold' : ''
          }`}
        >
          Scoring
        </button>
        <button
          onClick={() => {
            if (isAdmin) {
              setActiveView('admin');
            } else {
              onOpenAdminLogin();
            }
          }}
          className={`px-2.5 py-1 rounded-lg flex items-center gap-1 ${
            activeView === 'admin'
              ? 'bg-amber-500/20 text-amber-300 font-bold'
              : isAdmin
              ? 'text-amber-400'
              : 'text-stone-400'
          }`}
        >
          {isAdmin ? <Shield className="w-3 h-3" /> : <Lock className="w-3 h-3" />}
          <span>Admin</span>
        </button>
      </div>
    </header>
  );
};

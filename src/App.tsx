import React, { useState, useEffect } from 'react';
import { Header } from './components/Header';
import { DailyTracker } from './components/DailyTracker';
import { WorldwideLeaderboard } from './components/WorldwideLeaderboard';
import { LiveGlobalFeed } from './components/LiveGlobalFeed';
import { ScoringRules } from './components/ScoringRules';
import { CoffeeLogModal } from './components/CoffeeLogModal';
import { CoffeeEntry } from './types/coffee';
import { INITIAL_USER_ENTRIES } from './data/worldwideDatabase';
import { Coffee, RotateCcw, Check, Heart, Trophy } from 'lucide-react';

const STORAGE_KEY = 'crema_craft_user_coffee_entries_v1';

export default function App() {
  const [entries, setEntries] = useState<CoffeeEntry[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to load coffee entries from localStorage', e);
    }
    return INITIAL_USER_ENTRIES;
  });

  const [activeView, setActiveView] = useState<'daily' | 'leaderboard' | 'feed' | 'rules'>('daily');
  const [isLogModalOpen, setIsLogModalOpen] = useState<boolean>(false);
  const [editingEntry, setEditingEntry] = useState<CoffeeEntry | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
      console.error('Failed to save coffee entries to localStorage', e);
    }
  }, [entries]);

  // Show auto-dismissing toast
  const triggerToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Compute metrics for header
  const todayStr = new Date().toISOString().split('T')[0];
  const todayEntries = entries.filter((e) => e.dateTime.startsWith(todayStr));
  const todayCupsCount = todayEntries.length;
  const todayTotalPoints = todayEntries.reduce((sum, e) => sum + e.points.totalPoints, 0);

  // Handlers
  const handleSaveEntry = (newOrUpdated: CoffeeEntry) => {
    setEntries((prev) => {
      const exists = prev.some((e) => e.id === newOrUpdated.id);
      if (exists) {
        return prev.map((e) => (e.id === newOrUpdated.id ? newOrUpdated : e));
      } else {
        return [newOrUpdated, ...prev];
      }
    });

    setEditingEntry(null);
    triggerToast(
      `✓ Logged ${newOrUpdated.coffeeName} (+${newOrUpdated.points.totalPoints} pts added to Global League)`
    );
  };

  const handleDeleteEntry = (id: string) => {
    setEntries((prev) => prev.filter((e) => e.id !== id));
    triggerToast('Coffee entry removed from your ledger');
  };

  const handleEditEntry = (entry: CoffeeEntry) => {
    setEditingEntry(entry);
    setIsLogModalOpen(true);
  };

  const handleResetData = () => {
    if (window.confirm('Reset coffee ledger to default specialty demo entries?')) {
      setEntries(INITIAL_USER_ENTRIES);
      triggerToast('Ledger reset to default specialty entries');
    }
  };

  return (
    <div className="min-h-screen bg-stone-100/60 dark:bg-stone-950 text-stone-900 dark:text-stone-100 flex flex-col font-sans transition-colors">
      {/* Top Bar Header adhering strictly to Top Bar Contract */}
      <Header
        activeView={activeView}
        setActiveView={setActiveView}
        onOpenLogModal={() => {
          setEditingEntry(null);
          setIsLogModalOpen(true);
        }}
        todayCupsCount={todayCupsCount}
        todayTotalPoints={todayTotalPoints}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6 sm:py-8">
        {activeView === 'daily' && (
          <DailyTracker
            entries={entries}
            onOpenLogModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
            onEditEntry={handleEditEntry}
            onDeleteEntry={handleDeleteEntry}
            onNavigateToLeaderboard={() => setActiveView('leaderboard')}
          />
        )}

        {activeView === 'leaderboard' && (
          <WorldwideLeaderboard
            userEntries={entries}
            onOpenLogModal={() => {
              setEditingEntry(null);
              setIsLogModalOpen(true);
            }}
          />
        )}

        {activeView === 'feed' && <LiveGlobalFeed />}

        {activeView === 'rules' && <ScoringRules />}
      </main>

      {/* Log Coffee Modal / Drawer */}
      <CoffeeLogModal
        isOpen={isLogModalOpen}
        onClose={() => {
          setIsLogModalOpen(false);
          setEditingEntry(null);
        }}
        onSave={handleSaveEntry}
        initialEntry={editingEntry}
      />

      {/* Floating Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-stone-900 dark:bg-stone-100 text-stone-100 dark:text-stone-900 px-4 py-3 rounded-2xl shadow-xl border border-stone-700 dark:border-stone-200 text-xs font-semibold flex items-center gap-2 animate-in slide-in-from-bottom duration-200">
          <Check className="w-4 h-4 text-emerald-400 dark:text-emerald-600" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Footer with Copyright & Links */}
      <footer className="border-t border-stone-200 dark:border-stone-800/80 bg-white dark:bg-stone-900/50 py-8 text-xs text-stone-500 dark:text-stone-400 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 text-center sm:text-left">
            <div className="flex items-center gap-2">
              <span className="font-serif font-bold text-stone-900 dark:text-stone-100">
                Crema & Craft
              </span>
              <span aria-hidden="true">·</span>
              <span>Worldwide Specialty Coffee League</span>
            </div>
            <span aria-hidden="true" className="hidden sm:inline">·</span>
            <span>© 2026 Crema & Craft. All rights reserved.</span>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={() => setActiveView('rules')}
              className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              Scoring Rubric
            </button>
            <button
              onClick={() => setActiveView('leaderboard')}
              className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors"
            >
              Global Rankings
            </button>
            <button
              onClick={handleResetData}
              className="hover:text-stone-900 dark:hover:text-stone-200 transition-colors flex items-center gap-1"
              title="Reset ledger to default entries"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Demo Data</span>
            </button>
          </div>
        </div>
      </footer>
    </div>
  );
}

import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Upload,
  Sparkles,
  MapPin,
  Calendar,
  Clock,
  Check,
  Award,
  Coffee,
  Info,
  ChevronRight,
  Sliders,
  Image as ImageIcon,
} from 'lucide-react';
import { CoffeeEntry, CoffeeTypeKey, CupSizeKey } from '../types/coffee';
import { COFFEE_TYPES, CUP_SIZES, calculateCoffeePoints, getScoreTier } from '../utils/scoring';
import { SAMPLE_ARTISAN_PHOTOS } from '../data/worldwideDatabase';
import { stampCoffeeImage } from '../utils/imageStamp';

interface CoffeeLogModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CoffeeEntry) => void;
  initialEntry?: CoffeeEntry | null;
}

export const CoffeeLogModal: React.FC<CoffeeLogModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
}) => {
  // Format current local datetime string for input type="datetime-local"
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    const localISOTime = new Date(now.getTime() - offset).toISOString().slice(0, 16);
    return localISOTime;
  };

  const [dateTime, setDateTime] = useState<string>(getCurrentDateTime());
  const [coffeeName, setCoffeeName] = useState<string>('Artisan Flat White');
  const [coffeeType, setCoffeeType] = useState<CoffeeTypeKey>('flat_white');
  const [size, setSize] = useState<CupSizeKey>('double');
  const [shopName, setShopName] = useState<string>('Workshop Coffee Roasters');
  const [city, setCity] = useState<string>('London');
  const [country, setCountry] = useState<string>('United Kingdom');
  const [baristaName, setBaristaName] = useState<string>('');
  const [locationRating, setLocationRating] = useState<number>(8.5);
  const [baristaLookRating, setBaristaLookRating] = useState<number>(9.0);
  const [shopLookRating, setShopLookRating] = useState<number>(8.5);
  const [isSingleOrigin, setIsSingleOrigin] = useState<boolean>(true);
  const [notes, setNotes] = useState<string>('');

  // Photo state
  const [selectedPhotoUrl, setSelectedPhotoUrl] = useState<string>(SAMPLE_ARTISAN_PHOTOS[0].url);
  const [isStamping, setIsStamping] = useState<boolean>(false);
  const [stampedPreviewUrl, setStampedPreviewUrl] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'details' | 'ratings' | 'photo'>('details');

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Sync state if editing
  useEffect(() => {
    if (initialEntry) {
      setDateTime(initialEntry.dateTime.slice(0, 16));
      setCoffeeName(initialEntry.coffeeName);
      setCoffeeType(initialEntry.coffeeType);
      setSize(initialEntry.size);
      setShopName(initialEntry.shopName);
      setCity(initialEntry.city);
      setCountry(initialEntry.country);
      setBaristaName(initialEntry.baristaName || '');
      setLocationRating(initialEntry.locationRating);
      setBaristaLookRating(initialEntry.baristaLookRating);
      setShopLookRating(initialEntry.shopLookRating);
      setIsSingleOrigin(initialEntry.isSingleOrigin);
      setNotes(initialEntry.notes || '');
      setSelectedPhotoUrl(initialEntry.baristaPhotoUrl);
      setStampedPreviewUrl(initialEntry.watermarkedPhotoUrl || null);
    } else {
      setDateTime(getCurrentDateTime());
      setCoffeeName('Double Cortado');
      setCoffeeType('cortado');
      setSize('double');
      setShopName('Blue Bottle Craft Bar');
      setCity('San Francisco');
      setCountry('United States');
      setLocationRating(9.0);
      setBaristaLookRating(9.2);
      setShopLookRating(8.8);
      setIsSingleOrigin(true);
      setSelectedPhotoUrl(SAMPLE_ARTISAN_PHOTOS[1].url);
      setStampedPreviewUrl(null);
    }
  }, [initialEntry, isOpen]);

  // Live points calculation
  const calculatedPoints = calculateCoffeePoints({
    coffeeType,
    size,
    locationRating,
    baristaLookRating,
    shopLookRating,
    isSingleOrigin,
  });

  const tier = getScoreTier(calculatedPoints.totalPoints);

  // Handle local file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedPhotoUrl(reader.result);
          setStampedPreviewUrl(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Stamp photo with canvas
  const generateStamp = async () => {
    setIsStamping(true);
    try {
      const stamped = await stampCoffeeImage(selectedPhotoUrl, {
        dateTime,
        coffeeName: coffeeName || 'Specialty Coffee',
        shopName: shopName || 'Artisan Cafe',
        city,
        totalPoints: calculatedPoints.totalPoints,
        baristaRating: baristaLookRating,
      });
      setStampedPreviewUrl(stamped);
    } catch (err) {
      console.error(err);
    } finally {
      setIsStamping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStamping(true);

    let finalStampedPhoto = stampedPreviewUrl;
    if (!finalStampedPhoto) {
      finalStampedPhoto = await stampCoffeeImage(selectedPhotoUrl, {
        dateTime,
        coffeeName: coffeeName || 'Specialty Coffee',
        shopName: shopName || 'Artisan Cafe',
        city,
        totalPoints: calculatedPoints.totalPoints,
        baristaRating: baristaLookRating,
      });
    }

    const newEntry: CoffeeEntry = {
      id: initialEntry ? initialEntry.id : `coffee_${Date.now()}`,
      dateTime: new Date(dateTime).toISOString(),
      coffeeName: coffeeName.trim() || 'Daily Specialty Brew',
      coffeeType,
      size,
      shopName: shopName.trim() || 'Local Artisan Roasters',
      city: city.trim() || 'Worldwide',
      country: country.trim() || 'Global',
      baristaName: baristaName.trim() || undefined,
      locationRating,
      baristaLookRating,
      shopLookRating,
      isSingleOrigin,
      baristaPhotoUrl: selectedPhotoUrl,
      watermarkedPhotoUrl: finalStampedPhoto,
      notes: notes.trim() || undefined,
      points: calculatedPoints,
    };

    setIsStamping(false);
    onSave(newEntry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-3xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/80 dark:bg-stone-900/80 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Coffee className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100">
                {initialEntry ? 'Edit Coffee Log' : 'Log New Coffee'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>Precision Scoring</span>
                <span aria-hidden="true">·</span>
                <span>Date-Time Stamping</span>
                <span aria-hidden="true">·</span>
                <span>Worldwide League</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Live Score Counter Pill in Header */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-xs uppercase font-medium text-amber-800 dark:text-amber-300">Live Score</span>
              <span className="font-mono text-lg font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                {calculatedPoints.totalPoints}
              </span>
              <span className="text-xs text-amber-700 dark:text-amber-300 font-semibold">pts</span>
            </div>

            <button
              onClick={onClose}
              className="p-2 text-stone-400 hover:text-stone-700 dark:hover:text-stone-200 rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tab Selector */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 bg-stone-100/50 dark:bg-stone-900/50 shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('details')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'details'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            1. Brew & Origin
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ratings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'ratings'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            2. Barista & Aesthetic Ratings
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photo')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap ${
              activeTab === 'photo'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            3. Timestamped Photo
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* TAB 1: Brew & Origin */}
          {activeTab === 'details' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Date & Time Picker */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Drink Date & Time
                  </label>
                  <div className="relative">
                    <input
                      type="datetime-local"
                      value={dateTime}
                      onChange={(e) => setDateTime(e.target.value)}
                      required
                      className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                    />
                  </div>
                  <span className="text-[11px] text-stone-400 mt-1 block">
                    Recorded on photo timestamp and verified for worldwide score.
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1.5">
                    Custom Coffee / Drink Name
                  </label>
                  <input
                    type="text"
                    value={coffeeName}
                    onChange={(e) => setCoffeeName(e.target.value)}
                    placeholder="e.g. Geisha V60, Double Cortado, Swan Flat White"
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Coffee Type Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Type of Coffee (Base Craft Points)
                  </label>
                  <span className="text-xs text-amber-700 dark:text-amber-400 font-medium">
                    {COFFEE_TYPES.find((t) => t.key === coffeeType)?.basePoints} pts base
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {COFFEE_TYPES.map((type) => {
                    const isSelected = coffeeType === type.key;
                    return (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => setCoffeeType(type.key)}
                        className={`text-left p-2.5 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="font-semibold truncate">{type.name}</div>
                        <div className="mt-1 flex items-center justify-between text-[11px] text-stone-500 dark:text-stone-400">
                          <span className="capitalize">{type.category.replace('-', ' ')}</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            +{type.basePoints}
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Cup Size */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Cup Size & Extraction Ratio
                  </label>
                  <span className="text-xs text-stone-500">
                    Ratio Factor: {CUP_SIZES.find((s) => s.key === size)?.multiplier}x
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                  {CUP_SIZES.map((sz) => {
                    const isSelected = size === sz.key;
                    return (
                      <button
                        key={sz.key}
                        type="button"
                        onClick={() => setSize(sz.key)}
                        className={`p-3 rounded-xl border text-left transition-all ${
                          isSelected
                            ? 'border-amber-500 bg-amber-50/70 dark:bg-amber-950/30 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 hover:border-stone-300 dark:hover:border-stone-700 text-stone-700 dark:text-stone-300'
                        }`}
                      >
                        <div className="text-xs font-bold">{sz.name}</div>
                        <div className="text-[11px] text-stone-500 dark:text-stone-400">{sz.volume}</div>
                        <div className="text-[11px] text-amber-600 dark:text-amber-400 font-mono font-medium mt-1">
                          {sz.multiplier >= 1.0 ? `+${Math.round((sz.multiplier - 1) * 100)}% ratio bonus` : 'Standard'}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Shop, City, Country */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Coffee Shop / Roastery
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Kurasu, St. Ali, Tim Wendelboe"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Tokyo, Melbourne, Oslo"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. Japan, Australia, Norway"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Specialty Bonus toggle */}
              <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200 dark:border-stone-700/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                    Single Origin / Microlot Bean Bonus
                  </div>
                  <div className="text-[11px] text-stone-500 dark:text-stone-400">
                    High-altitude estate or traceable microlot (+5 bonus points).
                  </div>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isSingleOrigin}
                    onChange={(e) => setIsSingleOrigin(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-11 h-6 bg-stone-300 peer-focus:outline-none rounded-full peer dark:bg-stone-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-stone-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-stone-600 peer-checked:bg-amber-600"></div>
                </label>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ratings')}
                  className="px-5 py-2.5 bg-stone-900 dark:bg-amber-500 dark:text-stone-950 text-white font-medium text-xs rounded-xl flex items-center gap-2 hover:bg-stone-800 transition-colors"
                >
                  Continue to Ratings & Look <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Ratings */}
          {activeTab === 'ratings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div className="p-3.5 rounded-2xl bg-amber-50/60 dark:bg-amber-950/20 border border-amber-200/70 dark:border-amber-900/40 text-xs text-amber-900 dark:text-amber-200">
                <span className="font-bold">Scoring Standards:</span> Each metric directly impacts your global cup ranking. Use honest assessments based on craft execution, foam gloss, and ambiance.
              </div>

              {/* 1. Barista Look & Latte Art */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Award className="w-4 h-4 text-amber-500" />
                    Barista Look & Latte Art Execution
                  </label>
                  <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {baristaLookRating.toFixed(1)} / 10
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Score the visual mastery: intricate microfoam art (swan, rosetta, tulip), glossy surface texture, cup cleanliness, barista craftsmanship.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={baristaLookRating}
                  onChange={(e) => setBaristaLookRating(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>1.0 (Rough / No Art)</span>
                  <span>5.0 (Standard Heart)</span>
                  <span>10.0 (World Latte Art Champ)</span>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                    +{calculatedPoints.baristaCraftPoints} pts awarded
                  </span>
                </div>
              </div>

              {/* 2. Coffee Shop Look & Vibe */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Sliders className="w-4 h-4 text-amber-500" />
                    Coffee Shop Look & Aesthetic
                  </label>
                  <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {shopLookRating.toFixed(1)} / 10
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Architectural aesthetic: minimalist concrete, warm oak timbers, La Marzocco/Slayer machine polish, foliage, acoustic vibe.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={shopLookRating}
                  onChange={(e) => setShopLookRating(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>1.0 (Sterile / Bland)</span>
                  <span>5.0 (Cozy Local Shop)</span>
                  <span>10.0 (Architectural Masterpiece)</span>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                    +{calculatedPoints.shopLookPoints} pts awarded
                  </span>
                </div>
              </div>

              {/* 3. Location & Roastery Rating */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-sm font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" />
                    Location & Bean Roasting Rating
                  </label>
                  <span className="font-mono text-base font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {locationRating.toFixed(1)} / 10
                  </span>
                </div>
                <p className="text-xs text-stone-500 dark:text-stone-400 mb-3">
                  Neighborhood atmosphere, on-site roasting setup, bean freshness transparency, water filtration quality.
                </p>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={locationRating}
                  onChange={(e) => setLocationRating(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>1.0 (Subway Kiosk)</span>
                  <span>5.0 (Standard Specialty)</span>
                  <span>10.0 (Global Destination Roastery)</span>
                </div>
                <div className="mt-2 text-right">
                  <span className="text-xs font-mono font-bold text-amber-700 dark:text-amber-300">
                    +{calculatedPoints.locationPoints} pts awarded
                  </span>
                </div>
              </div>

              {/* Optional Barista Name & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Barista Name / Credit (Optional)
                  </label>
                  <input
                    type="text"
                    value={baristaName}
                    onChange={(e) => setBaristaName(e.target.value)}
                    placeholder="e.g. Kenji, Astrid, Matteo"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-stone-700 dark:text-stone-300 mb-1">
                    Cupping Notes & Impressions
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. Notes of white peach, honey sweetness, silky body"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('details')}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back to Brew Info
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photo')}
                  className="px-5 py-2.5 bg-stone-900 dark:bg-amber-500 dark:text-stone-950 text-white font-medium text-xs rounded-xl flex items-center gap-2 hover:bg-stone-800 transition-colors"
                >
                  Continue to Photo & Watermark <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Photo & Timestamp */}
          {activeTab === 'photo' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-semibold text-stone-700 dark:text-stone-300">
                    Barista Look & Drink Photo Upload
                  </label>
                  <span className="text-[11px] text-stone-400">
                    Automatic date-time stamp & score burn-in
                  </span>
                </div>

                {/* File picker actions */}
                <div className="flex flex-wrap items-center gap-3 mb-4">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    capture="environment"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-xl text-xs font-semibold flex items-center gap-2 transition-colors shadow-sm"
                  >
                    <Camera className="w-4 h-4" /> Upload / Take Photo
                  </button>
                  <span className="text-xs text-stone-400">or select a curated artisan sample:</span>
                </div>

                {/* Sample artisan photos carousel */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 mb-4">
                  {SAMPLE_ARTISAN_PHOTOS.map((sample) => (
                    <button
                      key={sample.id}
                      type="button"
                      onClick={() => {
                        setSelectedPhotoUrl(sample.url);
                        setStampedPreviewUrl(null);
                      }}
                      className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all ${
                        selectedPhotoUrl === sample.url
                          ? 'border-amber-500 ring-2 ring-amber-500/50 scale-[1.02]'
                          : 'border-transparent opacity-75 hover:opacity-100'
                      }`}
                    >
                      <img
                        src={sample.url}
                        alt={sample.name}
                        referrerPolicy="no-referrer"
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent flex items-end p-1.5">
                        <span className="text-[10px] text-white font-medium truncate">{sample.name}</span>
                      </div>
                    </button>
                  ))}
                </div>

                {/* Preview Box with Timestamp Watermark */}
                <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-stone-900 relative">
                  <div className="relative aspect-4/3 sm:aspect-16/10 max-h-[340px] w-full flex items-center justify-center bg-stone-950">
                    <img
                      src={stampedPreviewUrl || selectedPhotoUrl}
                      alt="Barista look preview"
                      referrerPolicy="no-referrer"
                      className="max-h-full max-w-full object-contain"
                    />

                    {/* If not stamped yet, show live overlay preview */}
                    {!stampedPreviewUrl && (
                      <div className="absolute bottom-0 inset-x-0 p-4 bg-gradient-to-t from-stone-950/95 via-stone-950/70 to-transparent pointer-events-none">
                        <div className="border-t border-white/20 pt-2 flex items-end justify-between">
                          <div>
                            <div className="text-[11px] font-mono text-amber-400 font-semibold tracking-wider">
                              TIMESTAMP: {new Date(dateTime).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).toUpperCase()} {new Date(dateTime).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                            </div>
                            <div className="text-white text-sm font-bold truncate max-w-xs uppercase">
                              {coffeeName || 'ARTISAN COFFEE'}
                            </div>
                            <div className="text-stone-300 text-xs truncate">
                              {shopName.toUpperCase()} · {city.toUpperCase()}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-amber-400 font-mono text-xl font-extrabold tabular-nums">
                              {calculatedPoints.totalPoints} PTS
                            </div>
                            <div className="text-[10px] text-stone-300 font-semibold">
                              BARISTA CRAFT {baristaLookRating.toFixed(1)}/10
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="p-3 bg-stone-950 flex items-center justify-between border-t border-stone-800 text-xs">
                    <div className="flex items-center gap-2 text-stone-400">
                      <ImageIcon className="w-4 h-4 text-amber-400" />
                      <span>{stampedPreviewUrl ? 'Canvas Watermark Burned' : 'Live Canvas Stamp Ready'}</span>
                    </div>
                    <button
                      type="button"
                      onClick={generateStamp}
                      disabled={isStamping}
                      className="px-3 py-1.5 rounded-lg bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-medium transition-colors"
                    >
                      {isStamping ? 'Stamping...' : 'Re-render Burned Watermark'}
                    </button>
                  </div>
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('ratings')}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back to Ratings
                </button>
                <button
                  type="submit"
                  disabled={isStamping}
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-semibold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save & Submit to Global Database (+{calculatedPoints.totalPoints} pts)
                </button>
              </div>
            </div>
          )}

          {/* Persistent Scoring Breakdown Bar at Bottom */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Score Formula Breakdown
              </span>
              <span className="text-xs text-amber-800 dark:text-amber-300 font-medium">
                {tier.label} Tier
              </span>
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500">Coffee Type</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {calculatedPoints.typePoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500">Size Ratio</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {calculatedPoints.sizeMultiplier}x ({calculatedPoints.sizeBonusPoints >= 0 ? `+${calculatedPoints.sizeBonusPoints}` : calculatedPoints.sizeBonusPoints} pts)
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500">Location Score</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {calculatedPoints.locationPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-500">Barista Look</div>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {calculatedPoints.baristaCraftPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-stone-500">Shop Look & Bonus</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {calculatedPoints.shopLookPoints + calculatedPoints.specialtyBonus} pts
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

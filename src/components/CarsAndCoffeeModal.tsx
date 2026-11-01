import React, { useState, useEffect, useRef } from 'react';
import {
  X,
  Camera,
  Car,
  Coffee,
  Sparkles,
  Award,
  MapPin,
  Calendar,
  Clock,
  Check,
  ChevronRight,
  Sliders,
  Wrench,
  Flame,
  Image as ImageIcon,
} from 'lucide-react';
import {
  CarCategoryKey,
  CarsAndCoffeeEntry,
  CoffeeTypeKey,
  CupSizeKey,
} from '../types/coffee';
import {
  CAR_CATEGORIES,
  COFFEE_TYPES,
  CUP_SIZES,
  calculateCarsAndCoffeePoints,
  getCarsAndCoffeeTier,
} from '../utils/scoring';
import { SAMPLE_CARS_AND_COFFEE_PHOTOS } from '../data/worldwideDatabase';
import { stampBaristaImage, stampCarImage } from '../utils/imageStamp';

import { GarageCar } from './MyGarage';

interface CarsAndCoffeeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (entry: CarsAndCoffeeEntry) => void;
  initialEntry?: CarsAndCoffeeEntry | null;
  prefillCar?: GarageCar | null;
}

const COMMON_MAKERS = [
  'Porsche',
  'Nissan',
  'BMW',
  'Chevrolet',
  'Ford',
  'Toyota',
  'Alfa Romeo',
  'Ferrari',
  'Mazda',
  'Mercedes-AMG',
  'Audi',
  'Datsun',
  'Honda',
  'Subaru',
  'Aston Martin',
];

export const CarsAndCoffeeModal: React.FC<CarsAndCoffeeModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialEntry,
  prefillCar,
}) => {
  const getCurrentDateTime = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset() * 60000;
    return new Date(now.getTime() - offset).toISOString().slice(0, 16);
  };

  const [dateTime, setDateTime] = useState<string>(getCurrentDateTime());
  const [activeTab, setActiveTab] = useState<'car' | 'coffee' | 'ratings' | 'photos'>('car');

  // Car State
  const [carYear, setCarYear] = useState<number>(1987);
  const [carMake, setCarMake] = useState<string>('Porsche');
  const [carModel, setCarModel] = useState<string>('911 Carrera G-Series');
  const [carCategory, setCarCategory] = useState<CarCategoryKey>('Air-Cooled Classic');
  const [mods, setMods] = useState<string>(
    'Fuchs 16" forged wheels, Dansk stainless sport exhaust, Bilstein B6 dampers, Momo Prototipo steering wheel'
  );
  const [carLookRating, setCarLookRating] = useState<number>(9.8);
  const [selectedCarPhoto, setSelectedCarPhoto] = useState<string>(
    SAMPLE_CARS_AND_COFFEE_PHOTOS.cars[0].url
  );
  const [stampedCarPhoto, setStampedCarPhoto] = useState<string | null>(null);

  // Coffee State
  const [coffeeCupsCount, setCoffeeCupsCount] = useState<number>(2);
  const [primaryCoffeeType, setPrimaryCoffeeType] = useState<CoffeeTypeKey>('flat_white');
  const [selectedCoffeeTypes, setSelectedCoffeeTypes] = useState<CoffeeTypeKey[]>([
    'flat_white',
    'cortado',
  ]);
  const [size, setSize] = useState<CupSizeKey>('double');
  const [isSingleOrigin, setIsSingleOrigin] = useState<boolean>(true);
  const [baristaLookRating, setBaristaLookRating] = useState<number>(9.6);
  const [baristaName, setBaristaName] = useState<string>('Elena Rostova');
  const [selectedBaristaPhoto, setSelectedBaristaPhoto] = useState<string>(
    SAMPLE_CARS_AND_COFFEE_PHOTOS.baristas[0].url
  );
  const [stampedBaristaPhoto, setStampedBaristaPhoto] = useState<string | null>(null);

  // Meet Venue State
  const [shopName, setShopName] = useState<string>('Aurora Coffee Roasters');
  const [meetName, setMeetName] = useState<string>('Crystal Cove Sunrise Meet');
  const [city, setCity] = useState<string>('Newport Beach');
  const [country, setCountry] = useState<string>('United States');
  const [locationRating, setLocationRating] = useState<number>(9.5);
  const [shopLookRating, setShopLookRating] = useState<number>(9.4);
  const [notes, setNotes] = useState<string>(
    'Crisp sunrise morning drive along Pacific Coast Highway. 3.2 flat-six revving before parking next to the cafe patio.'
  );

  const [isStamping, setIsStamping] = useState<boolean>(false);
  const carFileInputRef = useRef<HTMLInputElement>(null);
  const baristaFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (initialEntry) {
      setDateTime(initialEntry.dateTime.slice(0, 16));
      setCarYear(initialEntry.carYear);
      setCarMake(initialEntry.carMake);
      setCarModel(initialEntry.carModel);
      setCarCategory(initialEntry.carCategory);
      setMods(initialEntry.mods);
      setCarLookRating(initialEntry.carLookRating);
      setSelectedCarPhoto(initialEntry.carPhotoUrl);
      setStampedCarPhoto(initialEntry.stampedCarPhotoUrl || null);

      setCoffeeCupsCount(initialEntry.coffeeCupsCount);
      setPrimaryCoffeeType(initialEntry.primaryCoffeeType);
      setSelectedCoffeeTypes(initialEntry.coffeeTypes || [initialEntry.primaryCoffeeType]);
      setSize(initialEntry.size);
      setIsSingleOrigin(initialEntry.isSingleOrigin);
      setBaristaLookRating(initialEntry.baristaLookRating);
      setBaristaName(initialEntry.baristaName || '');
      setSelectedBaristaPhoto(initialEntry.baristaPhotoUrl);
      setStampedBaristaPhoto(initialEntry.stampedBaristaPhotoUrl || null);

      setShopName(initialEntry.shopName);
      setMeetName(initialEntry.meetName);
      setCity(initialEntry.city);
      setCountry(initialEntry.country);
      setLocationRating(initialEntry.locationRating);
      setShopLookRating(initialEntry.shopLookRating);
      setNotes(initialEntry.notes || '');
    } else if (prefillCar) {
      setDateTime(getCurrentDateTime());
      setCarYear(prefillCar.year);
      setCarMake(prefillCar.make);
      setCarModel(prefillCar.model);
      setCarCategory(prefillCar.category);
      setMods(prefillCar.mods);
      setCarLookRating(9.8);
      setSelectedCarPhoto(prefillCar.photoUrl);
      setStampedCarPhoto(null);

      setCoffeeCupsCount(2);
      setPrimaryCoffeeType('flat_white');
      setSelectedCoffeeTypes(['flat_white', 'cortado']);
      setSize('double');
      setBaristaLookRating(9.6);
      setBaristaName('Elena Rostova');
      setSelectedBaristaPhoto(SAMPLE_CARS_AND_COFFEE_PHOTOS.baristas[0].url);
      setStampedBaristaPhoto(null);
    } else {
      setDateTime(getCurrentDateTime());
      setCarYear(1987);
      setCarMake('Porsche');
      setCarModel('911 Carrera 3.2 G-Series');
      setCarCategory('Air-Cooled Classic');
      setMods('Fuchs 16" forged wheels, Dansk stainless sport exhaust, Bilstein dampers');
      setCarLookRating(9.8);
      setSelectedCarPhoto(SAMPLE_CARS_AND_COFFEE_PHOTOS.cars[0].url);
      setStampedCarPhoto(null);

      setCoffeeCupsCount(2);
      setPrimaryCoffeeType('flat_white');
      setSelectedCoffeeTypes(['flat_white', 'cortado']);
      setSize('double');
      setBaristaLookRating(9.6);
      setBaristaName('Elena');
      setSelectedBaristaPhoto(SAMPLE_CARS_AND_COFFEE_PHOTOS.baristas[0].url);
      setStampedBaristaPhoto(null);
    }
  }, [initialEntry, isOpen]);

  // Live Score Calculation
  const scoreBreakdown = calculateCarsAndCoffeePoints({
    carCategory,
    carYear,
    carLookRating,
    mods,
    coffeeCupsCount,
    primaryCoffeeType,
    baristaLookRating,
    locationRating,
    shopLookRating,
    isSingleOrigin,
  });

  const tier = getCarsAndCoffeeTier(scoreBreakdown.totalPoints);

  // Toggle coffee type
  const toggleCoffeeType = (key: CoffeeTypeKey) => {
    setSelectedCoffeeTypes((prev) => {
      if (prev.includes(key)) {
        if (prev.length === 1) return prev; // keep at least one
        return prev.filter((k) => k !== key);
      } else {
        return [...prev, key];
      }
    });
    setPrimaryCoffeeType(key);
  };

  // Image Upload Handlers
  const handleCarFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedCarPhoto(reader.result);
          setStampedCarPhoto(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleBaristaFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setSelectedBaristaPhoto(reader.result);
          setStampedBaristaPhoto(null);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Burn stamps
  const handleGenerateStamps = async () => {
    setIsStamping(true);
    try {
      const primaryTypeName =
        COFFEE_TYPES.find((t) => t.key === primaryCoffeeType)?.name || 'Artisan Coffee';

      const stampedCar = await stampCarImage(selectedCarPhoto, {
        dateTime,
        carYear,
        carMake,
        carModel,
        mods,
        coffeeCupsCount,
        primaryCoffeeName: primaryTypeName,
        meetOrShopName: meetName || shopName,
        city,
        totalPoints: scoreBreakdown.totalPoints,
        carRating: carLookRating,
      });

      const stampedBarista = await stampBaristaImage(selectedBaristaPhoto, {
        dateTime,
        coffeeName: primaryTypeName,
        shopName,
        baristaName,
        city,
        totalPoints: scoreBreakdown.totalPoints,
        baristaRating: baristaLookRating,
      });

      setStampedCarPhoto(stampedCar);
      setStampedBaristaPhoto(stampedBarista);
    } catch (e) {
      console.error(e);
    } finally {
      setIsStamping(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsStamping(true);

    const primaryTypeName =
      COFFEE_TYPES.find((t) => t.key === primaryCoffeeType)?.name || 'Artisan Coffee';

    let finalCarPhoto = stampedCarPhoto;
    if (!finalCarPhoto) {
      finalCarPhoto = await stampCarImage(selectedCarPhoto, {
        dateTime,
        carYear,
        carMake,
        carModel,
        mods,
        coffeeCupsCount,
        primaryCoffeeName: primaryTypeName,
        meetOrShopName: meetName || shopName,
        city,
        totalPoints: scoreBreakdown.totalPoints,
        carRating: carLookRating,
      });
    }

    let finalBaristaPhoto = stampedBaristaPhoto;
    if (!finalBaristaPhoto) {
      finalBaristaPhoto = await stampBaristaImage(selectedBaristaPhoto, {
        dateTime,
        coffeeName: primaryTypeName,
        shopName,
        baristaName,
        city,
        totalPoints: scoreBreakdown.totalPoints,
        baristaRating: baristaLookRating,
      });
    }

    const entry: CarsAndCoffeeEntry = {
      id: initialEntry ? initialEntry.id : `meet_${Date.now()}`,
      dateTime: new Date(dateTime).toISOString(),
      carYear,
      carMake: carMake.trim() || 'Custom',
      carModel: carModel.trim() || 'Special',
      carCategory,
      mods: mods.trim(),
      carPhotoUrl: selectedCarPhoto,
      stampedCarPhotoUrl: finalCarPhoto,
      carLookRating,

      coffeeCupsCount,
      coffeeTypes: selectedCoffeeTypes,
      primaryCoffeeType,
      size,
      baristaPhotoUrl: selectedBaristaPhoto,
      stampedBaristaPhotoUrl: finalBaristaPhoto,
      baristaLookRating,
      baristaName: baristaName.trim() || undefined,

      shopName: shopName.trim() || 'Paddock Roastery',
      meetName: meetName.trim() || 'Cars & Coffee Morning Meet',
      city: city.trim() || 'Worldwide',
      country: country.trim() || 'Global',
      locationRating,
      shopLookRating,
      isSingleOrigin,
      notes: notes.trim() || undefined,

      points: scoreBreakdown,
    };

    setIsStamping(false);
    onSave(entry);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-sm flex items-center justify-center p-3 sm:p-6 animate-in fade-in duration-200">
      <div className="relative w-full max-w-4xl bg-white dark:bg-stone-900 rounded-3xl shadow-2xl border border-stone-200 dark:border-stone-800 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header Bar */}
        <div className="px-6 py-4 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50/90 dark:bg-stone-900/90 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-600 dark:text-amber-400 flex items-center justify-center">
              <Car className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                {initialEntry ? 'Edit Cars & Coffee Run' : 'Log Cars & Coffee Meet'}
              </h2>
              <div className="flex items-center gap-2 text-xs text-stone-500 dark:text-stone-400">
                <span>Vehicle Specs & Mods</span>
                <span aria-hidden="true">·</span>
                <span>Coffee Tally & Barista Photo</span>
                <span aria-hidden="true">·</span>
                <span>Date-Time Verification</span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800">
              <span className="text-[10px] uppercase font-bold text-amber-800 dark:text-amber-300">
                Meet Score
              </span>
              <span className="font-mono text-lg font-extrabold text-amber-600 dark:text-amber-400 tabular-nums">
                {scoreBreakdown.totalPoints}
              </span>
              <span className="text-xs font-semibold text-amber-700 dark:text-amber-300">pts</span>
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

        {/* Tab Navigation */}
        <div className="flex border-b border-stone-200 dark:border-stone-800 px-6 bg-stone-100/50 dark:bg-stone-900/50 overflow-x-auto shrink-0">
          <button
            type="button"
            onClick={() => setActiveTab('car')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'car'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Car className="w-3.5 h-3.5" /> 1. Car Specs & Mods
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('coffee')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'coffee'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Coffee className="w-3.5 h-3.5" /> 2. Coffee, Cups & Barista
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('ratings')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'ratings'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <Sliders className="w-3.5 h-3.5" /> 3. Ratings & Paddock Venue
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('photos')}
            className={`py-3 px-4 text-xs font-semibold border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'photos'
                ? 'border-amber-600 text-amber-600 dark:text-amber-400'
                : 'border-transparent text-stone-500 hover:text-stone-900 dark:hover:text-stone-200'
            }`}
          >
            <ImageIcon className="w-3.5 h-3.5" /> 4. Stamped Photos & Proof
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="overflow-y-auto p-6 space-y-6 flex-1">
          {/* TAB 1: Car Specs & Mods */}
          {activeTab === 'car' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Meet Date & Morning Departure Time
                  </label>
                  <input
                    type="datetime-local"
                    value={dateTime}
                    onChange={(e) => setDateTime(e.target.value)}
                    required
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1.5">
                    Car Category
                  </label>
                  <select
                    value={carCategory}
                    onChange={(e) => setCarCategory(e.target.value as CarCategoryKey)}
                    className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  >
                    {CAR_CATEGORIES.map((c) => (
                      <option key={c.key} value={c.key}>
                        {c.key} (+{c.basePts} pts)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Year, Make, Model */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Year
                  </label>
                  <input
                    type="number"
                    min="1920"
                    max="2027"
                    value={carYear}
                    onChange={(e) => setCarYear(parseInt(e.target.value) || 2000)}
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    {carYear <= 1999 ? 'Vintage/Classic Era (+4 pts bonus)' : 'Modern Era'}
                  </span>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Car Maker
                  </label>
                  <input
                    type="text"
                    list="car-makers"
                    value={carMake}
                    onChange={(e) => setCarMake(e.target.value)}
                    placeholder="e.g. Porsche, Nissan, BMW"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                  <datalist id="car-makers">
                    {COMMON_MAKERS.map((m) => (
                      <option key={m} value={m} />
                    ))}
                  </datalist>
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Model & Trim
                  </label>
                  <input
                    type="text"
                    value={carModel}
                    onChange={(e) => setCarModel(e.target.value)}
                    placeholder="e.g. 911 Carrera RS, GT-R R34"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-semibold focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Modifications (Mods Input) */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1.5">
                  <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    Vehicle Modifications (Mods Input)
                  </label>
                  <span className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400">
                    +{scoreBreakdown.modsBonusPoints} pts bonus
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-2.5">
                  Input custom mods: exhaust, coilovers, forged wheels, ECU tune, aero, cam upgrades, big brakes, or interior work (comma-separated).
                </p>
                <textarea
                  rows={3}
                  value={mods}
                  onChange={(e) => setMods(e.target.value)}
                  placeholder="e.g. BBS LM 18 inch wheels, KW V3 coilovers, titanium sport exhaust, Brembo 6-piston brakes, Stage 2 ECU tune"
                  className="w-full px-3.5 py-2.5 bg-white dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              {/* Car Look & Stance Rating */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Car Look, Stance & Presence Rating
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {carLookRating.toFixed(1)} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  step="0.1"
                  value={carLookRating}
                  onChange={(e) => setCarLookRating(parseFloat(e.target.value))}
                  className="w-full accent-amber-500 cursor-pointer"
                />
                <div className="flex justify-between text-[10px] text-stone-400 mt-1 font-mono">
                  <span>1.0 (Dirty Daily)</span>
                  <span>5.0 (Clean Street)</span>
                  <span>10.0 (Concours / Paddock Hero)</span>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('coffee')}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  Continue to Coffee & Cups <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 2: Coffee & Cups & Barista */}
          {activeTab === 'coffee' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Number of Cups Slider / Selector */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2">
                    <Coffee className="w-4 h-4 text-amber-500" />
                    Number of Cups Consumed at the Meet
                  </label>
                  <span className="font-mono text-base font-extrabold text-amber-600 dark:text-amber-400">
                    {coffeeCupsCount} {coffeeCupsCount === 1 ? 'Cup' : 'Cups'}
                  </span>
                </div>
                <p className="text-[11px] text-stone-500 dark:text-stone-400 mb-3">
                  Each additional cup adds +4 points to your morning coffee craft tally.
                </p>
                <div className="flex items-center gap-2">
                  {[1, 2, 3, 4, 5, 6].map((num) => (
                    <button
                      key={num}
                      type="button"
                      onClick={() => setCoffeeCupsCount(num)}
                      className={`flex-1 py-2.5 rounded-xl font-mono text-xs font-bold border transition-all ${
                        coffeeCupsCount === num
                          ? 'border-amber-500 bg-amber-500 text-stone-950 shadow-sm'
                          : 'border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                      }`}
                    >
                      {num} {num === 1 ? 'cup' : 'cups'}
                    </button>
                  ))}
                </div>
              </div>

              {/* Coffee Types Selection */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-xs font-bold text-stone-700 dark:text-stone-300">
                    Types of Coffee Enjoyed (Select All That Apply)
                  </label>
                  <span className="text-xs text-amber-600 dark:text-amber-400 font-mono font-semibold">
                    Primary: {primaryCoffeeType.replace('_', ' ').toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
                  {COFFEE_TYPES.map((type) => {
                    const isSelected = selectedCoffeeTypes.includes(type.key);
                    const isPrimary = primaryCoffeeType === type.key;

                    return (
                      <button
                        key={type.key}
                        type="button"
                        onClick={() => toggleCoffeeType(type.key)}
                        className={`text-left p-3 rounded-xl border transition-all text-xs flex flex-col justify-between ${
                          isSelected
                            ? isPrimary
                              ? 'border-amber-500 bg-amber-50 dark:bg-amber-950/40 text-amber-950 dark:text-amber-100 ring-1 ring-amber-500'
                              : 'border-amber-300 dark:border-amber-700 bg-amber-50/40 dark:bg-stone-800 text-stone-800 dark:text-stone-200'
                            : 'border-stone-200 dark:border-stone-800 bg-white dark:bg-stone-850 text-stone-600 dark:text-stone-400 hover:border-stone-300'
                        }`}
                      >
                        <div className="font-semibold truncate">{type.name}</div>
                        <div className="mt-1 flex items-center justify-between text-[10px] text-stone-400">
                          <span>{type.category}</span>
                          <span className="font-mono font-bold text-amber-600 dark:text-amber-400">
                            +{type.basePoints} pts
                          </span>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Single Origin & Barista Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700 flex items-center justify-between">
                  <div>
                    <div className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-500" />
                      Single Origin Microlot Bean
                    </div>
                    <div className="text-[11px] text-stone-500 dark:text-stone-400">
                      Traceable estate or high-altitude lot (+5 pts)
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={isSingleOrigin}
                    onChange={(e) => setIsSingleOrigin(e.target.checked)}
                    className="w-5 h-5 accent-amber-500 cursor-pointer"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Barista Credit / Name
                  </label>
                  <input
                    type="text"
                    value={baristaName}
                    onChange={(e) => setBaristaName(e.target.value)}
                    placeholder="e.g. Kenji, Elena, Samira"
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('car')}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back to Car
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('ratings')}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  Continue to Ratings <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 3: Ratings & Venue */}
          {activeTab === 'ratings' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Barista Look Rating */}
              <div className="p-4 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                <div className="flex items-center justify-between mb-1">
                  <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                    <Award className="w-3.5 h-3.5 text-amber-500" />
                    Barista Look & Latte Art Execution
                  </label>
                  <span className="font-mono text-sm font-bold text-amber-600 dark:text-amber-400 tabular-nums">
                    {baristaLookRating.toFixed(1)} / 10
                  </span>
                </div>
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
                  <span>1.0 (Rough Foam)</span>
                  <span>5.0 (Clean Heart)</span>
                  <span>10.0 (World Rosetta / Swan)</span>
                </div>
              </div>

              {/* Meet & Venue Information */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Meet Name
                  </label>
                  <input
                    type="text"
                    value={meetName}
                    onChange={(e) => setMeetName(e.target.value)}
                    placeholder="e.g. Crystal Cove Sunrise, Daikanyama T-Site"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Cafe / Roastery Name
                  </label>
                  <input
                    type="text"
                    value={shopName}
                    onChange={(e) => setShopName(e.target.value)}
                    placeholder="e.g. Aurora Roasters, Roast & Co."
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    City
                  </label>
                  <input
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                    placeholder="e.g. Newport Beach, Tokyo, London"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                    Country
                  </label>
                  <input
                    type="text"
                    value={country}
                    onChange={(e) => setCountry(e.target.value)}
                    placeholder="e.g. United States, Japan, Italy"
                    required
                    className="w-full px-3 py-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Location & Shop Look Sliders */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                    <span>Meet Atmosphere & Parking Paddock</span>
                    <span className="font-mono text-amber-600">{locationRating.toFixed(1)}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={locationRating}
                    onChange={(e) => setLocationRating(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>

                <div className="p-3.5 rounded-2xl bg-stone-50 dark:bg-stone-850 border border-stone-200 dark:border-stone-700">
                  <div className="flex justify-between text-xs font-bold text-stone-900 dark:text-stone-100 mb-1">
                    <span>Coffee Shop Aesthetic & Vibe</span>
                    <span className="font-mono text-amber-600">{shopLookRating.toFixed(1)}/10</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="10"
                    step="0.1"
                    value={shopLookRating}
                    onChange={(e) => setShopLookRating(parseFloat(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 mb-1">
                  Morning Drive Notes & Cupping Impressions
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Sunrise canyon roads, crisp exhaust sound, jasmine floral pour over"
                  className="w-full px-3.5 py-2.5 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl text-xs font-medium focus:outline-none focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="flex justify-between pt-2">
                <button
                  type="button"
                  onClick={() => setActiveTab('coffee')}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 text-stone-700 dark:text-stone-300 font-medium text-xs rounded-xl hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
                >
                  Back to Coffee
                </button>
                <button
                  type="button"
                  onClick={() => setActiveTab('photos')}
                  className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white font-medium text-xs rounded-xl flex items-center gap-2 transition-colors"
                >
                  Continue to Stamped Photos <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* TAB 4: Stamped Photos & Proof */}
          {activeTab === 'photos' && (
            <div className="space-y-6 animate-in fade-in duration-150">
              {/* Dual Media Section: Car Photo & Barista Photo */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* 1. Car Photo Upload & Stamping */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Car className="w-4 h-4 text-amber-500" /> Car Photo & Stamped Build Watermark
                    </label>
                    <input
                      ref={carFileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleCarFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => carFileInputRef.current?.click()}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Upload Car
                    </button>
                  </div>

                  {/* Sample car buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_CARS_AND_COFFEE_PHOTOS.cars.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedCarPhoto(sample.url);
                          setStampedCarPhoto(null);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all ${
                          selectedCarPhoto === sample.url
                            ? 'border-amber-500 ring-2 ring-amber-500/40'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                          <span className="text-[9px] text-white font-medium truncate">{sample.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Car Image Preview Container */}
                  <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-stone-950 relative aspect-4/3 flex items-center justify-center">
                    <img
                      src={stampedCarPhoto || selectedCarPhoto}
                      alt="Car build preview"
                      className="w-full h-full object-cover"
                    />
                    {!stampedCarPhoto && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white text-xs">
                        <div className="font-mono text-amber-400 font-bold text-[10px]">
                          TIMESTAMP: {new Date(dateTime).toLocaleDateString().toUpperCase()}
                        </div>
                        <div className="font-bold truncate">{carYear} {carMake} {carModel}</div>
                        <div className="text-[10px] text-stone-300 truncate">{mods || 'Stock'}</div>
                      </div>
                    )}
                  </div>
                </div>

                {/* 2. Barista Photo Upload & Stamping */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-900 dark:text-stone-100 flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-amber-500" /> Barista & Latte Art Photo
                    </label>
                    <input
                      ref={baristaFileInputRef}
                      type="file"
                      accept="image/*"
                      capture="environment"
                      onChange={handleBaristaFileUpload}
                      className="hidden"
                    />
                    <button
                      type="button"
                      onClick={() => baristaFileInputRef.current?.click()}
                      className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold flex items-center gap-1"
                    >
                      <Camera className="w-3.5 h-3.5" /> Upload Barista
                    </button>
                  </div>

                  {/* Sample barista buttons */}
                  <div className="grid grid-cols-3 gap-2">
                    {SAMPLE_CARS_AND_COFFEE_PHOTOS.baristas.map((sample) => (
                      <button
                        key={sample.id}
                        type="button"
                        onClick={() => {
                          setSelectedBaristaPhoto(sample.url);
                          setStampedBaristaPhoto(null);
                        }}
                        className={`relative rounded-xl overflow-hidden aspect-4/3 border-2 transition-all ${
                          selectedBaristaPhoto === sample.url
                            ? 'border-amber-500 ring-2 ring-amber-500/40'
                            : 'border-transparent opacity-70 hover:opacity-100'
                        }`}
                      >
                        <img
                          src={sample.url}
                          alt={sample.name}
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex items-end p-1">
                          <span className="text-[9px] text-white font-medium truncate">{sample.name}</span>
                        </div>
                      </button>
                    ))}
                  </div>

                  {/* Barista Image Preview Container */}
                  <div className="border border-stone-200 dark:border-stone-800 rounded-2xl overflow-hidden bg-stone-950 relative aspect-4/3 flex items-center justify-center">
                    <img
                      src={stampedBaristaPhoto || selectedBaristaPhoto}
                      alt="Barista craft preview"
                      className="w-full h-full object-cover"
                    />
                    {!stampedBaristaPhoto && (
                      <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent text-white text-xs">
                        <div className="font-mono text-amber-400 font-bold text-[10px]">
                          LATTE ART CRAFT: {baristaLookRating.toFixed(1)}/10
                        </div>
                        <div className="font-bold truncate">Barista {baristaName || 'Specialty Barista'}</div>
                        <div className="text-[10px] text-stone-300 truncate">{shopName}</div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Watermark Generation Button */}
              <div className="p-3.5 bg-stone-100 dark:bg-stone-800 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
                <span className="text-stone-600 dark:text-stone-300">
                  {stampedCarPhoto && stampedBaristaPhoto
                    ? '✓ Official Cars & Coffee Watermarks Burned into Canvas'
                    : 'Click to burn verified date-time stamps & vehicle specs onto canvas:'}
                </span>
                <button
                  type="button"
                  onClick={handleGenerateStamps}
                  disabled={isStamping}
                  className="px-4 py-2 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white font-bold rounded-xl transition-all"
                >
                  {isStamping ? 'Stamping Canvas...' : 'Burn Verified Stamps'}
                </button>
              </div>

              {/* Submit Button */}
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
                  className="px-6 py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-2"
                >
                  <Check className="w-4 h-4" /> Save Meet Run (+{scoreBreakdown.totalPoints} pts)
                </button>
              </div>
            </div>
          )}

          {/* Persistent Scoring Breakdown Bar */}
          <div className="p-4 rounded-2xl bg-amber-50/70 dark:bg-amber-950/20 border border-amber-200/80 dark:border-amber-900/50">
            <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
              <span className="text-xs font-bold text-amber-950 dark:text-amber-200">
                Cars & Coffee Score Breakdown
              </span>
              <span className="text-xs text-amber-800 dark:text-amber-300 font-bold">
                {tier.label} Tier
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-400">Car Build</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {scoreBreakdown.carBuildPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-400">Mods Bonus</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  +{scoreBreakdown.modsBonusPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-400">Coffee Fuel</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {scoreBreakdown.coffeeCraftPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800">
                <div className="text-[10px] text-stone-400">Barista Craft</div>
                <div className="font-mono font-bold text-amber-600 dark:text-amber-400">
                  {scoreBreakdown.baristaLookPoints} pts
                </div>
              </div>
              <div className="bg-white/80 dark:bg-stone-900/80 p-2 rounded-xl border border-amber-100 dark:border-stone-800 col-span-2 sm:col-span-1">
                <div className="text-[10px] text-stone-400">Venue & Paddock</div>
                <div className="font-mono font-bold text-stone-900 dark:text-stone-100">
                  {scoreBreakdown.meetAndShopPoints} pts
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

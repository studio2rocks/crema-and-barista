import React, { useState } from 'react';
import {
  Car,
  Plus,
  Wrench,
  Award,
  Sparkles,
  Check,
  Trash2,
  Edit3,
  Calendar,
  Flame,
} from 'lucide-react';
import { CarCategoryKey } from '../types/coffee';
import { CAR_CATEGORIES } from '../utils/scoring';
import { SAMPLE_CARS_AND_COFFEE_PHOTOS } from '../data/worldwideDatabase';

export interface GarageCar {
  id: string;
  year: number;
  make: string;
  model: string;
  category: CarCategoryKey;
  mods: string;
  photoUrl: string;
  runsLogged: number;
  bestScore: number;
  horsepower?: string;
  licensePlate?: string;
}

export const INITIAL_GARAGE_CARS: GarageCar[] = [
  {
    id: 'garage_porsche',
    year: 1987,
    make: 'Porsche',
    model: '911 Carrera 3.2 G-Series',
    category: 'Air-Cooled Classic',
    mods: 'Fuchs 16" forged wheels, Dansk stainless sport exhaust, Bilstein B6 dampers, Momo Prototipo steering wheel, Steve Wong performance chip',
    photoUrl: '/src/assets/images/cars_and_coffee_porsche_1793528533763.jpg',
    runsLogged: 12,
    bestScore: 134,
    horsepower: '235 HP (Air-Cooled Flat-6)',
    licensePlate: 'GLDN HR',
  },
  {
    id: 'garage_gtr',
    year: 1999,
    make: 'Nissan',
    model: 'Skyline GT-R R34 V-Spec',
    category: 'JDM Tuner',
    mods: 'Volk Racing TE37 Saga 18x10.5, HKS Silent Hi-Power titanium exhaust, Ohlins DFV coilovers, Nismo front bumper & carbon lip, Tomei Poncam cams',
    photoUrl: '/src/assets/images/cars_and_coffee_jdm_1793528536227.jpg',
    runsLogged: 8,
    bestScore: 138,
    horsepower: '450 HP (Twin Turbo RB26)',
    licensePlate: 'RB26-V',
  },
  {
    id: 'garage_camaro',
    year: 1969,
    make: 'Chevrolet',
    model: 'Camaro SS 396 Big Block',
    category: 'American Muscle',
    mods: 'Brodix aluminum heads, Detroit Speed hydroformed front subframe, Forgeline GA3 forged wheels, Wilwood 6-piston brakes, Tremec T56 6-speed',
    photoUrl: '/src/assets/images/cars_and_coffee_vintage_1793528630838.jpg',
    runsLogged: 5,
    bestScore: 124,
    horsepower: '475 HP (396 V8 Big Block)',
    licensePlate: 'SS-396',
  },
];

interface MyGarageProps {
  onSelectCarForMeet: (car: GarageCar) => void;
  cars?: GarageCar[];
  onUpdateCars?: (cars: GarageCar[]) => void;
  isAdmin?: boolean;
}

export const MyGarage: React.FC<MyGarageProps> = ({
  onSelectCarForMeet,
  cars,
  onUpdateCars,
  isAdmin = false,
}) => {
  const [internalCars, setInternalCars] = useState<GarageCar[]>(() => {
    try {
      const saved = localStorage.getItem('cars_and_coffee_garage_cars_v1');
      if (saved) return JSON.parse(saved);
    } catch (e) {
      console.error(e);
    }
    return INITIAL_GARAGE_CARS;
  });

  const garageCars = cars || internalCars;
  const setGarageCars = (updater: React.SetStateAction<GarageCar[]>) => {
    if (onUpdateCars) {
      const next = typeof updater === 'function' ? updater(garageCars) : updater;
      onUpdateCars(next);
    } else {
      setInternalCars(updater);
    }
  };

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [year, setYear] = useState<number>(1995);
  const [make, setMake] = useState<string>('BMW');
  const [model, setModel] = useState<string>('M3 E36 Lightweight');
  const [category, setCategory] = useState<CarCategoryKey>('Euro Classic');
  const [mods, setMods] = useState<string>('BBS Motorsport wheels, KW Clubsport suspension, Supersprint race exhaust');
  const [horsepower, setHorsepower] = useState<string>('280 HP (S50B30 Inline-6)');
  const [licensePlate, setLicensePlate] = useState<string>('M3-LTW');
  const [photoUrl, setPhotoUrl] = useState<string>(SAMPLE_CARS_AND_COFFEE_PHOTOS.cars[0].url);

  const saveGarage = (updated: GarageCar[]) => {
    setGarageCars(updated);
    try {
      localStorage.setItem('cars_and_coffee_garage_cars_v1', JSON.stringify(updated));
    } catch (e) {
      console.error(e);
    }
  };

  const handleAddCar = (e: React.FormEvent) => {
    e.preventDefault();
    const newCar: GarageCar = {
      id: `car_${Date.now()}`,
      year,
      make: make.trim(),
      model: model.trim(),
      category,
      mods: mods.trim(),
      photoUrl,
      runsLogged: 0,
      bestScore: 0,
      horsepower: horsepower.trim() || undefined,
      licensePlate: licensePlate.trim() || undefined,
    };

    saveGarage([newCar, ...garageCars]);
    setIsAddModalOpen(false);
  };

  const handleDeleteCar = (id: string) => {
    if (window.confirm('Remove this build from your garage?')) {
      saveGarage(garageCars.filter((c) => c.id !== id));
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Header */}
      <div className="bg-white dark:bg-stone-900 p-6 sm:p-8 rounded-3xl border border-stone-200 dark:border-stone-800 shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 text-xs font-semibold mb-2">
            <Car className="w-3.5 h-3.5" />
            <span>Personal Paddock Garage</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold font-serif text-stone-900 dark:text-white">
            My Cars & Coffee Garage ({garageCars.length})
          </h1>
          <p className="mt-1 text-xs sm:text-sm text-stone-500 dark:text-stone-400 max-w-2xl">
            Save your project builds, track your vehicle modification specs, and launch directly into a Cars & Coffee morning run with 1 tap.
          </p>
        </div>

        <button
          onClick={() => setIsAddModalOpen(true)}
          className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs rounded-xl shadow-md transition-all flex items-center gap-1.5 self-start sm:self-auto shrink-0"
        >
          <Plus className="w-4 h-4" /> Add Vehicle to Garage
        </button>
      </div>

      {/* Garage Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {garageCars.map((car) => (
          <div
            key={car.id}
            className="bg-white dark:bg-stone-900 rounded-3xl border border-stone-200 dark:border-stone-800 overflow-hidden shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between"
          >
            <div>
              {/* Car Photo Banner */}
              <div className="relative aspect-16/10 bg-stone-950 overflow-hidden">
                <img
                  src={car.photoUrl}
                  alt={`${car.year} ${car.make} ${car.model}`}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent flex flex-col justify-between p-3.5">
                  <div className="flex justify-between items-start">
                    <span className="bg-stone-950/80 backdrop-blur-md px-2.5 py-1 rounded-lg border border-white/20 text-[10px] font-mono text-amber-300 font-bold">
                      {car.category.toUpperCase()}
                    </span>
                    {car.licensePlate && (
                      <span className="bg-amber-400 text-stone-950 px-2 py-0.5 rounded text-[10px] font-mono font-black tracking-widest">
                        {car.licensePlate}
                      </span>
                    )}
                  </div>

                  <div>
                    <div className="text-white text-base font-bold truncate">
                      {car.year} {car.make} {car.model}
                    </div>
                    {car.horsepower && (
                      <div className="text-[11px] text-stone-300 font-mono">
                        {car.horsepower}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-3">
                <div className="p-3 bg-stone-50 dark:bg-stone-850 rounded-2xl border border-stone-100 dark:border-stone-800">
                  <div className="text-[10px] uppercase font-bold text-stone-400 flex items-center gap-1.5 mb-1">
                    <Wrench className="w-3.5 h-3.5 text-amber-500" />
                    Modification List
                  </div>
                  <p className="text-xs font-mono text-stone-700 dark:text-stone-300 line-clamp-3">
                    {car.mods}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-2 text-center text-xs">
                  <div className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl">
                    <div className="text-[10px] text-stone-400">Meets Logged</div>
                    <div className="font-mono font-bold text-stone-900 dark:text-white mt-0.5">
                      {car.runsLogged} runs
                    </div>
                  </div>
                  <div className="p-2.5 bg-stone-50 dark:bg-stone-850 rounded-xl">
                    <div className="text-[10px] text-stone-400">Peak Meet Score</div>
                    <div className="font-mono font-bold text-amber-600 dark:text-amber-400 mt-0.5">
                      {car.bestScore > 0 ? `${car.bestScore} pts` : 'Ready to Run'}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Bottom Action Bar */}
            <div className="p-5 pt-0 flex items-center justify-between gap-3">
              <button
                onClick={() => handleDeleteCar(car.id)}
                className="p-2 text-stone-400 hover:text-red-500 rounded-xl hover:bg-red-50 dark:hover:bg-red-950/30 transition-colors"
                title="Delete from garage"
              >
                <Trash2 className="w-4 h-4" />
              </button>

              <button
                onClick={() => onSelectCarForMeet(car)}
                className="flex-1 py-2.5 bg-stone-900 hover:bg-stone-800 dark:bg-amber-500 dark:hover:bg-amber-400 dark:text-stone-950 text-white font-bold text-xs rounded-xl shadow-sm transition-all flex items-center justify-center gap-1.5"
              >
                <Flame className="w-3.5 h-3.5 text-amber-400 dark:text-stone-950" />
                <span>Drive to Cars & Coffee</span>
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Vehicle Modal */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white dark:bg-stone-900 max-w-lg w-full rounded-3xl p-6 border border-stone-200 dark:border-stone-800 shadow-2xl relative space-y-4">
            <div className="flex items-center justify-between border-b border-stone-100 dark:border-stone-800 pb-3">
              <h3 className="text-base font-bold text-stone-900 dark:text-white flex items-center gap-2">
                <Car className="w-4 h-4 text-amber-500" />
                Add Vehicle to Garage
              </h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-stone-400 p-1">
                ✕
              </button>
            </div>

            <form onSubmit={handleAddCar} className="space-y-4 text-xs">
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Year</label>
                  <input
                    type="number"
                    value={year}
                    onChange={(e) => setYear(parseInt(e.target.value) || 2000)}
                    required
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Make</label>
                  <input
                    type="text"
                    value={make}
                    onChange={(e) => setMake(e.target.value)}
                    required
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Model</label>
                  <input
                    type="text"
                    value={model}
                    onChange={(e) => setModel(e.target.value)}
                    required
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Category</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value as CarCategoryKey)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                >
                  {CAR_CATEGORIES.map((c) => (
                    <option key={c.key} value={c.key}>{c.key}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">
                  Modifications (Exhaust, Coilovers, Wheels, Engine)
                </label>
                <textarea
                  rows={2}
                  value={mods}
                  onChange={(e) => setMods(e.target.value)}
                  className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono text-xs"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">Engine / Power</label>
                  <input
                    type="text"
                    value={horsepower}
                    onChange={(e) => setHorsepower(e.target.value)}
                    placeholder="e.g. 350 HP Twin-Turbo"
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl"
                  />
                </div>
                <div>
                  <label className="block text-stone-700 dark:text-stone-300 font-bold mb-1">License Plate</label>
                  <input
                    type="text"
                    value={licensePlate}
                    onChange={(e) => setLicensePlate(e.target.value)}
                    placeholder="e.g. 911-RAW"
                    className="w-full p-2 bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 rounded-xl font-mono"
                  />
                </div>
              </div>

              <div className="flex justify-end gap-2 pt-3 border-t border-stone-100 dark:border-stone-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 border border-stone-300 dark:border-stone-700 rounded-xl font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold rounded-xl"
                >
                  Save Car to Garage
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

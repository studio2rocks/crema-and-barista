# Cars & Coffee: Worldwide Paddock & Coffee Tracker 🏎️☕

> **Track each Cars & Coffee run: log vehicle year, maker, model, custom modifications, car photo, coffee cups tally, coffee types, and barista picture with verified date-time stamps. Compete in the worldwide Cars & Coffee database.**

---

## 🌟 Overview

**Cars & Coffee** combines automotive enthusiast culture with specialty third-wave coffee craft. Every morning run you make to a sunrise meet is logged and scored objectively across vehicle rarity, custom build modifications, stance presentation, cups of coffee consumed, extraction quality, and barista latte art.

Both car and barista photos are processed on-device with HTML5 Canvas to burn authentic verified date-time stamps and build spec sheets directly into the image.

---

## ✨ Features

### 1. 🏎️ Complete Vehicle & Build Tracking
- **Car Year**: Full support from vintage classics (1960s–1990s air-cooled icons) to modern GTs.
- **Car Maker & Model**: Porsche, Nissan, BMW, Chevrolet, Ford, Toyota, Alfa Romeo, Ferrari, Mazda, etc.
- **Car Categories**: Air-Cooled Classic, JDM Tuner, Euro Classic, American Muscle, Modern GT, Exotic Supercar, Hot Hatch / Restomod, Vintage Roadster.
- **Modifications (Mods Input)**: Structured and freeform text input for wheels, suspension, exhaust, ECU tunes, aero, and engine modifications.
- **Car Look & Stance Rating**: 1.0 to 10.0 scale evaluating vehicle presence, paint condition, and build execution.

### 2. ☕ Coffee Fuel & Barista Tracking
- **Number of Cups**: Track exact cups consumed during the meet (1 to 6 cups) with incremental fuel points (+4 pts per cup).
- **Coffee Types**: Multi-select support for V60 Pour Over, Siphon, Cortado / Gibraltar, Flat White, Double Espresso, AeroPress, Nitro Cold Brew, Cappuccino, and more.
- **Barista Picture & Credit**: Upload or choose artisan barista photos with latte art execution scoring (1.0 to 10.0 scale).
- **Single-Origin Microlot Bonus**: +5 points for high-altitude single-origin beans.

### 3. 📸 Dual HTML5 Canvas Stamping & Watermarking
- **Car Photo Stamp**: Burns official timestamp, meet venue, vehicle year/make/model, modifications summary, coffee cups tally, stance rating, and `CARS & COFFEE VERIFIED` badge onto the photo.
- **Barista Photo Stamp**: Burns timestamp, drink name, cafe name, barista credit, and latte art craft rating.
- **Save & Export**: Download high-resolution stamped photos directly for social sharing or inspect in a full-screen lightbox.

### 4. 🌍 Worldwide Paddock Leaderboard & Competition
- **Dynamic Paddock Ranking**: Real-time rank calculation comparing your build against global enthusiasts.
- **Head-to-Head Comparison**: Compare your car build, mods, coffee fuel, and barista score against the World #1 Leader (Tokyo Daikanyama T-Site) and Global Average.
- **Regional Filters**: Filter by Asia-Pacific, North America, Europe, or by Car Category.
- **Driver Profiles**: Inspect other enthusiasts' featured cars, full modification lists, and signature coffee orders.

### 5. 📡 Live Meets Feed & Interactive Sandbox
- **Live Feed**: Stream of incoming runs from Crystal Cove, Daikanyama T-Site, Goodwood, and Milan with interactive "Rev Engine 🏁" reactions.
- **Scoring Sandbox**: Test and forecast any car and coffee configuration before driving out.

---

## 🎯 Scoring Formula

| Factor | Points Range | Details |
| :--- | :--- | :--- |
| **Car Build & Era** | 25 – 44 pts | Category base (Air-Cooled 28, JDM 26, Muscle 25, Modern GT 25) + Era bonus (pre-1999 +4 pts) + Stance rating |
| **Mods Bonus** | +0 to +15 pts | Up to +15 pts for comprehensive builds (wheels, suspension, exhaust, tune) |
| **Coffee Craft & Fuel** | 16 – 47 pts | Coffee type base + Cup count bonus (+4 pts per additional cup) + Single-origin bonus (+5 pts) |
| **Barista Look & Latte Art** | 6 – 30 pts | 1.0 to 10.0 slider rating for latte art intricacy and microfoam gloss |
| **Meet Venue & Atmosphere** | 8 – 25 pts | Meet parking atmosphere + cafe roastery aesthetic |
| **Total Possible Score** | **70 – 150+ pts** | |

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Graphics**: HTML5 Canvas API (client-side image stamping)
- **Bundler**: Vite
- **Storage**: Browser LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ LTS recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/studio2rocks/cars-and-coffee.git
   cd cars-and-coffee
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```
   Open [http://localhost:3000](http://localhost:3000) in your browser.

4. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License & Copyright

Copyright © 2026 Cars & Coffee (`studio2rocks`). All rights reserved.

Distributed under the Apache License, Version 2.0. See [`LICENSE`](LICENSE) for full details.

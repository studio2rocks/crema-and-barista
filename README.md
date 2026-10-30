# Crema & Craft ☕

> **Track daily coffees, score artisanal extractions, burn verified date-time stamps onto barista photos, and compete in the worldwide coffee database.**

---

## 🌟 Overview

**Crema & Craft** is a specialty coffee companion application and global competition platform. Every cup of coffee you enjoy is scored objectively across extraction craft, cup size ratio, location roastery caliber, coffee shop aesthetic, and barista presentation. 

Photos uploaded with your logs are automatically stamped with an ISO date-time watermark and score verification tag, allowing you to build a verifiable coffee journal and climb the worldwide rankings alongside connoisseurs in Tokyo, Melbourne, Oslo, Milan, and Seattle.

---

## ✨ Key Features

### 1. 📅 Daily Coffee Tracker
- **Calendar & Daily Shifter**: Log and review cups consumed on any specific calendar date.
- **Cup Sequence Ledger**: Categorizes drinks as `Cup #1`, `Cup #2`, etc., with exact timestamps.
- **Bento Summary Metrics**:
  - Daily Total Points
  - Cups Consumed & Regimen Status
  - Average Cup Quality Rating
  - Estimated Global Standing & Percentile

### 2. 🎯 Multi-Factor Scoring Algorithm
Points are calculated dynamically across 5 calibrated specialty coffee criteria:
- **Coffee Type Base Points (15–30 pts)**:
  - Siphon / Vacuum Brew: `+30 pts`
  - V60 / Chemex Pour Over: `+28 pts`
  - Cortado / Gibraltar: `+25 pts`
  - Flat White: `+24 pts`
  - Double Espresso / Ristretto: `+23 pts`
  - AeroPress Specialty: `+24 pts`
  - Nitro Cold Brew: `+23 pts`
  - Traditional Macchiato: `+22 pts`
  - Turkish / Ibrik Cezve: `+22 pts`
  - Specialty Cappuccino: `+21 pts`
  - Slow Drip Cold Brew: `+20 pts`
  - Artisan Latte: `+18 pts`
  - Specialty Batch Brew / Americano: `+15 pts`
- **Cup Size & Ratio Multiplier**:
  - Double / Regular Barista Standard (5–7 oz): `1.15x ratio bonus`
  - Single / Piccolo: `1.10x ratio bonus`
  - Triple Shot Artisan: `1.12x ratio bonus`
  - Standard Cup (8–10 oz): `1.00x`
  - Large (12–16 oz): `0.92x`
- **Barista Look & Latte Art Execution (1.0–10.0 $\to$ 6–30 pts)**:
  - Intricacy of microfoam art (swan, rosetta, tulip), milk gloss, and barista craftsmanship.
- **Coffee Shop Look & Aesthetic (1.0–10.0 $\to$ 4–20 pts)**:
  - Cafe architecture, minimalist concrete, warm oak, espresso machine polish, and ambiance.
- **Location & Roastery Caliber (1.0–10.0 $\to$ 5–25 pts)**:
  - Neighborhood terroir, on-site roasting, bean transparency, and water profile.
- **Single-Origin Microlot Bonus**: `+5 pts`.

### 3. 📸 HTML5 Canvas Date-Time Stamp & Watermarker
- **Photo Upload**: Take live photos with your camera or select from your camera roll (or pick curated artisan presets).
- **Client-Side Canvas Burn-In**: Automatically burns:
  - Official timestamp (`TIMESTAMP: OCT 30, 2026 09:15 AM`)
  - Drink Name & Coffee Roastery/Shop location
  - Score badge (`98 PTS`)
  - Barista craft rating
  - `CREMA & CRAFT VERIFIED` security seal
- **Save & Export**: Download high-resolution stamped photos directly for social sharing or inspect in a full-screen lightbox.

### 4. 🌍 Worldwide Coffee Database & Competition
- **Dynamic Leaderboard**: Calculates your rank in real time against global connoisseurs based on your daily point totals.
- **Head-to-Head Comparison**: Compare your scores against the World #1 Connoisseur (Tokyo) and Global Community Average across all four scoring pillars.
- **Leaderboard Views**: Filter between **Today's Global Race** and **All-Time Legends**, or segment by region (Asia-Pacific, Europe, North America, Latin America).
- **Connoisseur Profiles**: Inspect signature brewing methods, favorite roasteries, and recent verified cups.

### 5. 📡 Live Global Activity Feed & Interactive Sandbox
- **Live Feed**: Watch coffee logs stream in from around the globe with interactive "Cheers ☕" reactions.
- **Point Sandbox**: Test and simulate any order configuration before ordering to forecast its score.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Graphics & Watermarking**: HTML5 Canvas API (client-side image processing)
- **Bundler**: Vite
- **Storage**: Browser LocalStorage persistence

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.0.0` or higher (Node 20+ LTS recommended)
- **Package Manager**: `npm` (v9+) or `yarn` / `pnpm`

> **Note on `SyntaxError: Unexpected token '.'`**:  
> If you encounter `SyntaxError: Unexpected token '.' at Loader.moduleStrategy (internal/modules/esm/translators.js:133:18)` when starting the dev server, your active Node.js version is outdated (such as Node 14 or 16), which lacks support for modern ECMAScript features used by Vite and Tailwind CSS.  
> Fix this by switching to Node 18 or 20 LTS:  
> ```bash
> # Using nvm
> nvm install 20
> nvm use 20
> # Verify version is >= 18
> node -v
> ```

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/studio2rocks/crema-and-barista.git
   cd crema-and-barista
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

5. **Typecheck & Lint**:
   ```bash
   npm run lint
   ```

---

## 📁 Project Structure

```text
├── index.html                   # HTML entry point with Google Fonts
├── package.json                 # Project dependencies and npm scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration (port 3000, Tailwind CSS)
├── src/
│   ├── main.tsx                 # React DOM mount point
│   ├── App.tsx                  # Root state orchestration & view router
│   ├── index.css                # Tailwind CSS v4 imports and theme variables
│   ├── types/
│   │   └── coffee.ts            # Type definitions for entries, scoring, and leaderboard
│   ├── utils/
│   │   ├── scoring.ts           # Scoring algorithm, formulas, and coffee definitions
│   │   └── imageStamp.ts        # HTML5 Canvas date-time watermarking engine
│   ├── data/
│   │   └── worldwideDatabase.ts # Seed data for worldwide connoisseurs and feeds
│   ├── components/
│   │   ├── Header.tsx           # Navigation bar adhering to Top Bar Contract
│   │   ├── DailyTracker.tsx     # Calendar view, bento summary, and cup ledger
│   │   ├── CoffeeLogModal.tsx   # 3-step logging modal with live scoring & camera
│   │   ├── WorldwideLeaderboard.tsx # Leaderboard & head-to-head comparison
│   │   ├── LiveGlobalFeed.tsx   # Real-time community activity stream
│   │   └── ScoringRules.tsx     # Point system documentation and sandbox calculator
│   └── assets/
│       └── images/              # High-fidelity artisan coffee photography
```

---

## 📜 Scoring Tier Badges

| Tier | Score Range | Description |
| :--- | :--- | :--- |
| **Grand Connoisseur** | 95+ pts | World-tier cup with master extraction and elite barista execution |
| **Specialty Gold** | 85–94 pts | Exemplary artisanal craft and aesthetic coffee shop ambiance |
| **Third Wave Standard** | 70–84 pts | Solid specialty coffee with great barista care and vibe |
| **Daily Fuel** | < 70 pts | Casual daily coffee intake |

---

## 📄 License

Apache-2.0

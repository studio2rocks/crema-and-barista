# Cars & Coffee: Worldwide Paddock & Coffee Tracker 🏎️☕

> **Track each Cars & Coffee run: log vehicle year, maker, model, custom modifications, car photo, coffee cups tally, coffee types, and barista picture with verified date-time stamps. Compete in the worldwide Cars & Coffee database.**

---

## 🌟 Overview

**Cars & Coffee** combines automotive enthusiast culture with specialty third-wave coffee craft. Every morning run you make to a sunrise meet is logged and scored objectively across vehicle rarity, custom build modifications, stance presentation, cups of coffee consumed, extraction quality, and barista latte art.

Both car and barista photos are processed on-device with HTML5 Canvas to burn authentic verified date-time stamps and build spec sheets directly into the image.

The platform also includes a robust **Admin Control Center & Cloud Database Hub** featuring administrative authentication, one-click JSON database backups/restores, paddock ledger moderation, and synchronization to remote database hosts (Google Cloud Firestore, Supabase, Custom REST APIs).

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

### 6. 🔐 Admin Control Center & Database Hub
- **Administrative Authentication**: Secure role-based access for paddock directors and system administrators with persistent session handling.
- **Full Database JSON Backup**: Instant export of all paddock runs, driver profiles, build modifications, and coffee tallies into timestamped JSON backup files.
- **Database Restore & Ingestion**: Restore from backups or merge new datasets with integrity and duplicate verification.
- **Multi-Cloud Host Synchronization**: Upload and replicate local data to Google Cloud Firestore, Supabase (PostgreSQL), Custom REST APIs, or local Cloud Sandbox relay.
- **Paddock Ledger Moderation**: Real-time editing, verification toggle, and point recalculations across all recorded vehicle runs.

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

## 🔐 Admin Portal & Database Management

The application features a built-in **Admin Control Center** designed for meet organizers, paddock stewards, and system administrators.

### 1. Accessing the Admin Portal
- Click the **"Admin Portal"** button (shield icon) in the header navigation or the lock button on the Paddock Ledger view.
- A secure authentication modal will prompt for administrator credentials.

### 2. Default Login Credentials

| Field | Value | Notes |
| :--- | :--- | :--- |
| **Username** | `admin` | Case-insensitive |
| **Password** | `paddock2026!` | Can be updated directly inside the Admin Portal Settings |
| **Role** | Paddock Master / Super Admin | Full read, write, export, sync, and delete permissions |

> 💡 **Password Security**: Once logged in, administrators can change the username and password from the Admin Portal. Credentials and session tokens are encrypted and managed via `authService.ts`.

---

### 3. Admin Portal Capabilities

#### 📊 Dashboard & System Telemetry
- **Telemetry Cards**: Real-time count of total logged runs, unique registered drivers, total cups of coffee consumed, and localStorage database footprint.
- **Session Status**: Shows current active session and one-click quick lockout.

#### 🏁 Paddock Ledger Management
- **Search & Filter**: Search runs by driver name, vehicle make/model, car category, or meet venue.
- **Direct Record Editing**: Update vehicle year, model, modifications list, cups count, coffee variety, and stance score in real time.
- **Dynamic Recalculation**: Automatically recalculates total paddock points using the official scoring algorithm upon editing.
- **Status & Moderation**: Toggle `Verified` status badges or purge spam entries with confirmation protection.

#### 💾 Database Backup & Restore
- **Export Backup (`.json`)**: Download a complete, timestamped JSON snapshot (`cars-and-coffee-backup-YYYY-MM-DD.json`) containing:
  - Database schema version
  - ISO timestamp
  - Total record count
  - Full dataset of car runs, mods, coffee logs, and timestamps
- **Restore Database**: Upload any valid `.json` backup file.
  - **Overwrite Mode**: Replaces current database with backup contents (ideal for server migrations).
  - **Merge Mode**: Intelligently deduplicates and merges imported runs with existing entries.
- **Factory Reset**: Re-seed database with default international Cars & Coffee paddock entries.

#### ☁️ Cloud Database Host Synchronization
Administrators can configure live database replication to external database providers of their choice:

| Supported Cloud Host | Required Configuration | Behavior |
| :--- | :--- | :--- |
| **Google Cloud Firestore** | Project ID, Collection Name (`cars_and_coffee_ledger`), Auth Bearer Token | Replicates paddock documents to Google Cloud Firestore NoSQL collections. |
| **Supabase (PostgreSQL)** | Project URL, Table Name, Supabase Anon/Service Key | Pushes records to Supabase PostgreSQL via the REST PostgREST endpoint. |
| **Custom REST API** | Target Endpoint URL (e.g. `https://api.yourdomain.com/v1/runs`), Custom Headers | Dispatches structured JSON payloads (`POST` or `PUT`) to your private backend. |
| **Cloud Sandbox Relay** | None (Built-in simulation) | Safe testing environment to verify payload integrity and simulated network responses. |

**Key Sync Features:**
- **Manual "Upload & Sync Database" button**: Pushes full snapshot to the configured host on demand.
- **Auto-Sync Toggle**: Automatically transmits newly logged Cars & Coffee runs to the remote host whenever a user submits an entry.
- **Live Sync Logs & Diagnostics**: Inspect HTTP response status, synced record count, and timestamp of the latest sync operation.

---

## 🛠️ Tech Stack

- **Framework**: React 19 + TypeScript
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Graphics**: HTML5 Canvas API (client-side image stamping)
- **Database Services**: LocalStorage engine + Cloud Database Sync (Firestore, Supabase, REST)
- **Authentication**: Client-side role-based authentication (`authService.ts`)
- **Bundler**: Vite

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

4. **Access the Admin Portal**:
   - Navigate to the **Paddock Ledger** view.
   - Click **"Admin Portal"** in the top navigation or top right of the ledger.
   - Log in with `admin` / `paddock2026!`.

5. **Build for production**:
   ```bash
   npm run build
   ```

---

## 📄 License & Copyright

Copyright © 2026 Cars & Coffee (`studio2rocks`). All rights reserved.

Distributed under the Apache License, Version 2.0. See [`LICENSE`](LICENSE) for full details.

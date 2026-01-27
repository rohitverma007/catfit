# FitTrack

A comprehensive fitness and workout tracking Progressive Web App (PWA) that runs entirely in your browser. Track calories, weight, gym workouts, and triathlon training — all with offline support and cross-device sync.

## Features

### Calorie Tracking
- Log meals with custom names and calorie values
- Built-in Tim Hortons menu for quick logging
- Daily calorie goal with progress visualization
- Quick-add buttons (100, 200, 300, 500 cal)
- Browse meal history by date

### Weight Tracking
- Log daily weight entries
- Support for kg and lbs with automatic conversion
- Goal weight setting and progress tracking
- Weight history with timestamps

### Gym Workouts
- Start/end workout sessions with automatic timing
- 8 exercise categories: Chest, Back, Shoulders, Biceps, Triceps, Legs, Core, Cardio
- Set tracking with reps and weight
- Special handling for barbell exercises (plate-based increments)
- Cardio logging with time, distance, and calories
- Quick repeat last set functionality
- Complete workout history

### Triathlon Training
- Track swim, bike, and run distances
- Cumulative distance statistics

### Cross-Device Sync
- Generate shareable sync links
- One-click data import from sync URL
- Preview data before importing
- Powered by npoint.io

### Data Management
- Export all data as JSON
- Import from backup files
- Complete data summary dashboard

## Getting Started

No installation or build process required — just open the file in your browser.

### Option 1: Open Directly
```bash
open index.html
```

### Option 2: Local Server (recommended for full PWA features)
```bash
python -m http.server 8000
# Visit http://localhost:8000
```

### Install as PWA

**Android/Chrome:**
1. Open the app in your browser
2. Tap menu (⋮) → "Add to Home screen"

**iOS Safari:**
1. Open the app
2. Tap Share → "Add to Home Screen"

## Tech Stack

- **React 18** — UI framework (via CDN)
- **Tailwind CSS** — Styling
- **Lucide React** — Icons
- **Babel Standalone** — JSX transpilation
- **Service Worker** — Offline support
- **localStorage** — Data persistence
- **npoint.io** — Cross-device sync

## Project Structure

```
catfit/
├── index.html      # Complete React application
├── sw.js           # Service Worker for offline support
├── manifest.json   # PWA configuration
├── icon-192.png    # App icon (small)
└── icon-512.png    # App icon (large)
```

## Browser Support

Works on any modern browser with support for:
- ES6+ JavaScript
- Service Workers
- localStorage API
- Fetch API

Tested on Chrome, Firefox, Safari, and Edge.

## Data Storage

All data is stored locally in your browser's localStorage:
- `meals` — Meal entries with dates
- `calorieGoal` — Daily calorie target
- `weightEntries` — Weight log
- `goalWeight` — Target weight
- `weightUnit` — Preference (kg/lbs)
- `gymSessions` — Completed workouts
- `triSessions` — Triathlon training

## License

MIT

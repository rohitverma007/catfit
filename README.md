<p align="center">
  <img src="./favicon.svg" alt="CatFit Logo" width="120" height="120">
</p>

<h1 align="center">CatFit</h1>

<p align="center">
  <strong>Free, privacy-first fitness tracker that works offline.</strong><br>
  Count calories. Log workouts. Track weight. Train for triathlons.
</p>

<p align="center">
  <a href="https://www.catfitapp.com/">Website</a> &middot;
  <a href="https://www.catfitapp.com/">Launch App</a> &middot;
  <a href="https://www.vayuapps.com/">Built by Vayu Apps</a>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-2.0-purple" alt="Version 2.0">
  <img src="https://img.shields.io/badge/license-MIT-blue" alt="License MIT">
  <img src="https://img.shields.io/badge/PWA-enabled-brightgreen" alt="PWA Enabled">
  <img src="https://img.shields.io/badge/offline-ready-success" alt="Offline Ready">
  <img src="https://img.shields.io/badge/price-free-orange" alt="Free">
</p>

---

## Screenshots

<table>
  <tr>
    <td align="center"><strong>Workout Logging</strong></td>
    <td align="center"><strong>Calorie Tracking</strong></td>
    <td align="center"><strong>Weight Tracking</strong></td>
    <td align="center"><strong>Analytics Dashboard</strong></td>
  </tr>
  <tr>
    <td><img src="https://catfit.app/og-image.png" alt="CatFit Workout Logging" width="250"></td>
    <td><img src="https://catfit.app/screenshot.png" alt="CatFit Calorie Tracking" width="250"></td>
    <td><img src="https://catfit.app/og-image.png" alt="CatFit Weight Tracking" width="250"></td>
    <td><img src="https://catfit.app/og-dashboard.png" alt="CatFit Analytics Dashboard" width="250"></td>
  </tr>
</table>

> Visit **[catfitapp.com](https://www.catfitapp.com/)** to try the live app instantly in your browser.

---

## What is CatFit?

CatFit is a Progressive Web App (PWA) built to be the simplest, most private fitness tracker available. It runs entirely in your browser with **zero backend** — all your data stays on your device, never touches a server, and never requires an account.

Originally designed for the **Cat S22 Flip** dumbphone, CatFit works on any device with a browser: phones, tablets, desktops, and even feature phones with D-pad navigation.

**Built with care by [Vayu Apps](https://www.vayuapps.com/)** — crafting lightweight, privacy-respecting mobile experiences.

---

## Features

### Calorie Tracking
- Log meals with calorie counts throughout the day
- Built-in **Tim Hortons menu database** with 80+ items for quick logging
- Custom meal entry with name and calorie amount
- Daily calorie goal with visual progress tracking
- Running daily total displayed in real time

### Gym Workout Logging
- Comprehensive exercise database organized by muscle group:
  **Chest** | **Back** | **Shoulders** | **Biceps** | **Triceps** | **Legs** | **Core** | **Cardio**
- Log sets with reps and weight for each exercise
- Automatic **1RM (one-rep max) calculation** using the Epley formula
- Barbell plate calculator with quick-add buttons (45, 25, 10, 5, 2.5 lb)
- Cardio logging with duration and calories burned
- Full workout history with session details

### Triathlon Training
- Dedicated tracking for **swim**, **bike**, and **run** sessions
- Log distance, duration, and calories for each discipline
- Monitor training volume across all three sports

### Weight Tracking
- Record daily or weekly weigh-ins
- Set a goal weight and track progress toward it
- Support for both **kg** and **lbs**
- Visual weight trend chart

### Analytics Dashboard
- **Strength progress charts** — track how your lifts improve over time
- **Volume trends** — see total training volume by week/month
- **Personal records** — automatic PR tracking for every exercise
- **Muscle group distribution** — visualize training balance
- **Recovery monitoring** — see which muscle groups need rest
- **Workout timeline** — browse your complete training history
- Drag-and-drop data import for analysis

### Privacy & Offline
- **100% local storage** — data never leaves your device
- **No account required** — open and start tracking immediately
- **Works offline** — full functionality without internet after first load
- **No ads, no tracking, no subscriptions** — completely free
- **Export/import** your data as JSON for backup and portability

### Accessibility
- **D-pad keyboard navigation** for dumbphones and feature phones
- High-visibility focus indicators for keyboard users
- On-screen navigation hints
- Responsive design from 240px flip phones to desktop monitors

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| **UI Framework** | React 18 |
| **Styling** | Tailwind CSS |
| **Charts** | Chart.js with date-fns adapter |
| **Transpilation** | Babel (standalone, in-browser) |
| **Offline** | Service Worker (network-first caching) |
| **Storage** | localStorage (client-side only) |
| **Hosting** | Static files — no server required |

The entire application is contained in two HTML files with zero build step. No Node.js, no bundler, no package manager needed.

---

## Getting Started

### Use the Live App

The fastest way to start is the hosted version:

**[www.catfitapp.com](https://www.catfitapp.com/)**

You can install it as a standalone app from your browser's "Add to Home Screen" option.

### Run Locally

```bash
# Clone the repository
git clone https://github.com/rohitverma007/catfit.git
cd catfit

# Serve with any static HTTP server
python3 -m http.server 8000
# or
npx http-server -p 8000
```

Then open [http://localhost:8000](http://localhost:8000) in your browser.

> **Note:** A local HTTP server is needed (rather than opening index.html directly) because the Service Worker requires a secure context or localhost to register.

### Install as PWA

1. Open **[catfitapp.com](https://www.catfitapp.com/)** in Chrome, Safari, or Firefox
2. Tap the browser menu (three dots or share icon)
3. Select **"Add to Home Screen"** or **"Install App"**
4. CatFit now launches like a native app with offline support

---

## Project Structure

```
catfit/
├── index.html            # Main fitness tracker app (React SPA)
│                         #   - Calorie tracking tab
│                         #   - Weight tracking tab
│                         #   - Gym workout logging tab
│                         #   - Settings & data management tab
│
├── dashboard.html        # Analytics dashboard (standalone page)
│                         #   - Strength progress charts
│                         #   - Personal records
│                         #   - Recovery monitoring
│                         #   - Muscle group analysis
│
├── sw.js                 # Service Worker for offline caching
├── manifest.json         # PWA manifest (app name, icons, shortcuts)
│
├── favicon.svg           # App icon (cat + dumbbell SVG)
├── icon-192.png          # PWA icon 192x192
├── icon-512.png          # PWA icon 512x512
├── safari-pinned-tab.svg # Safari pinned tab icon
├── browserconfig.xml     # Windows tile configuration
│
├── robots.txt            # Search engine crawler rules
├── sitemap.xml           # XML sitemap for SEO
└── sitemap.html          # HTML sitemap
```

---

## How It Works

### Data Storage

All data is stored in the browser's `localStorage`. Nothing is ever sent to a server. The data structure includes:

- **Meal logs** — food name, calories, timestamp
- **Weight entries** — weight value, unit, date
- **Gym sessions** — exercises with sets/reps/weight, session timestamp
- **Triathlon sessions** — discipline, distance, duration, calories
- **Goals** — daily calorie target, goal weight
- **Preferences** — weight unit (kg/lbs)

### Offline Support

CatFit uses a Service Worker with a **network-first** caching strategy:

1. On first visit, core assets are cached locally
2. Subsequent visits try the network first, falling back to cache
3. The app remains fully functional without any internet connection

### Keyboard Navigation (Dumbphone Support)

For devices without a touchscreen (like the Cat S22 Flip), CatFit implements full D-pad navigation:

- **Arrow keys** — move focus between interactive elements
- **Enter** — activate buttons, submit forms
- **Number keys** — switch between tabs (1-4)
- Visual focus ring highlights the currently selected element

---

## Data Management

### Export Your Data

Go to the **Settings** tab and tap **Export Data**. Your complete fitness history downloads as a JSON file that you can back up anywhere.

### Import Data

In **Settings**, use **Import Data** to load a previously exported JSON file. The analytics dashboard also supports drag-and-drop import for analysis.

### Clear Data

The **Settings** tab includes a **Clear All Data** option with confirmation to reset everything.

---

## Deployment

CatFit is a static site — deploy it anywhere:

| Platform | Command / Method |
|----------|-----------------|
| **GitHub Pages** | Push to `gh-pages` branch |
| **Netlify** | Drag-and-drop the folder or connect repo |
| **Vercel** | `vercel --prod` |
| **Cloudflare Pages** | Connect repo, build command: (none) |
| **Any HTTP server** | Copy files to document root |

No build step, no environment variables, no configuration needed.

---

## About

CatFit is developed and maintained by **[Vayu Apps](https://www.vayuapps.com/)**, a studio focused on building lightweight, privacy-respecting applications that work for everyone — including users on low-end and feature phone devices.

- **App**: [www.catfitapp.com](https://www.catfitapp.com/)
- **Developer**: [www.vayuapps.com](https://www.vayuapps.com/)
- **Twitter**: [@catfitapp](https://twitter.com/catfitapp)

---

## Contributing

Contributions are welcome. To get started:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/my-feature`)
3. Make your changes (no build step needed — just edit the HTML files)
4. Test locally with a static HTTP server
5. Submit a pull request

Since CatFit has no build tooling, contributing is as simple as editing HTML, CSS, and JavaScript.

---

## License

MIT License. See [LICENSE](LICENSE) for details.

---

<p align="center">
  <sub>Built with care by <a href="https://www.vayuapps.com/">Vayu Apps</a></sub>
</p>

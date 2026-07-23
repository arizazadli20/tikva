# TIKVA — Mission Control Dashboard

> Early Detection & Circular Recovery of Port Oil Spills

A live pitch-demo dashboard for the TIKVA satellite-and-AI concept. Visualises the full three-stage pipeline—**Detect → Collect → Convert**—using realistic mock data that is structured to be swapped for a real API with a single-file change.

---

## Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

> Tested on Node 18+. No environment variables or API keys required.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) + TypeScript |
| Styling | Tailwind CSS v4 |
| Map | react-leaflet v5 + OpenStreetMap (no API key) |
| Charts | recharts |
| Data | Local `mock-data.ts` — zero backend |

---

## Dashboard Sections

1. **Header** — TIKVA wordmark, port selector (Baku / Sumgait / Alyat), pulsing Live badge
2. **Pipeline Banner** — Stage 01 Detection → 02 Collection → 03 Conversion
3. **Detection Map** — Leaflet map centred on the selected port, pulsing markers for each spill detection, translucent extent polygons, rich popup (confidence %, area, latency, status)
4. **Mission KPIs** — 3 cards: Detection Accuracy (≥85%), Alert Latency (<30 min), Conversion Rate (≥60%) with animated progress bars
5. **Activity Feed** — Reverse-chronological event log with colour-coded type icons
6. **Circular Recovery Tracker** — Stacked bar chart: bitumen modifier + activated carbon + pending conversion
7. **Detection History Table** — All 10 pilot events with sortable columns

---

## Going Production-Ready

**One file to replace:** `lib/mock-data.ts`

The file exports a single `mockData` object with typed arrays for `ports`, `detections`, `activityLog`, `conversionLog`, and a `kpis` object. In production, replace this module with one that fetches from your backend:

```ts
// lib/mock-data.ts  →  lib/live-data.ts (same export shape)
export const mockData = await fetchFromBackend("/api/dashboard");
```

The backend would need to:
1. Pull new **Sentinel-1 scenes** from ESA/Copernicus
2. Run the **detection model** (SAR-based oil spill classifier)
3. Cross-reference **AIS ship positions** and wind data to filter false positives
4. Serve the aggregated result in the same TypeScript shape defined in `lib/mock-data.ts`

No component code changes required.

---

## Project Structure

```
tikva/
├── app/
│   ├── layout.tsx          # Root layout + SEO metadata
│   ├── page.tsx            # Main dashboard page (assembles all components)
│   └── globals.css         # Dark theme, animations, Leaflet overrides
├── components/
│   ├── Header.tsx          # Wordmark, port selector, live badge
│   ├── MapPanel.tsx        # Leaflet map, markers, popups
│   ├── KpiCards.tsx        # 3 mission KPI cards
│   ├── ActivityFeed.tsx    # Event log
│   ├── ConversionTracker.tsx # Recharts stacked bar + summary
│   └── HistoryTable.tsx    # Detection history table
└── lib/
    └── mock-data.ts        # ← REPLACE THIS for production
```

---

## Pilot Phase Targets

| Metric | Target | Current (Mock) |
|---|---|---|
| Detection Accuracy | ≥ 85% | 87.4% ✅ |
| Alert Latency | < 30 min | 18 min ✅ |
| Sorbent Conversion Rate | ≥ 60% | 63% ✅ |

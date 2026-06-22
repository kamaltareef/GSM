# GSM Manager Platform

Manager dashboard for the GSM (Gas Station Management) system, built on [Base44](https://base44.app).

**Live app:** https://gsm-manager-platform.base44.app 
**Base44 App ID:** `69e3d035d867f93482a9044b`

## Overview

This platform serves station managers (SUC-19) and provides:

- **Dashboard** (SUC-7) — real-time station data: fuel levels, charging stations, alerts
- **Price management** (SUC-4) — update fuel prices, push to digital signs
- **Statistical reports** (SUC-8) — consumption, sales, and historical trends
- **Inventory monitoring** (SUC-11) — IoT fuel sensors, store inventory, auto purchase orders
- **Service tickets** (SUC-12) — equipment faults, technician dispatch
- **Employee management** (SUC-15) — accounts, shifts, scheduling
- **Audit log** (SUC-17) — secure log of all sensitive operations

## Tech stack

- **React 18** + **Vite** — SPA build tooling
- **Tailwind CSS** + **shadcn/ui** — styling & component library
- **TanStack React Query** — server state management
- **Framer Motion** — animations
- **Recharts** — dashboard charts
- **Moment.js** — date formatting (Hebrew locale)
- **Base44 SDK** — backend-as-a-service (entities, auth)

## Project structure

```
manager-platform/
├── src/
│   ├── api/                    # Base44 SDK client
│   │   └── base44Client.js
│   ├── components/
│   │   ├── dashboard/          # Dashboard widgets
│   │   │   ├── ChargingStationCard.jsx
│   │   │   ├── RecentTransactions.jsx
│   │   │   ├── RevenueChart.jsx
│   │   │   ├── StatCard.jsx
│   │   │   └── TankLevelCard.jsx
│   │   ├── layout/             # App shell
│   │   │   ├── AppLayout.jsx
│   │   │   ├── FuelAlertBanner.jsx
│   │   │   ├── Sidebar.jsx
│   │   │   └── TopBar.jsx
│   │   ├── shared/             # Reusable components
│   │   │   ├── EmptyState.jsx
│   │   │   └── StatusBadge.jsx
│   │   ├── staff/              # Employee & shift management
│   │   │   ├── EmployeeList.jsx
│   │   │   ├── ShiftScheduler.jsx
│   │   │   └── WeeklyCalendar.jsx
│   │   ├── ui/                 # shadcn/ui components (~40 files)
│   │   ├── ProtectedRoute.jsx
│   │   └── UserNotRegisteredError.jsx
│   ├── hooks/
│   │   ├── use-mobile.jsx
│   │   └── useAuditLog.js
│   ├── lib/
│   │   ├── app-params.js
│   │   ├── AuthContext.jsx
│   │   ├── PageNotFound.jsx
│   │   ├── query-client.js
│   │   └── utils.js
│   ├── pages/                  # 13 route pages
│   │   ├── AuditLog.jsx
│   │   ├── Charging.jsx
│   │   ├── Dashboard.jsx
│   │   ├── Fuel.jsx
│   │   ├── Inventory.jsx
│   │   ├── Maintenance.jsx
│   │   ├── Orders.jsx
│   │   ├── Profile.jsx
│   │   ├── PurchaseOrders.jsx
│   │   ├── Reports.jsx
│   │   ├── Settings.jsx
│   │   ├── Staff.jsx
│   │   └── Stations.jsx
│   ├── App.jsx
│   ├── main.jsx
│   └── index.css
├── schemas/                    # Entity data models (14 JSON schemas)
├── data/                       # Sample entity records (exported from Base44)
├── package.json
├── vite.config.js
├── tailwind.config.js
├── postcss.config.js
├── eslint.config.js
├── jsconfig.json
├── components.json
└── README.md
```

## Related platforms

| Platform | Repository | Technology |
|----------|-----------|------------|
| Manager  | `manager-platform/` (this folder) | Base44 (no-code) |
| Employee | `worker-platform/` | Web app |
| Customer | (planned) | Flutter mobile app |

## Testing

Unit tests use [Vitest](https://vitest.dev) + jsdom and live in `tests/`:

```bash
npm test
```

| File | Covers |
|---|---|
| `utils.test.js` | `cn()` class-name merging (clsx + tailwind-merge conflict resolution) |
| `createPageUrl.test.js` | `createPageUrl()` route-slug generation |

8 tests, all passing.

## Team

- כמאל טריף (212009492)
- עלי תילאוי (323829119)
- מריה מטר (214655508)
- אדהם ספדי (021549134)
- ג'זל אבו שבלי (326333176)

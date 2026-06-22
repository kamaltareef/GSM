# GSM Employee Platform — פלטפורמת עובדים

A mobile-first employee management platform for GSM gas stations, built with **Next.js 15** and **TypeScript**. Supports two roles: **Store Employee** and **Robotics Technician**, with a full Hebrew RTL interface.

---

## Features

| Screen | Description |
|---|---|
| **Login** | Username/password login with role selector and biometric button |
| **Home Dashboard** | Shift status, quick-action cards, live connection indicator |
| **Clock In / Out** | Live timer, shift history, early clock-in warning sent to manager |
| **Pending Orders** | Real-time order list with status chips and mark-ready action |
| **Order Detail** | License plate recognition, item checklist, delivery confirmation |
| **My Shifts** | Weekly calendar view, shift swap request form |
| **Service Call** | Technician fault card, tools list, acknowledge → resolve flow |
| **Profile** | Personal details, employment info, logout |

---

## Technologies

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Heebo** font (Google Fonts) — full Hebrew support
- CSS with RTL layout (`dir="rtl"`)

---

## Project Structure

```
gsm-employee-platform/
├── app/
│   ├── layout.tsx          # Root layout — sets lang="he" dir="rtl", loads Heebo font
│   ├── page.tsx            # Entry page — renders the App component
│   └── globals.css         # Global styles (phone shell, cards, badges, buttons)
├── components/
│   ├── App.tsx             # Main router — manages screen state and navigation
│   ├── BottomNav.tsx       # 4-tab bottom navigation bar with order badge
│   ├── Icon.tsx            # SVG icon library
│   ├── StatusBar.tsx       # Live clock + signal/battery status bar
│   └── screens/
│       ├── LoginScreen.tsx
│       ├── HomeScreen.tsx
│       ├── ClockScreen.tsx
│       ├── OrdersScreen.tsx
│       ├── OrderDetailScreen.tsx
│       ├── ShiftsScreen.tsx
│       ├── ServiceCallScreen.tsx
│       └── ProfileScreen.tsx
└── lib/
    └── data.ts             # Typed data constants — orders, shifts, service calls
```

---

## How to Run

### Prerequisites
- [Node.js 18 or later](https://nodejs.org) — download and install if not already installed
- npm (comes with Node.js)

### Installation

```bash
# 1. Clone the repository
git clone https://github.com/kamaltareef/GSM.git

# 2. Navigate into the worker platform folder
cd GSM/worker-platform

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser — the app loads immediately, no login credentials required.

### Build for Production

```bash
npm run build
npm start
```

---

## How to Use

1. **Open the app** — you see the login screen inside a phone frame
2. **Select a role:**
   - `עובד חנות` (Store Employee) — access orders, clock in/out, shifts
   - `טכנאי רובוטיקה` (Technician) — access service calls
3. **Click "כניסה למערכת"** (Login) or tap the fingerprint icon
4. **Navigate** using the bottom tab bar:
   - 🏠 Home — shift status and quick actions
   - 📋 Orders — view and manage active orders
   - 📅 Shifts — weekly schedule and swap requests
   - 👤 Profile — personal and employment details

---

## Key Components

### `App.tsx` — Navigation Router
Manages the current screen using `useState`. Handles role-based routing (technician lands on Service Call, employee lands on Home).

### `ClockScreen.tsx` — Attendance Management
- Live clock ticking every second
- Shift timer counts up from 0 after clock-in
- Detects early clock-in (before 07:00) and shows a manager-alert warning
- Saves completed shifts to history with in/out times and duration

### `OrdersScreen.tsx` — Order Management
- Displays orders with color-coded status badges
- "Mark Ready" button updates order status in real time
- Order badge count updates across the bottom nav and home screen

### `ShiftsScreen.tsx` — Shift Scheduling
- Weekly calendar showing shift days highlighted
- Swap request form with shift selector and approval-pending state

### `ServiceCallScreen.tsx` — Technician Workflow
- Shows active fault with location and required tools
- Two-step flow: Acknowledge → Resolve with notes
- Call history with resolution times

---

## Color System

| Color | Hex | Usage |
|---|---|---|
| Navy | `#1A365D` | Primary brand, headers, text |
| Green | `#38A169` | Active states, success, clock-in |
| Red | `#E53E3E` | Urgent, clock-out, errors |
| Orange | `#DD6B20` | Warnings (early clock-in) |

---

## Testing

Unit tests use [Vitest](https://vitest.dev) and live in `tests/`:

```bash
npm test
```

| File | Covers |
|---|---|
| `data.test.ts` | Invariants of the sample data (`ORDERS_DATA`, `SHIFTS_DATA`, `SERVICE_CALLS`, `CALL_HISTORY`) |
| `db.success.test.ts` | `subscribeOrders`, `setOrderStatus` with Firebase connected |
| `db.fallback.test.ts` | Same functions when Firebase isn't configured (no-op fallbacks) |

10 tests, all passing.

---

## Assignment

This component was submitted as part of the GSM System project.

- **GitHub Repository:** https://github.com/kamaltareef/GSM
- **Assignment Link:** https://classroom.github.com/a/BdPS5veC
- **Student:** Kamal Tareef

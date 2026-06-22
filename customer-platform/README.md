# GSM Customer Platform — אפליקציית לקוחות

The customer-facing mobile app for the **GSM (Gas Station Management)** system, built with **Next.js 15** and **TypeScript**. A full Hebrew RTL experience covering the entire customer journey from the User Story: autonomous fueling, EV charging, and in-car convenience-store orders.

This is the **Customer Platform** — one of the three GSM platforms (Management, Customer, Employee).

---

## User Story Coverage

Every requirement of the customer platform from the GSM User Story is implemented:

- **ALPR (license-plate recognition)** — the station camera identifies the vehicle on arrival and greets the customer.
- **Automatic fuel-type lock** — the system pulls the correct fuel type from vehicle records and prevents misfueling (a costly, common mistake).
- **Robotic-arm fueling** — the customer sets a max amount, confirms, and watches the robotic arm fuel the car live, all from the driver's seat.
- **Encrypted payment** — charging happens automatically in the background, tokenized (PCI-DSS).
- **EV charging** — the app routes EV drivers to a free fast charger and tracks the charge live.
- **Convenience upsell** — during charging/fueling the app offers coffee + pastry, and the order is delivered to the car window (handed off to the Employee Platform).

---

## Screens (18)

| # | Screen | Description |
|---|--------|-------------|
| 01 | Splash | Brand intro, start / existing-account entry |
| 02 | Register | Sign-up with validated Israeli ID, phone, email |
| 03 | Onboarding | Add vehicle by plate, auto fuel-detect, payment |
| 04 | Home | Wallet card, quick actions, nearest station, offers |
| 05 | Arrival (ALPR) | Plate detected on entry, start fueling sheet |
| 06 | Fuel setup | Max-amount slider + presets, payment method |
| 07 | Fuel live | Robotic-arm hero, live progress, step timeline |
| 08 | Receipt | Itemized fuel receipt + loyalty points |
| 09 | EV map | Find an available fast charger on the map |
| 10 | EV live | Charge progress, power graph, coffee upsell |
| 11 | EV receipt | Charging summary receipt |
| 12 | Store | Convenience order, delivered to car window |
| 13 | Order track | Live order-status timeline |
| 14 | History | Monthly summary + transaction list |
| 15 | Wallet | GSM+ balance, top-up, add card, payment methods |
| 16 | Profile | Vehicles + app settings |
| 17 | Map | All nearby GSM stations with filters |
| 18 | Notifications | Activity feed, each item deep-links to a screen |

---

## Features

- **3 brand themes** — שקיעה (Sunset), חצות (Midnight / dark), ממותג (Branded) — switchable from the on-screen settings panel.
- **3 fueling hero visuals** — illustration (robotic arm + car), photo placeholder, live-cam HUD.
- Rendered inside an **Android (Material 3) device frame**, full RTL Hebrew.
- Self-navigating app flow; a screen picker is provided for quick review/grading.

---

## Technologies

- **Next.js 15** (App Router)
- **React 19**
- **TypeScript**
- **Heebo** + **JetBrains Mono** fonts (Google Fonts)
- CSS with RTL layout (`dir="rtl"`)

---

## Project Structure

```
customer-platform/
├── app/
│   ├── layout.tsx          # Root layout — lang="he" dir="rtl", loads fonts
│   ├── page.tsx            # Entry page — renders <App />
│   └── globals.css         # Global styles, animations, slider thumb
├── components/
│   ├── App.tsx             # Root: state, device frame, screen router, settings
│   ├── AndroidDevice.tsx   # Material 3 device frame (status bar, gesture nav)
│   ├── Icons.tsx           # SVG icon library
│   ├── primitives.tsx      # Pill, Button, Card, StatTile, TabBar, TopBar, Section
│   ├── Hero.tsx            # 3 fueling hero variants
│   └── screens/            # All 18 screen components
└── lib/
    └── theme.ts            # Brand themes, types, helpers
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

# 2. Navigate into the customer platform folder
cd GSM/customer-platform

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

1. **Open the app** — the splash screen appears inside an Android phone frame.
2. **Walk the flow:** Start → Register (try ID `000000018` or any valid Israeli ID) → Onboarding → Home.
3. **Try the journeys:**
   - **Fueling:** Home → "הגעה לתחנה" → Arrival (ALPR) → Fuel setup → Fuel live → Receipt.
   - **EV:** Home → "טעינה חשמלית" → EV map → EV live → EV receipt.
   - **Store:** Home → "חנות נוחות" → add items → Order track.
4. **Jump anywhere** using the screen picker above the phone.
5. **Switch themes / hero visuals** via the "הגדרות תצוגה" button (top-left).

---

## Testing

Unit tests use [Vitest](https://vitest.dev) and live in `tests/`:

```bash
npm test
```

| File | Covers |
|---|---|
| `theme.test.ts` | `ils()` currency formatting, `GSM_THEMES` / `HE_FONT` / `MONO_FONT` |
| `db.success.test.ts` | `createOrder`, `recordTransaction` with Firebase connected |
| `db.fallback.test.ts` | Same functions when Firebase isn't configured (no-op, returns `null`) |

14 tests, all passing.

---

## Assignment

This component was submitted as part of the GSM System project.

- **GitHub Repository:** https://github.com/kamaltareef/GSM
- **Assignment Link:** https://classroom.github.com/a/BdPS5veC
- **Student:** Kamal Tareef

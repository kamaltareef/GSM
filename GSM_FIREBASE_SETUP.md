# GSM — Connecting the Three Platforms to One Firebase Database

This guide connects all three GSM platforms to a **single shared Firebase (Firestore) database**, so data flows between them:

```
   Customer App  ──┐   places store orders, logs fuel/EV sales
   Employee App  ──┼──►  ONE Firestore database  ◄── prepares orders, updates status
   Manager App   ──┘   reads sales/inventory, sets prices
   (Base44)
```

**Example of the connection working:** a customer confirms a coffee order in the Customer app → it appears instantly in the Employee app's "orders" screen → the employee marks it *ready* → the status updates back in the Customer app. Every fuel/EV sale is also logged for the Manager dashboard.

---

## Step 1 — Create the Firebase project (~5 min, in the browser)

1. Go to **https://console.firebase.google.com** and click **Add project**. Name it `gsm-system`.
2. In the left menu open **Build → Firestore Database → Create database**.
3. Choose **Start in test mode** (open read/write while developing — we lock it down in Step 6), pick a location, and click **Enable**.
4. Click the **gear icon → Project settings**. Scroll to **Your apps**, click the **web icon `</>`**, register an app named `gsm-web`.
5. Firebase shows a `firebaseConfig` object. **Keep this tab open** — you'll copy these values next.

---

## Step 2 — Configure the Customer and Employee apps

In **both** `customer-platform/` and `worker-platform/` folders:

1. Make a copy of `.env.local.example` and rename it to **`.env.local`**.
2. Fill in the values from your `firebaseConfig` (Step 1.5):

```
NEXT_PUBLIC_FIREBASE_API_KEY=AIza...
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=gsm-system.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=gsm-system
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=gsm-system.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=1234567890
NEXT_PUBLIC_FIREBASE_APP_ID=1:1234567890:web:abc123
```

> Use the **same** values in both apps — that's what makes them share one database.
> Without `.env.local`, the apps still run, but with local sample data only (not connected).

---

## Step 3 — Seed sample data (optional but recommended)

From the `customer-platform/` folder, after creating its `.env.local`:

```bash
npm install
node scripts/seed.mjs
```

This adds a few sample orders, transactions, and a station to Firestore so the apps aren't empty.

---

## Step 4 — Run it and see the connection

Open two terminals:

```bash
# Terminal 1 — Customer app
cd customer-platform && npm install && npm run dev      # http://localhost:3000

# Terminal 2 — Employee app
cd worker-platform && npm install && npm run dev -- -p 3001   # http://localhost:3001
```

Now: in the **Customer app**, go to **חנות נוחות** (store), add items, and tap **אשר הזמנה**. Switch to the **Employee app** → the new order appears in the orders list. Mark it ready — done, that's two platforms on one database. 🎉

---

## Step 5 — Connect the Manager app (Base44)

Your Manager app lives on Base44. Point it at the **same** Firestore project. Two ways — use whichever Base44 supports in your plan:

### Option A — Firebase SDK in the Base44 app (simplest)
In the Base44 editor, add the `firebase` package and initialize it with the **same** `firebaseConfig`, then read/write the shared collections:

```js
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, getDocs, addDoc } from 'firebase/firestore';

const db = getFirestore(initializeApp(firebaseConfig)); // same config as the other apps

// Manager reads all sales for the dashboard:
const sales = await getDocs(collection(db, 'fuelTransactions'));

// Manager updates a fuel price:
await addDoc(collection(db, 'stations'), { name: 'GSM רוטשילד 04', fuelPrice: 7.2 });
```

### Option B — Firestore REST API from a Base44 backend function
If you can't add packages, call the Firestore REST API from a Base44 backend function:

```
GET  https://firestore.googleapis.com/v1/projects/gsm-system/databases/(default)/documents/fuelTransactions?key=YOUR_API_KEY
POST https://firestore.googleapis.com/v1/projects/gsm-system/databases/(default)/documents/orders?key=YOUR_API_KEY
```

---

## Step 6 — Lock down security (before submitting / going live)

In **Firestore → Rules**, replace test mode with basic rules. A simple starting point that allows signed-in access:

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;   // require login
    }
  }
}
```

For a graded demo you can keep test mode (`allow read, write: if true;`), but mention in your report that production would use authenticated rules.

---

## Shared database schema (collections)

| Collection | Written by | Read by | Fields |
|---|---|---|---|
| `orders` | Customer | Employee, Manager | `items[]` (name, qty), `total`, `status` (pending/preparation/ready/delivered), `plate`, `station`, `time`, `source`, `createdAt` |
| `fuelTransactions` | Customer | Manager | `plate`, `station`, `type` (fuel/ev), `amount`, `quantity` (L or kWh), `createdAt` |
| `stations` | Manager | Customer, Employee | `name`, `address`, `fuelPrice`, `evPrice`, `pumpsFree`, `evFree`, `updatedAt` |
| `vehicles` | Customer, Manager | all | `ownerName`, `plate`, `fuelType`, `model`, `ev` |
| `shifts` | Employee, Manager | Employee, Manager | `employeeId`, `day`, `date`, `start`, `end`, `station` |

The Customer and Employee apps already use `orders`, `fuelTransactions`, and `stations`. Add the rest the same way as your project grows.

---

## How the code is wired (for your report)

- `lib/firebase.ts` — initializes Firebase from the env vars; exports `db` (or `null` if unconfigured).
- `lib/db.ts` — the data-access functions every screen uses:
  - **Customer:** `createOrder()`, `recordTransaction()`
  - **Employee:** `subscribeOrders()` (live updates), `setOrderStatus()`
- Screens call these functions instead of holding hardcoded data, so all reads/writes hit the one shared database.

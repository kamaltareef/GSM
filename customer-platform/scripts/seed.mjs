// Seeds the shared GSM Firestore database with sample data.
//
// Usage (from the customer-platform folder, after filling in .env.local):
//   node scripts/seed.mjs
//
// Requires Firestore rules to allow writes (test mode is fine while developing).

import { readFileSync } from 'node:fs';
import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, serverTimestamp } from 'firebase/firestore';

// --- tiny .env.local parser (no extra dependencies) ---
function loadEnv(path) {
  const env = {};
  try {
    for (const line of readFileSync(path, 'utf8').split('\n')) {
      const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
      if (m) env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch {
    console.error('Could not read .env.local — create it from .env.local.example first.');
    process.exit(1);
  }
  return env;
}

const env = loadEnv(new URL('../.env.local', import.meta.url));
const config = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

if (!config.apiKey || !config.projectId) {
  console.error('Missing Firebase config in .env.local');
  process.exit(1);
}

const db = getFirestore(initializeApp(config));

const orders = [
  { items: [{ name: 'קפה שחור', qty: 1 }, { name: 'קרואסון', qty: 2 }], total: 32, status: 'pending', plate: 'ABC-123', station: 'GSM רוטשילד 04', time: '09:14', source: 'customer' },
  { items: [{ name: 'לאטה', qty: 2 }, { name: 'מאפה שוקולד', qty: 1 }], total: 46, status: 'preparation', plate: 'XYZ-789', station: 'GSM רוטשילד 04', time: '09:08', source: 'customer' },
  { items: [{ name: 'אספרסו', qty: 1 }], total: 10, status: 'ready', plate: 'MNP-456', station: 'GSM רוטשילד 04', time: '08:55', source: 'customer' },
];

const transactions = [
  { plate: '52-847-91', station: 'GSM רוטשילד 04', type: 'fuel', amount: 200, quantity: 28 },
  { plate: '77-394-01', station: 'GSM רוטשילד 04', type: 'ev', amount: 51, quantity: 60 },
];

const stations = [
  { name: 'GSM רוטשילד 04', address: 'שדרות רוטשילד, תל אביב', fuelPrice: 7, evPrice: 0.85, pumpsFree: 3, evFree: 2 },
];

async function run() {
  for (const o of orders) await addDoc(collection(db, 'orders'), { ...o, createdAt: serverTimestamp() });
  for (const t of transactions) await addDoc(collection(db, 'fuelTransactions'), { ...t, createdAt: serverTimestamp() });
  for (const s of stations) await addDoc(collection(db, 'stations'), { ...s, updatedAt: serverTimestamp() });
  console.log(`Seeded ${orders.length} orders, ${transactions.length} transactions, ${stations.length} station(s).`);
  process.exit(0);
}

run().catch(e => { console.error(e); process.exit(1); });

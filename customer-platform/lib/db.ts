// Data access for the shared GSM Firestore database.
// All three platforms (Customer, Employee, Manager) read/write these same collections.
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db, firebaseEnabled } from './firebase';

export interface OrderItem {
  name: string;
  qty: number;
}

export interface NewOrder {
  items: OrderItem[];
  total: number;
  plate: string;
  station: string;
}

// Customer places a convenience-store order. It is written to the shared
// `orders` collection, where the Employee platform picks it up to prepare.
export async function createOrder(order: NewOrder): Promise<string | null> {
  if (!db) return null;
  const ref = await addDoc(collection(db, 'orders'), {
    ...order,
    status: 'pending',
    source: 'customer',
    time: new Date().toTimeString().slice(0, 5),
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

// Customer completes a fuel / EV charge. Written to `fuelTransactions`,
// which feeds the Manager platform's dashboard and stats.
export async function recordTransaction(tx: {
  plate: string;
  station: string;
  type: 'fuel' | 'ev';
  amount: number;
  quantity: number; // liters or kWh
}): Promise<string | null> {
  if (!db) return null;
  const ref = await addDoc(collection(db, 'fuelTransactions'), {
    ...tx,
    createdAt: serverTimestamp(),
  });
  return ref.id;
}

export { firebaseEnabled };

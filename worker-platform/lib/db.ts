// Data access for the shared GSM Firestore database.
// The Employee platform reads orders placed by the Customer platform and
// updates their status — all on the same `orders` collection.
import { collection, onSnapshot, query, orderBy, doc, updateDoc } from 'firebase/firestore';
import { db, firebaseEnabled } from './firebase';
import type { Order } from './data';

// Subscribe to live order updates. Returns an unsubscribe function.
// Calls back with the current list of orders whenever the collection changes.
export function subscribeOrders(cb: (orders: Order[]) => void): () => void {
  if (!db) return () => {};
  const q = query(collection(db, 'orders'), orderBy('createdAt', 'desc'));
  return onSnapshot(q, snap => {
    const orders = snap.docs.map(d => {
      const data = d.data() as Omit<Order, 'id'>;
      return { id: d.id, ...data } as Order;
    });
    cb(orders);
  });
}

// Update an order's status (e.g. mark ready / delivered). The change is
// immediately reflected in the Customer platform's order tracking.
export async function setOrderStatus(id: string, status: Order['status']): Promise<void> {
  if (!db) return;
  await updateDoc(doc(db, 'orders', id), { status });
}

export { firebaseEnabled };

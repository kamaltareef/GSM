// Unit tests for lib/db.ts FALLBACK paths (Firebase NOT configured).
// When db is null the functions must not call Firestore and must return null,
// so the app keeps running on local sample data.
import { describe, it, expect, vi } from 'vitest';

const addDocMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  addDoc: (...args: unknown[]) => addDocMock(...args),
  serverTimestamp: vi.fn(),
}));

// Pretend Firebase is NOT configured: db is null.
vi.mock('../lib/firebase', () => ({
  db: null,
  firebaseEnabled: false,
}));

import { createOrder, recordTransaction } from '../lib/db';

describe('db.ts fallback when Firebase disabled', () => {
  it('createOrderReturnsNullWithoutWriting', async () => {
    const id = await createOrder({ items: [], total: 0, plate: 'X', station: 'S' });
    expect(id).toBeNull();
    expect(addDocMock).not.toHaveBeenCalled();
  });

  it('recordTransactionReturnsNullWithoutWriting', async () => {
    const id = await recordTransaction({
      plate: 'X', station: 'S', type: 'ev', amount: 0, quantity: 0,
    });
    expect(id).toBeNull();
    expect(addDocMock).not.toHaveBeenCalled();
  });
});

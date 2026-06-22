// Unit tests for lib/db.ts SUCCESS paths (Firebase enabled).
// firebase/firestore and lib/firebase are mocked so no real network is used.
import { describe, it, expect, vi, beforeEach } from 'vitest';

const addDocMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({ __collection: true })),
  addDoc: (...args: unknown[]) => addDocMock(...args),
  serverTimestamp: vi.fn(() => '__ts__'),
}));

// Pretend Firebase is configured: db is a truthy stand-in object.
vi.mock('../lib/firebase', () => ({
  db: { __fakeDb: true },
  firebaseEnabled: true,
}));

import { createOrder, recordTransaction } from '../lib/db';

describe('createOrder (firebase enabled)', () => {
  beforeEach(() => addDocMock.mockReset());

  it('createOrderReturnsNewId', async () => {
    addDocMock.mockResolvedValue({ id: 'order-123' });
    const id = await createOrder({
      items: [{ name: 'קפה', qty: 1 }],
      total: 12,
      plate: 'ABC-123',
      station: 'תחנה ראשית',
    });
    expect(id).toBe('order-123');
    expect(addDocMock).toHaveBeenCalledTimes(1);
  });

  it('createOrderStampsStatusAndSource', async () => {
    addDocMock.mockResolvedValue({ id: 'order-456' });
    await createOrder({ items: [], total: 0, plate: 'X', station: 'S' });
    const written = addDocMock.mock.calls[0][1];
    expect(written.status).toBe('pending');
    expect(written.source).toBe('customer');
  });
});

describe('recordTransaction (firebase enabled)', () => {
  beforeEach(() => addDocMock.mockReset());

  it('recordTransactionReturnsNewId', async () => {
    addDocMock.mockResolvedValue({ id: 'tx-789' });
    const id = await recordTransaction({
      plate: 'ABC-123',
      station: 'תחנה ראשית',
      type: 'fuel',
      amount: 200,
      quantity: 35,
    });
    expect(id).toBe('tx-789');
    expect(addDocMock).toHaveBeenCalledTimes(1);
  });
});

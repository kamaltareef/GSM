// Unit tests for worker-platform lib/db.ts SUCCESS paths (Firebase enabled).
import { describe, it, expect, vi } from 'vitest';

const onSnapshotMock = vi.fn();
const updateDocMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(() => ({})),
  query: vi.fn(() => ({})),
  orderBy: vi.fn(() => ({})),
  doc: vi.fn(() => ({ __doc: true })),
  onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
  updateDoc: (...args: unknown[]) => updateDocMock(...args),
}));

vi.mock('../lib/firebase', () => ({
  db: { __fakeDb: true },
  firebaseEnabled: true,
}));

import { subscribeOrders, setOrderStatus } from '../lib/db';

describe('subscribeOrders (firebase enabled)', () => {
  it('mapsSnapshotDocsToOrdersAndReturnsUnsubscribe', () => {
    const unsub = vi.fn();
    onSnapshotMock.mockImplementation((_q, handler) => {
      handler({
        docs: [
          { id: 'ORD-1', data: () => ({ items: [], time: '09:00', status: 'pending', plate: 'A' }) },
        ],
      });
      return unsub;
    });

    const received: Array<Array<{ id: string }>> = [];
    const returned = subscribeOrders((orders) => received.push(orders as Array<{ id: string }>));

    expect(received).toHaveLength(1);
    expect(received[0][0].id).toBe('ORD-1');
    expect(returned).toBe(unsub);
  });
});

describe('setOrderStatus (firebase enabled)', () => {
  it('callsUpdateDocWithNewStatus', async () => {
    updateDocMock.mockResolvedValue(undefined);
    await setOrderStatus('ORD-1', 'ready');
    expect(updateDocMock).toHaveBeenCalledTimes(1);
    expect(updateDocMock.mock.calls[0][1]).toEqual({ status: 'ready' });
  });
});

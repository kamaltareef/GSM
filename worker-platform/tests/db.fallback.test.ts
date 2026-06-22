// Unit tests for worker-platform lib/db.ts FALLBACK paths (Firebase disabled).
import { describe, it, expect, vi } from 'vitest';

const onSnapshotMock = vi.fn();
const updateDocMock = vi.fn();

vi.mock('firebase/firestore', () => ({
  collection: vi.fn(),
  query: vi.fn(),
  orderBy: vi.fn(),
  doc: vi.fn(),
  onSnapshot: (...args: unknown[]) => onSnapshotMock(...args),
  updateDoc: (...args: unknown[]) => updateDocMock(...args),
}));

vi.mock('../lib/firebase', () => ({
  db: null,
  firebaseEnabled: false,
}));

import { subscribeOrders, setOrderStatus } from '../lib/db';

describe('worker db.ts fallback when Firebase disabled', () => {
  it('subscribeOrdersReturnsNoopUnsubscribe', () => {
    const cb = vi.fn();
    const unsub = subscribeOrders(cb);
    expect(typeof unsub).toBe('function');
    expect(() => unsub()).not.toThrow(); // calling the no-op is safe
    expect(cb).not.toHaveBeenCalled();
    expect(onSnapshotMock).not.toHaveBeenCalled();
  });

  it('setOrderStatusResolvesWithoutUpdating', async () => {
    await expect(setOrderStatus('ORD-1', 'ready')).resolves.toBeUndefined();
    expect(updateDocMock).not.toHaveBeenCalled();
  });
});

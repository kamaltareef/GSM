// Unit tests for the worker-platform sample-data module (lib/data.ts).
// These guard the shape/invariants the UI relies on.
import { describe, it, expect } from 'vitest';
import { ORDERS_DATA, SHIFTS_DATA, SERVICE_CALLS, CALL_HISTORY } from '../lib/data';

describe('ORDERS_DATA', () => {
  it('isNonEmpty', () => {
    expect(ORDERS_DATA.length).toBeGreaterThan(0);
  });

  it('everyOrderHasValidStatus', () => {
    const allowed = ['pending', 'preparation', 'ready', 'delivered'];
    for (const o of ORDERS_DATA) expect(allowed).toContain(o.status);
  });

  it('everyOrderItemHasPositiveQty', () => {
    for (const o of ORDERS_DATA)
      for (const item of o.items) expect(item.qty).toBeGreaterThan(0);
  });
});

describe('SHIFTS_DATA', () => {
  it('everyShiftHasStartAndEndTime', () => {
    const hhmm = /^\d{2}:\d{2}$/;
    for (const s of SHIFTS_DATA) {
      expect(s.start).toMatch(hhmm);
      expect(s.end).toMatch(hhmm);
    }
  });
});

describe('SERVICE_CALLS / CALL_HISTORY', () => {
  it('serviceCallPriorityIsValid', () => {
    for (const c of SERVICE_CALLS) expect(['urgent', 'normal']).toContain(c.priority);
  });

  it('historyEntriesAreResolved', () => {
    for (const h of CALL_HISTORY) expect(h.status).toBe('resolved');
  });
});

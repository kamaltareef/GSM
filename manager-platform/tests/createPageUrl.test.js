// Unit tests for manager-platform src/utils/index.ts (createPageUrl).
import { describe, it, expect } from 'vitest';
import { createPageUrl } from '../src/utils/index.ts';

describe('createPageUrl()', () => {
  it('prefixesSlashForSingleWord', () => {
    expect(createPageUrl('Dashboard')).toBe('/Dashboard');
  });

  it('replacesSpacesWithDashes', () => {
    expect(createPageUrl('Purchase Orders')).toBe('/Purchase-Orders');
  });

  it('replacesEverySpace', () => {
    expect(createPageUrl('Audit Log Page')).toBe('/Audit-Log-Page');
  });

  it('handlesEmptyString', () => {
    expect(createPageUrl('')).toBe('/');
  });
});

// Unit tests for the customer-platform theme module (lib/theme.ts).
// Covers the ils() currency formatter and the GSM_THEMES design tokens.
import { describe, it, expect } from 'vitest';
import { ils, GSM_THEMES, HE_FONT, MONO_FONT } from '../lib/theme';

describe('ils() currency formatter', () => {
  it('formatsPositiveAmount', () => {
    const out = ils(50);
    expect(out).toContain('50.00');
    expect(out).toContain('₪');
  });

  it('formatsZero', () => {
    expect(ils(0)).toContain('0.00');
  });

  it('keepsTwoDecimals', () => {
    expect(ils(12.5)).toContain('12.50');
  });

  it('addsThousandsSeparator', () => {
    expect(ils(1234.5)).toContain('1,234.50');
  });

  it('roundsToTwoFractionDigits', () => {
    // 2.999 must round up to 3.00 (maximumFractionDigits: 2)
    expect(ils(2.999)).toContain('3.00');
  });

  it('formatsNegativeAmount', () => {
    expect(ils(-7)).toContain('7.00');
    expect(ils(-7)).toMatch(/-/);
  });
});

describe('GSM_THEMES design tokens', () => {
  it('exposesThreeThemes', () => {
    expect(Object.keys(GSM_THEMES).sort()).toEqual(['branded', 'midnight', 'sunset']);
  });

  it('eachThemeHasRequiredTokens', () => {
    const required = ['bg', 'surface', 'ink', 'accent', 'grad', 'success', 'ev'] as const;
    for (const key of Object.keys(GSM_THEMES) as Array<keyof typeof GSM_THEMES>) {
      const theme = GSM_THEMES[key];
      for (const token of required) {
        expect(theme[token]).toBeTruthy();
      }
    }
  });

  it('exposesFontStacks', () => {
    expect(HE_FONT).toContain('Heebo');
    expect(MONO_FONT).toContain('Mono');
  });
});

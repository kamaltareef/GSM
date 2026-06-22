// @vitest-environment jsdom
// Unit tests for manager-platform src/lib/utils.js (cn class-name helper).
// jsdom is required because utils.js reads window.self at import time.
import { describe, it, expect } from 'vitest';
import { cn } from '../src/lib/utils.js';

describe('cn() class-name merge', () => {
  it('joinsMultipleClasses', () => {
    expect(cn('a', 'b')).toBe('a b');
  });

  it('ignoresFalsyValues', () => {
    expect(cn('text-red-500', false, null, undefined, '', 'font-bold')).toBe(
      'text-red-500 font-bold'
    );
  });

  it('dedupesConflictingTailwindClasses', () => {
    // tailwind-merge keeps the last conflicting utility
    expect(cn('p-2', 'p-4')).toBe('p-4');
  });

  it('supportsConditionalObjectSyntax', () => {
    expect(cn('base', { active: true, disabled: false })).toBe('base active');
  });
});

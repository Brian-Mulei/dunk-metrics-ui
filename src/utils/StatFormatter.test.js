import { describe, expect, it } from 'vitest';
import { formatPct, formatStat, getInitials } from './StatFormatter';

describe('StatFormatter', () => {
  it('formats numbers to the given precision', () => {
    expect(formatStat(33.484375)).toBe('33.5');
    expect(formatStat(1.8, 2)).toBe('1.80');
    expect(formatStat(64, 0)).toBe('64');
  });

  it('formats percentages', () => {
    expect(formatPct(61.234)).toBe('61.2%');
  });

  it('shows a dash for missing values', () => {
    expect(formatStat(null)).toBe('–');
    expect(formatStat(undefined)).toBe('–');
    expect(formatPct(Number.NaN)).toBe('–');
  });

  it('builds initials from a name', () => {
    expect(getInitials('Luka Doncic')).toBe('LD');
    expect(getInitials('Nikola Jokić Jr.')).toBe('NJ');
    expect(getInitials('')).toBe('');
  });
});

import { describe, expect, it } from 'vitest';
import { espnSeasonFor, eventsOn, monthGrid } from './SeasonCalendar';

describe('SeasonCalendar', () => {
  it('maps a date to the ESPN season (end year)', () => {
    expect(espnSeasonFor('2026-10-20')).toBe(2027);
    expect(espnSeasonFor('2027-02-11')).toBe(2027);
    expect(espnSeasonFor('2026-07-31')).toBe(2026);
  });

  it('finds events covering a day, inclusive', () => {
    const events = [{ key: 'allStarBreak', start: '2027-02-19', end: '2027-02-24' }, { key: 'tradeDeadline', start: '2027-02-11', end: '2027-02-11' }];
    expect(eventsOn('2027-02-24', events).map((e) => e.key)).toEqual(['allStarBreak']);
    expect(eventsOn('2027-02-11', events).map((e) => e.key)).toEqual(['tradeDeadline']);
    expect(eventsOn('2027-02-12', events)).toEqual([]);
  });

  it('lays a month out Monday-first over six weeks', () => {
    const october = monthGrid(2026, 9);
    expect(october).toHaveLength(42);
    // 1 Oct 2026 is a Thursday
    expect(october.slice(0, 4)).toEqual([null, null, null, '2026-10-01']);
    expect(october.filter(Boolean)).toHaveLength(31);
  });
});

import { describe, expect, it } from 'vitest';
import { byStartTime, formatGameDate, formatGameTime, gameStart, localDateKey } from './GameTime';
import { formatDate } from './DateFormater';

const lateGame = { date: '2026-10-22', startingTime: '02:00:00', startTimeUtc: '2026-10-22T02:00:00Z' };

describe('GameTime', () => {
  it('shows a UTC tip-off in the viewer\'s timezone', () => {
    expect(formatGameTime(lateGame, 'Africa/Nairobi')).toMatch(/5:00/);
    expect(formatGameTime(lateGame, 'America/Los_Angeles')).toMatch(/7:00/);
    expect(formatGameDate(lateGame, 'America/Los_Angeles')).toMatch(/Oct 21/);
    expect(formatGameDate(lateGame, 'Africa/Nairobi')).toMatch(/Oct 22/);
  });

  it('treats responses without startTimeUtc as UTC', () => {
    const old = { date: '2026-10-22', startingTime: '02:00:00' };
    expect(gameStart(old).toISOString()).toBe('2026-10-22T02:00:00.000Z');
  });

  it('sorts by actual start time', () => {
    const early = { startTimeUtc: '2026-10-21T23:30:00Z' };
    expect([lateGame, early].sort(byStartTime)).toEqual([early, lateGame]);
  });

  it('builds the local calendar day, not the UTC day', () => {
    expect(localDateKey(new Date(2026, 9, 19, 0, 30))).toBe('2026-10-19');
  });

  it('reads zone-less news timestamps as UTC', () => {
    expect(formatDate('2026-10-17T19:44:00')).toBe(formatDate('2026-10-17T19:44:00Z'));
  });
});

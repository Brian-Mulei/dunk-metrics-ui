import { describe, expect, it } from 'vitest';
import {
  activeSlipOf, combinedProbability, createSlip, deleteSlip, firstStarted, isExpired, legResult,
  mergeGameUpdates, removeLeg, slipResult, togglePick,
} from './parlays';

const NOW = Date.parse('2026-10-23T20:00:00Z');
const game = (id, startTimeUtc, overrides = {}) => ({
  id, homeTeamId: 1, awayTeamId: 2, homeTeam: 'Home', awayTeam: 'Away', startTimeUtc, status: 'Scheduled', ...overrides,
});
const tonight = game(10, '2026-10-23T23:00:00Z');
const later = game(11, '2026-10-24T01:30:00Z');
const empty = { activeId: null, slips: [] };

describe('togglePick', () => {
  it('starts a slip, then swaps and removes the pick', () => {
    let state = togglePick(empty, tonight, 1, 0.6, NOW);
    expect(state.slips).toHaveLength(1);
    expect(activeSlipOf(state).name).toBe('Slip 1');
    expect(activeSlipOf(state).legs[0]).toMatchObject({ gameId: 10, pickTeamId: 1, probability: 0.6 });

    state = togglePick(state, tonight, 2, 0.4, NOW);
    expect(activeSlipOf(state).legs).toHaveLength(1);
    expect(activeSlipOf(state).legs[0]).toMatchObject({ pickTeamId: 2, probability: 0.4 });

    state = togglePick(state, tonight, 2, 0.4, NOW);
    expect(activeSlipOf(state).legs).toHaveLength(0);
  });

  it('ignores games that already started', () => {
    expect(togglePick(empty, game(12, '2026-10-23T19:00:00Z'), 1, 0.5, NOW)).toBe(empty);
  });

  it('starts a new slip when the active one has expired', () => {
    const state = togglePick(togglePick(empty, tonight, 1, 0.6, NOW), later, 1, 0.5, NOW);
    const afterTip = Date.parse('2026-10-23T23:30:00Z');
    const next = togglePick(state, game(13, '2026-10-24T02:00:00Z'), 2, 0.55, afterTip);

    expect(next.slips).toHaveLength(2);
    expect(activeSlipOf(next).name).toBe('Slip 2');
    expect(activeSlipOf(next).legs.map((l) => l.gameId)).toEqual([13]);
    expect(next.slips[0].legs).toHaveLength(2);
  });
});

describe('expiry', () => {
  const slip = activeSlipOf(togglePick(togglePick(empty, tonight, 1, 0.6, NOW), later, 1, 0.5, NOW));

  it('expires exactly at the first tip-off', () => {
    expect(isExpired(slip, Date.parse('2026-10-23T22:59:59Z'))).toBe(false);
    expect(isExpired(slip, Date.parse('2026-10-23T23:00:00Z'))).toBe(true);
    expect(firstStarted(slip, Date.parse('2026-10-24T02:00:00Z')).gameId).toBe(10);
  });

  it('locks legs on an expired slip', () => {
    const state = { activeId: slip.id, slips: [slip] };
    expect(removeLeg(state, slip.id, 10, Date.parse('2026-10-23T23:30:00Z')).slips[0].legs).toHaveLength(2);
    expect(removeLeg(state, slip.id, 10, NOW).slips[0].legs).toHaveLength(1);
  });
});

describe('results', () => {
  const leg = (overrides) => ({ gameId: 1, pickTeamId: 1, homeTeamId: 1, awayTeamId: 2, startTimeUtc: '2026-10-23T23:00:00Z', probability: 0.5, ...overrides });
  const after = Date.parse('2026-10-24T03:00:00Z');

  it('grades each leg from the picked side', () => {
    expect(legResult(leg(), NOW)).toBe('upcoming');
    expect(legResult(leg(), after)).toBe('live');
    expect(legResult(leg({ status: 'Finished', homeTeamScore: 110, awayTeamScore: 101 }))).toBe('won');
    expect(legResult(leg({ pickTeamId: 2, status: 'Finished', homeTeamScore: 110, awayTeamScore: 101 }))).toBe('lost');
    expect(legResult(leg({ status: 'Postponed' }))).toBe('postponed');
  });

  it('busts on the first loss and hits only when every leg wins', () => {
    const won = leg({ status: 'Finished', homeTeamScore: 100, awayTeamScore: 90 });
    const lost = leg({ gameId: 2, status: 'Finished', homeTeamScore: 90, awayTeamScore: 100 });
    const pending = leg({ gameId: 3, startTimeUtc: '2026-10-24T05:00:00Z' });

    expect(slipResult({ legs: [pending] }, NOW)).toBe('open');
    expect(slipResult({ legs: [won, pending] }, after)).toBe('inPlay');
    expect(slipResult({ legs: [lost, pending] }, after)).toBe('busted');
    expect(slipResult({ legs: [won, leg({ gameId: 4, status: 'Postponed' })] }, after)).toBe('hit');
  });

  it('multiplies leg odds, skipping postponed games', () => {
    expect(combinedProbability({ legs: [leg({ probability: 0.6 }), leg({ probability: 0.5 })] })).toBeCloseTo(0.3);
    expect(combinedProbability({ legs: [leg({ probability: 0.6 }), leg({ probability: null, status: 'Postponed' })] })).toBeCloseTo(0.6);
    expect(combinedProbability({ legs: [leg({ probability: null })] })).toBeNull();
  });
});

describe('slip management', () => {
  it('names new slips after the highest number and moves the active slip on delete', () => {
    let state = createSlip(createSlip(empty, null, NOW), null, NOW);
    expect(state.slips.map((s) => s.name)).toEqual(['Slip 1', 'Slip 2']);
    state = deleteSlip(state, state.activeId);
    expect(activeSlipOf(state).name).toBe('Slip 1');
    expect(createSlip(state, null, NOW).slips.at(-1).name).toBe('Slip 2');
  });

  it('merges scores and only refreshes odds before tip-off', () => {
    const state = togglePick(togglePick(empty, tonight, 1, 0.6, NOW), later, 2, 0.4, NOW);
    const afterTip = Date.parse('2026-10-24T00:00:00Z');
    const merged = mergeGameUpdates(
      state,
      { 10: { status: 'In Progress', homeTeamScore: 50, awayTeamScore: 48 } },
      { 10: { homeTeamId: 1, homeWinProbability: 0.9, awayWinProbability: 0.1 }, 11: { homeTeamId: 1, homeWinProbability: 0.7, awayWinProbability: 0.3 } },
      afterTip,
    );
    const [first, second] = merged.slips[0].legs;
    expect(first).toMatchObject({ status: 'In Progress', homeTeamScore: 50, probability: 0.6 });
    expect(second.probability).toBe(0.3);
  });
});

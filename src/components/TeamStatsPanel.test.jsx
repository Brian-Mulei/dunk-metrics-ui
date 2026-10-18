import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import TeamStatsPanel from './TeamStatsPanel';
import { getTeamStats } from '../apis/apis';
import { luka } from '../test/fixtures';

vi.mock('../apis/apis', () => ({
  getTeamStats: vi.fn(),
  getSeasons: vi.fn(() => Promise.resolve({ data: { seasons: [] } })),
}));

const stats = {
  teamId: 17, seasonLabel: '2025-26', gamesPlayed: 82, wins: 53, losses: 29,
  pointsFor: 116.3, pointsAgainst: 114.6, pointDiff: 1.7, pointsForRank: 11, pointsAgainstRank: 12,
  pointDiffRank: 14, teamsRanked: 30, homeWins: 28, homeLosses: 13, awayWins: 25, awayLosses: 16,
  lastTen: ['W', 'W', 'L'], streak: 'W2',
  leaders: [{ key: 'points', label: 'Points', value: 33.5, format: 'number', player: luka }],
};

describe('TeamStatsPanel', () => {
  beforeEach(() => getTeamStats.mockReset());

  it('renders record, scoring ranks and leaders', async () => {
    getTeamStats.mockResolvedValue({ data: stats });
    const onSelectPlayer = vi.fn();
    render(<TeamStatsPanel teamId="17" onSelectPlayer={onSelectPlayer} />);

    expect(await screen.findByText('53-29')).toBeInTheDocument();
    expect(screen.getByText('W2')).toBeInTheDocument();
    expect(screen.getByText('11th of 30')).toBeInTheDocument();
    expect(screen.getByText('12th of 30')).toBeInTheDocument();
    expect(screen.getByText('+1.7')).toBeInTheDocument();
    expect(screen.getByLabelText('Last 3 games: W W L')).toBeInTheDocument();

    await userEvent.click(screen.getByRole('button', { name: /Luka Doncic/ }));
    expect(onSelectPlayer).toHaveBeenCalledWith(luka);
  });

  it('explains when the season has not started', async () => {
    getTeamStats.mockResolvedValue({ data: { ...stats, seasonLabel: '2026-27', gamesPlayed: 0, leaders: [] } });
    render(<TeamStatsPanel teamId="17" />);

    expect(await screen.findByText(/No regular-season games played yet in 2026-27/)).toBeInTheDocument();
  });
});

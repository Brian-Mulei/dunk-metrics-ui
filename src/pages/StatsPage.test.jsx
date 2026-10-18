import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import StatsPage from './StatsPage';
import { getStatsLeaderboard } from '../apis/apis';

vi.mock('../apis/apis', () => ({
  getStatsLeaderboard: vi.fn(),
  getSeasons: vi.fn(() => Promise.resolve({ data: { current: 2027, seasons: [
    { season: 2026, label: '2025-26' }, { season: 2025, label: '2024-25' },
  ] } })),
}));

const response = {
  data: {
    season: 2026,
    seasonLabel: '2025-26',
    players: [
      {
        espnPlayerId: '3945274', playerId: 963, teamId: 17, teamCode: 'LAL', name: 'Luka Doncic', position: 'G',
        headshotUrl: null, gamesPlayed: 64, minutes: 35.8, points: 33.5, rebounds: 7.7, assists: 8.3,
        trueShootingPct: 62.1, effectiveFieldGoalPct: 56.4, assistToTurnover: 2.1, pointsPer36: 33.7,
        reboundsPer36: 7.7, assistsPer36: 8.4, threePointRate: 0.48,
      },
    ],
  },
};

const renderPage = () => render(<MemoryRouter><StatsPage /></MemoryRouter>);

describe('StatsPage', () => {
  beforeEach(() => {
    getStatsLeaderboard.mockReset();
    getStatsLeaderboard.mockResolvedValue(response);
  });

  it('loads the leaderboard sorted by points', async () => {
    renderPage();
    expect(screen.getByTestId('stats-loading')).toBeInTheDocument();
    expect(await screen.findByText('2025-26 season · Source: ESPN, updated twice a day')).toBeInTheDocument();
    expect(screen.getAllByText('Luka Doncic').length).toBeGreaterThan(0);
    expect(getStatsLeaderboard).toHaveBeenCalledWith({ sort: 'points', teamId: undefined, minGames: 10, size: 50, season: undefined });
  });

  it('re-requests with the clicked column as sort', async () => {
    renderPage();
    const table = await screen.findByRole('table');
    await userEvent.click(within(table).getByRole('button', { name: 'TS%' }));
    await waitFor(() =>
      expect(getStatsLeaderboard).toHaveBeenLastCalledWith(expect.objectContaining({ sort: 'trueShootingPct' }))
    );
  });

  it('filters by team', async () => {
    renderPage();
    await screen.findByRole('table');
    await userEvent.selectOptions(screen.getByLabelText('Team'), '17');
    await waitFor(() =>
      expect(getStatsLeaderboard).toHaveBeenLastCalledWith(expect.objectContaining({ teamId: '17' }))
    );
  });

  it('switches season', async () => {
    renderPage();
    await screen.findByRole('table');
    await userEvent.selectOptions(await screen.findByLabelText('Season'), '2025');
    await waitFor(() =>
      expect(getStatsLeaderboard).toHaveBeenLastCalledWith(expect.objectContaining({ season: '2025' }))
    );
  });

  it('shows an error when the request fails', async () => {
    getStatsLeaderboard.mockRejectedValue(new Error('boom'));
    renderPage();
    expect(await screen.findByText("Couldn't load player stats.")).toBeInTheDocument();
  });
});

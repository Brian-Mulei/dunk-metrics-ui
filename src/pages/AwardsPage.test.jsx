import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import AwardsPage from './AwardsPage';
import { getAwards, getPlayerDetail } from '../apis/apis';
import { player } from '../test/fixtures';

vi.mock('../apis/apis', () => ({ getAwards: vi.fn(), getPlayerDetail: vi.fn() }));

const candidates = Array.from({ length: 7 }, (_, i) => ({
  rank: i + 1,
  score: 20 - i,
  player: player({ espnPlayerId: `p${i}`, name: `Player ${i + 1}` }),
  highlights: [{ label: 'PTS', value: 30 - i, format: 'number' }, { label: 'Team W%', value: 61, format: 'pct' }],
}));

const awards = {
  season: 2026, seasonLabel: '2025-26', minGames: 41,
  races: [
    { key: 'mvp', name: 'Most Valuable Player', description: 'Game Score per game.', candidates },
    { key: 'roy', name: 'Rookie of the Year', description: 'Rookies only.', candidates: [] },
  ],
};

const renderPage = () => render(<MemoryRouter><AwardsPage /></MemoryRouter>);

describe('AwardsPage', () => {
  beforeEach(() => {
    getAwards.mockReset();
    getPlayerDetail.mockReset();
    getAwards.mockResolvedValue({ data: awards });
    getPlayerDetail.mockResolvedValue({ data: { current: candidates[0].player, previous: null } });
  });

  it('lists each race with the top five candidates', async () => {
    renderPage();
    const mvp = await screen.findByRole('region', { name: 'Most Valuable Player' });

    expect(screen.getByText(/2025-26 season/)).toBeInTheDocument();
    expect(screen.getByText(/41\+ games/)).toBeInTheDocument();
    expect(within(mvp).getAllByRole('listitem')).toHaveLength(5);
    expect(within(mvp).getAllByText('61%')).toHaveLength(5);
    expect(screen.getByText('No eligible players yet.')).toBeInTheDocument();
  });

  it('expands to the full list', async () => {
    renderPage();
    const mvp = await screen.findByRole('region', { name: 'Most Valuable Player' });
    await userEvent.click(within(mvp).getByRole('button', { name: 'Show top 7' }));
    expect(within(mvp).getAllByRole('listitem')).toHaveLength(7);
  });

  it('opens the player popup from a candidate', async () => {
    renderPage();
    await userEvent.click(await screen.findByRole('button', { name: /Player 1\b/ }));
    expect(await screen.findByRole('dialog', { name: 'Player 1' })).toBeInTheDocument();
  });

  it('shows an error when the request fails', async () => {
    getAwards.mockRejectedValue(new Error('down'));
    renderPage();
    expect(await screen.findByText("Couldn't load the award races.")).toBeInTheDocument();
  });
});

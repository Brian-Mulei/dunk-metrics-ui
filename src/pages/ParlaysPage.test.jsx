import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import ParlaysPage from './ParlaysPage';
import { getGamesByDay, getPredictions } from '../apis/apis';
import { STORAGE_KEY } from '../utils/parlays';

vi.mock('../apis/apis', () => ({
  getGamesByDay: vi.fn(),
  getPredictions: vi.fn(),
}));

const hour = 60 * 60 * 1000;
const iso = (offsetMs) => new Date(Date.now() + offsetMs).toISOString();
const leg = (gameId, startOffset, overrides = {}) => ({
  gameId, pickTeamId: 2, homeTeamId: 2, awayTeamId: 24, homeTeam: 'Boston Celtics', awayTeam: 'New York Knicks',
  startTimeUtc: iso(startOffset), probability: 0.6, ...overrides,
});

// Node's own localStorage global shadows jsdom's and is unusable without a backing file
const memoryStorage = () => {
  const items = new Map();
  return {
    getItem: (k) => (items.has(k) ? items.get(k) : null),
    setItem: (k, v) => items.set(k, String(v)),
    removeItem: (k) => items.delete(k),
    clear: () => items.clear(),
  };
};
vi.stubGlobal('localStorage', memoryStorage());

const seed = (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
const renderPage = () => render(<MemoryRouter><ParlaysPage /></MemoryRouter>);

describe('ParlaysPage', () => {
  beforeEach(() => {
    getGamesByDay.mockReset();
    getPredictions.mockReset();
    getGamesByDay.mockResolvedValue({ data: [] });
    getPredictions.mockResolvedValue({ data: [] });
  });
  afterEach(() => localStorage.clear());

  it('points to the games when there are no slips', () => {
    renderPage();
    expect(screen.getByText('No slips yet')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Browse games' })).toHaveAttribute('href', '/');
  });

  it('shows an open slip with combined odds and lets legs be removed', async () => {
    seed({ activeId: 'a', slips: [{ id: 'a', name: 'Tonight', createdAt: 1, legs: [leg(1, 2 * hour), leg(2, 3 * hour, { probability: 0.5 })] }] });
    renderPage();
    const slip = screen.getByRole('region', { name: 'Tonight' });

    expect(within(slip).getByText('Active')).toBeInTheDocument();
    expect(within(slip).getByText('30.0%')).toBeInTheDocument();
    expect(within(slip).getByText('3.33')).toBeInTheDocument();

    await userEvent.click(within(slip).getAllByRole('button', { name: 'Remove BOS' })[0]);
    expect(within(slip).getByText('50.0%')).toBeInTheDocument();
  });

  it('marks a slip expired and fills in live and final results', async () => {
    seed({ activeId: 'a', slips: [{ id: 'a', name: 'Locked', createdAt: 1, legs: [leg(1, -2 * hour), leg(2, 2 * hour)] }] });
    getGamesByDay.mockResolvedValue({ data: [{ id: 1, status: 'Finished', homeTeamScore: 112, awayTeamScore: 104 }] });
    renderPage();
    const slip = screen.getByRole('region', { name: 'Locked' });

    expect(within(slip).getByText(/Expired · BOS–NYK tipped off/)).toBeInTheDocument();
    expect(within(slip).queryByRole('button', { name: /Remove/ })).not.toBeInTheDocument();
    expect(await within(slip).findByText('Won')).toBeInTheDocument();
    expect(within(slip).getByText('112–104')).toBeInTheDocument();
    expect(within(slip).getByText('In play')).toBeInTheDocument();
  });
});

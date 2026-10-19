import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GameCalendar from './GameCalendar';
import { getGameCalendar } from '../apis/apis';

vi.mock('../apis/apis', () => ({ getGameCalendar: vi.fn() }));

const calendar = {
  season: 2027, seasonLabel: '2026-27',
  days: [
    { date: '2026-10-15', games: 4, cupGames: 0, cupStage: null },
    { date: '2026-10-20', games: 2, cupGames: 0, cupStage: null },
    { date: '2026-10-30', games: 8, cupGames: 6, cupStage: 'Group Play' },
  ],
  events: [
    { key: 'openingWeek', label: 'Opening week', start: '2026-10-20', end: '2026-10-26' },
    { key: 'nbaCup', label: 'NBA Cup', start: '2026-10-30', end: '2026-12-11' },
    { key: 'tradeDeadline', label: 'Trade deadline', start: '2027-02-11', end: '2027-02-11' },
  ],
};

describe('GameCalendar', () => {
  beforeEach(() => {
    getGameCalendar.mockReset();
    getGameCalendar.mockResolvedValue({ data: calendar });
  });

  it('marks game days, opening week, preseason and NBA Cup days', async () => {
    render(<GameCalendar value="2026-10-20" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /Tuesday, October 20, 2026/ }));

    const dialog = screen.getByRole('dialog', { name: 'Pick a date' });
    expect(await within(dialog).findByText('2026-27 season')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /October 20, 2026, 2 games, Opening week/ })).toHaveAttribute('aria-pressed', 'true');
    expect(within(dialog).getByRole('button', { name: /October 15, 2026, 4 games, Preseason/ })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /October 30, 2026, 8 games, 6 NBA Cup \(Group Play\)/ })).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /October 5, 2026, no games/ })).toBeInTheDocument();
    expect(within(screen.getByLabelText('Legend')).getByText('Trade deadline')).toBeInTheDocument();
  });

  it('picks a day and closes', async () => {
    const onChange = vi.fn();
    render(<GameCalendar value="2026-10-20" onChange={onChange} />);
    await userEvent.click(screen.getByRole('button', { name: /October 20, 2026/ }));
    await userEvent.click(await screen.findByRole('button', { name: /October 30, 2026, 8 games/ }));

    expect(onChange).toHaveBeenCalledWith('2026-10-30');
    expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
  });

  it('pages through months and lists that month\'s key dates', async () => {
    render(<GameCalendar value="2026-10-20" onChange={vi.fn()} />);
    await userEvent.click(screen.getByRole('button', { name: /October 20, 2026/ }));
    for (let i = 0; i < 4; i++) await userEvent.click(screen.getByRole('button', { name: 'Next month' }));

    const dialog = screen.getByRole('dialog');
    expect(within(dialog).getByText('February 2027')).toBeInTheDocument();
    expect(within(dialog).getByRole('button', { name: /February 11, 2027, no games, Trade deadline/ })).toBeInTheDocument();
    expect(within(dialog).getAllByText('Trade deadline').length).toBeGreaterThan(1);
  });
});

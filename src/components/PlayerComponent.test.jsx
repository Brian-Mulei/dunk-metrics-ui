import { describe, expect, it } from 'vitest';
import { fireEvent, render, screen } from '@testing-library/react';
import PlayerComponent from './PlayerComponent';

const player = {
  id: 322,
  firstName: 'Kevon',
  lastName: 'Looney',
  nationality: 'USA',
  position: 'F',
  number: 5,
  yearsPro: 6,
  rookieYear: 2015,
  weightMetric: 100.7,
  weightUs: 222,
  heightMetric: '2.06 Metres',
  heightUs: '6 ft 9 inches',
};

const stats = {
  headshotUrl: 'https://a.espncdn.com/i/headshots/nba/players/full/1.png',
  points: 7.25,
  trueShootingPct: 61.04,
  assistToTurnover: 1.8,
};

describe('PlayerComponent', () => {
  it('renders bio without stats', () => {
    render(<PlayerComponent player={player} />);
    expect(screen.getByText('Kevon Looney')).toBeInTheDocument();
    expect(screen.getByText(/Forward/)).toBeInTheDocument();
    expect(screen.queryByTestId('player-stats')).not.toBeInTheDocument();
    expect(screen.getByLabelText('Kevon Looney')).toHaveTextContent('KL');
  });

  it('renders headshot and advanced stats when available', () => {
    render(<PlayerComponent player={player} stats={stats} />);
    expect(screen.getByRole('img', { name: 'Kevon Looney' })).toHaveAttribute('src', stats.headshotUrl);
    expect(screen.getByText('7.3')).toBeInTheDocument();
    expect(screen.getByText('61.0%')).toBeInTheDocument();
    expect(screen.getByText('1.80')).toBeInTheDocument();
  });

  it('falls back to initials when the headshot fails to load', () => {
    render(<PlayerComponent player={player} stats={stats} />);
    fireEvent.error(screen.getByRole('img', { name: 'Kevon Looney' }));
    expect(screen.queryByRole('img', { name: 'Kevon Looney' })).not.toBeInTheDocument();
    expect(screen.getByLabelText('Kevon Looney')).toHaveTextContent('KL');
  });
});

import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import GamePreviewModal from './GamePreviewModal';
import MatchComponent from './MatchComponent';
import { MemoryRouter } from 'react-router-dom';
import { luka } from '../test/fixtures';

const team = (overrides) => ({
  teamId: 17, season: 2026, seasonLabel: '2025-26', gamesPlayed: 82, wins: 53, losses: 29,
  pointsFor: 116.3, pointsAgainst: 114.6, pointDiff: 1.7, pointsForRank: 11, pointsAgainstRank: 12,
  pointDiffRank: 14, teamsRanked: 30, homeWins: 28, homeLosses: 13, awayWins: 25, awayLosses: 16,
  lastTen: ['W', 'W', 'L'], streak: 'W2',
  leaders: [{ key: 'points', label: 'Points', value: 33.5, format: 'number', player: luka }],
  ...overrides,
});

const prediction = {
  gameId: 99, homeTeamId: 17, awayTeamId: 9, homeWinProbability: 0.62, awayWinProbability: 0.38,
  projectedHomeMargin: 3.8, basis: "Based on last season's point differential and home court.",
  home: team(), away: team({ teamId: 9, wins: 44, losses: 38, pointDiff: -2.4, leaders: [] }),
};

const game = {
  id: 99, date: '2026-10-22', startingTime: '02:30:00', venue: 'Crypto.com Arena', status: 'Scheduled',
  homeTeamId: 17, awayTeamId: 9, homeTeam: 'Los Angeles Lakers', awayTeam: 'Denver Nuggets',
  homeTeamScore: 0, awayTeamScore: 0, lineScores: { home: [], visitors: [] },
};

describe('GamePreviewModal', () => {
  it('shows odds, projected margin and both teams side by side', async () => {
    const onClose = vi.fn();
    render(<GamePreviewModal game={game} prediction={prediction} onClose={onClose} />);

    expect(screen.getByRole('dialog', { name: 'LAL vs DEN' })).toBeInTheDocument();
    expect(screen.getByText('62%')).toBeInTheDocument();
    expect(screen.getByText('38%')).toBeInTheDocument();
    expect(screen.getByText('LAL by 3.8')).toBeInTheDocument();
    expect(screen.getByText('53-29')).toBeInTheDocument();
    expect(screen.getByText('44-38')).toBeInTheDocument();
    expect(screen.getByText('-2.4')).toBeInTheDocument();
    expect(screen.getByText('Luka Doncic 33.5')).toBeInTheDocument();
    expect(screen.getByText(/not betting odds/)).toBeInTheDocument();

    await userEvent.keyboard('{Escape}');
    expect(onClose).toHaveBeenCalled();
  });
});

describe('MatchComponent with a prediction', () => {
  it('shows the odds bar and opens the preview', async () => {
    const onPreview = vi.fn();
    render(<MemoryRouter><MatchComponent game={game} prediction={prediction} onPreview={onPreview} /></MemoryRouter>);

    expect(screen.getByLabelText('Win odds: LAL 62%, DEN 38%')).toBeInTheDocument();
    expect(screen.getByText('02:30')).toBeInTheDocument();
    await userEvent.click(screen.getByRole('button', { name: 'Matchup preview' }));
    expect(onPreview).toHaveBeenCalledWith(game, prediction);
  });

  it('has no odds for finished games', () => {
    render(<MemoryRouter><MatchComponent game={{ ...game, status: 'Finished', homeTeamScore: 110, awayTeamScore: 100 }} /></MemoryRouter>);
    expect(screen.queryByText('Matchup preview')).not.toBeInTheDocument();
    expect(screen.getByText('110')).toBeInTheDocument();
  });
});

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import TeamPage from './TeamPage';
import { getTeamDetails, getTeamPlayerStats } from '../apis/apis';

vi.mock('../apis/apis', () => ({
  getTeamDetails: vi.fn(),
  getTeamPlayerStats: vi.fn(),
  getPredictions: vi.fn(() => Promise.resolve({ data: [] })),
}));

const renderAt = (id) => render(
  <MemoryRouter initialEntries={[`/team/${id}`]}>
    <Routes><Route path="/team/:id" element={<TeamPage />} /></Routes>
  </MemoryRouter>
);

const team = {
  teamId: 17, name: 'Los Angeles Lakers', city: 'Los Angeles', conference: 'West', division: 'Pacific',
  conferenceRank: 5, divisionRank: null, wins: 0, losses: 0, homeRecord: '0 - 0', awayRecord: '0 - 0',
  last5Games: [], next5Games: [], players: [],
};

describe('TeamPage', () => {
  beforeEach(() => {
    getTeamDetails.mockReset();
    getTeamPlayerStats.mockReset();
    getTeamPlayerStats.mockResolvedValue({ data: { players: [] } });
  });

  it('says the team was not found for a 404', async () => {
    getTeamDetails.mockRejectedValue({ response: { status: 404 } });
    renderAt(9999);
    expect(await screen.findByText('Team not found.')).toBeInTheDocument();
  });

  it('shows a general error for other failures', async () => {
    getTeamDetails.mockRejectedValue(new Error('Network Error'));
    renderAt(17);
    expect(await screen.findByText("Couldn't load this team.")).toBeInTheDocument();
  });

  it('shows a dash for missing ranks instead of #0 or #null', async () => {
    getTeamDetails.mockResolvedValue({ data: { ...team, conferenceRank: 0 } });
    renderAt(17);
    expect(await screen.findByText('Los Angeles Lakers')).toBeInTheDocument();
    expect(screen.getByText(/West · –/)).toBeInTheDocument();
    expect(screen.getByText(/Pacific · –/)).toBeInTheDocument();
  });
});

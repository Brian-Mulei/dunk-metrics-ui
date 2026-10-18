import { beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { MemoryRouter } from 'react-router-dom';
import PlayerModal from './PlayerModal';
import { getPlayerDetail } from '../apis/apis';
import { luka, player } from '../test/fixtures';

vi.mock('../apis/apis', () => ({ getPlayerDetail: vi.fn() }));

const renderModal = (props = {}) => {
  const onClose = vi.fn();
  render(
    <MemoryRouter>
      <PlayerModal espnPlayerId="3945274" preview={luka} onClose={onClose} {...props} />
    </MemoryRouter>
  );
  return onClose;
};

describe('PlayerModal', () => {
  beforeEach(() => {
    getPlayerDetail.mockReset();
  });

  it('shows this season next to last season', async () => {
    getPlayerDetail.mockResolvedValue({
      data: { current: luka, currentSeasonLabel: '2025-26', previous: player({ points: 28.2 }), previousSeasonLabel: '2024-25' },
    });
    renderModal();

    expect(screen.getByRole('dialog', { name: 'Luka Doncic' })).toBeInTheDocument();
    expect(await screen.findAllByText('2024-25')).toHaveLength(3);
    expect(screen.getAllByText('33.5').length).toBeGreaterThan(0);
    expect(screen.getByText('28.2')).toBeInTheDocument();
    expect(screen.getAllByText('10.8-22.8').length).toBeGreaterThan(0);
    expect(screen.getByRole('link', { name: 'View team' })).toHaveAttribute('href', '/team/17');
  });

  it('shows bio details when given', async () => {
    getPlayerDetail.mockResolvedValue({ data: { current: luka, currentSeasonLabel: '2025-26', previous: null } });
    renderModal({ bio: { number: 77, heightUs: '6 ft 6 inches', weightUs: 230, nationality: 'Slovenia', rookieYear: 2018 } });

    expect(screen.getByText('Slovenia')).toBeInTheDocument();
    expect(screen.getByText('#77', { exact: false })).toBeInTheDocument();
    expect(await screen.findAllByText('2025-26')).toHaveLength(3);
  });

  it('closes on Escape and on the close button', async () => {
    getPlayerDetail.mockResolvedValue({ data: { current: luka, previous: null } });
    const onClose = renderModal();

    await userEvent.keyboard('{Escape}');
    await userEvent.click(screen.getByRole('button', { name: 'Close' }));
    expect(onClose).toHaveBeenCalledTimes(2);
  });

  it('keeps showing the preview if the request fails', async () => {
    getPlayerDetail.mockRejectedValue(new Error('down'));
    renderModal();

    expect(await screen.findByText("Couldn't load this player's stats.")).toBeInTheDocument();
    expect(screen.getAllByText('33.5').length).toBeGreaterThan(0);
  });
});

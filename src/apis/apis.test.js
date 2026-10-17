import { beforeEach, describe, expect, it, vi } from 'vitest';

const get = vi.fn();
vi.mock('axios', () => ({ default: { create: () => ({ get }) } }));

const { clearApiCache, getNews, getTeamPlayerStats } = await import('./apis');

describe('apis', () => {
  beforeEach(() => {
    get.mockReset();
    clearApiCache();
  });

  it('shares one request between identical calls', async () => {
    get.mockResolvedValue({ data: { articles: [] } });
    await Promise.all([getNews(5), getNews(5)]);
    expect(get).toHaveBeenCalledTimes(1);
    expect(get).toHaveBeenCalledWith('/news', { params: { size: 5 } });
  });

  it('keeps different params separate', async () => {
    get.mockResolvedValue({ data: {} });
    await getNews(5);
    await getNews(15);
    expect(get).toHaveBeenCalledTimes(2);
  });

  it('does not cache failures', async () => {
    get.mockRejectedValueOnce(new Error('down')).mockResolvedValueOnce({ data: { players: [] } });
    await expect(getTeamPlayerStats(1)).rejects.toThrow('down');
    await expect(getTeamPlayerStats(1)).resolves.toEqual({ data: { players: [] } });
    expect(get).toHaveBeenCalledTimes(2);
  });
});

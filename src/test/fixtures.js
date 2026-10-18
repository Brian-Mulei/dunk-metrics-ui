export const luka = {
  espnPlayerId: '3945274', playerId: 963, teamId: 17, teamCode: 'LAL', name: 'Luka Doncic', position: 'G',
  headshotUrl: null, gamesPlayed: 64, minutes: 35.8, points: 33.5, rebounds: 7.7, assists: 8.3, steals: 1.6,
  blocks: 0.5, turnovers: 4.0, fieldGoalsMade: 10.8, fieldGoalsAttempted: 22.8, threePointersMade: 4.0,
  threePointersAttempted: 10.8, freeThrowsMade: 7.9, freeThrowsAttempted: 10.1, fieldGoalPct: 47.6,
  threePointPct: 36.6, freeThrowPct: 78.0, trueShootingPct: 61.6, effectiveFieldGoalPct: 56.3,
  assistToTurnover: 2.08, pointsPer36: 33.7, reboundsPer36: 7.8, assistsPer36: 8.3, freeThrowRate: 0.44,
  threePointRate: 0.48,
};

export const player = (overrides) => ({ ...luka, ...overrides });

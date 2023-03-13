export interface LeaderboardPageProps {
  entity: string;
}

export interface MatchParams {
  location: string;
  matchTime: string;
  finalOpponentScore: number;
  finalPlayerScore: number;
  opponentId: number;
  opponentName: string;
  playerId: number;
  playerName: string;
}

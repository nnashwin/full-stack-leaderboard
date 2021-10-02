export interface LeaderboardPageProps {
    entity: string;
}

export interface MatchParams {
    location: string;
    matchTime: string;
    finalOpponentScore: number;
    finalPlayerScore: number;
    opponentId: number;
    playerId: number;
}
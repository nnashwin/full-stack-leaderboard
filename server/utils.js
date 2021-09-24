const updatePlayerStats = (playerObject, opponentRating, didWin) => {
    if (Object.entries(playerObject).length == 0 || typeof opponentRating === 'undefined' || typeof didWin === 'undefined') {
        throw new TypeError("playerObject and didWin params are both required for the updatePlayerStatsFunction");
    }

    playerObject.opponentsRatings += opponentRating;
    playerObject.gamesPlayed += 1;
    if (didWin) {
        playerObject.wins += 1;
    } else {
        playerObject.losses += 1;
    }

    // simplified elo-type rating system (performance rating system found here https://en.wikipedia.org/wiki/Elo_rating_system#Implementing_Elo's_scheme) to better rank players based on the ranks of other players they have defeated before
    playerObject.rating = Math.floor((playerObject.opponentsRatings + 400 * (playerObject.wins - playerObject.losses)) / playerObject.gamesPlayed);

    return playerObject;
}

module.exports = {updatePlayerStats};
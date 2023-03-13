const graphql = require('graphql');
const { updatePlayerStats } = require('./utils');

const PlayerType = new graphql.GraphQLObjectType({
  name: 'Player',
  fields: {
    id: { type: graphql.GraphQLID },
    name: { type: graphql.GraphQLString },
    wins: { type: graphql.GraphQLInt },
    losses: { type: graphql.GraphQLInt },
    gamesPlayed: { type: graphql.GraphQLInt },
    opponentsRatings: { type: graphql.GraphQLInt },
    rating: { type: graphql.GraphQLInt },
    createdAt: { type: graphql.GraphQLString },
  },
});

const MatchType = new graphql.GraphQLObjectType({
  name: 'Match',
  fields: {
    id: { type: graphql.GraphQLID },
    player_id: { type: graphql.GraphQLID },
    playerName: { type: graphql.GraphQLString },
    opponent_id: { type: graphql.GraphQLID },
    opponentName: { type: graphql.GraphQLString },
    finalPlayerScore: { type: graphql.GraphQLInt },
    finalOpponentScore: { type: graphql.GraphQLInt },
    winner_id: { type: graphql.GraphQLID },
    matchTime: { type: graphql.GraphQLString },
    location: { type: graphql.GraphQLString },
  },
});

const RootQuery = new graphql.GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    status: {
      type: graphql.GraphQLString,
      resolve(parent, args) {
        return 'Welcome to GraphQL';
      },
    },
    matches: {
      type: graphql.GraphQLList(MatchType),
      resolve: (_root, _args, context) => {
        const { db } = context;
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM matches;', (err, rows) => {
            if (err) {
              reject(
                new Error(
                  'your query could not be completed as entered.  check your parameters and try again.'
                )
              );
            } else {
              resolve(rows);
            }
          });
        });
      },
    },
    player: {
      type: PlayerType,
      args: {
        id: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLID),
        },
      },
      resolve: (_root, { id }, context) => {
        const { db } = context;
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM players WHERE id = (?);', [id], (err, rows) => {
            if (err) {
              reject(null);
            }
            resolve(rows[0]);
          });
        });
      },
    },
    players: {
      type: graphql.GraphQLList(PlayerType),
      resolve: (_root, _args, context) => {
        const { db } = context;
        return new Promise((resolve, reject) => {
          db.all('SELECT * FROM players;', (err, rows) => {
            if (err) {
              reject(
                new Error(
                  'your query could not be completed as entered.  check your parameters and try again.'
                )
              );
            } else {
              resolve(rows);
            }
          });
        });
      },
    },
  },
});

const Mutation = new graphql.GraphQLObjectType({
  name: 'Mutations',
  fields: {
    addPlayer: {
      type: PlayerType,
      args: {
        name: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
      },
      resolve(parent, { name }, context) {
        const { db } = context;
        return new Promise((resolve, reject) => {
          db.run('INSERT INTO players(name) VALUES(?)', [name], (err) => {
            if (err) {
              reject(err);
            }

            db.get(
              'SELECT * FROM players ORDER BY id DESC LIMIT 1;',
              (err, rows) => {
                if (err) {
                  reject(err);
                }
                resolve(rows);
              }
            );
          });
        });
      },
    },
    addMatch: {
      type: MatchType,
      args: {
        player_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        playerName: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        opponent_id: { type: new graphql.GraphQLNonNull(graphql.GraphQLInt) },
        opponentName: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLString),
        },
        finalPlayerScore: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
        },
        finalOpponentScore: {
          type: new graphql.GraphQLNonNull(graphql.GraphQLInt),
        },
        location: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
        matchTime: { type: new graphql.GraphQLNonNull(graphql.GraphQLString) },
      },
      resolve(parent, args, context) {
        const { db } = context;
        const {
          player_id,
          playerName,
          opponent_id,
          opponentName,
          finalPlayerScore,
          finalOpponentScore,
          location,
          matchTime,
        } = args;
        return new Promise((resolve, reject) => {
          if (player_id == opponent_id) {
            reject(
              new Error(
                'player_id should be different than opponent id.  Create correct ids and try again.'
              )
            );
          }
          // TODO: Wrap this in a database transaction where it is all or nothing.
          // Right now it is running synchronously, but mistakes in one db operation could put the tables in a bad state.
          db.all(
            'SELECT * FROM players WHERE id IN (?, ?)',
            [player_id, opponent_id],
            (err, rows) => {
              if (!err && rows.length == 2) {
                db.serialize(() => {
                  const winnerId =
                    finalPlayerScore > finalOpponentScore
                      ? player_id
                      : opponent_id;
                  const loserId =
                    finalPlayerScore < finalOpponentScore
                      ? player_id
                      : opponent_id;

                  db.run(
                    'INSERT INTO matches(player_id, playerName, opponent_id, opponentName, finalPlayerScore, finalOpponentScore, winner_id, matchTime, location) VALUES(?, ?, ?, ?, ?, ?, ?, ?, ?)',
                    [
                      args.player_id,
                      playerName,
                      args.opponent_id,
                      opponentName,
                      args.finalPlayerScore,
                      args.finalOpponentScore,
                      winnerId,
                      matchTime,
                      location,
                    ],
                    (err) => {
                      if (err) {
                        return reject(err);
                      }
                    }
                  );

                  const winner = rows[0].id == winnerId ? rows[0] : rows[1];
                  const loser = rows[0].id == loserId ? rows[0] : rows[1];

                  const winPrevRating = winner.rating;
                  const losePrevRating = loser.rating;
                  const updatedWinner = updatePlayerStats(
                    winner,
                    losePrevRating,
                    true
                  );
                  const updatedLoser = updatePlayerStats(
                    loser,
                    winPrevRating,
                    false
                  );

                  db.run(
                    'UPDATE players SET wins = ?, gamesPlayed = ?, rating = ?, opponentsRatings = ? WHERE id = ?',
                    [
                      updatedWinner.wins,
                      updatedWinner.gamesPlayed,
                      updatedWinner.rating,
                      updatedWinner.opponentsRatings,
                      winnerId,
                    ],
                    (err) => {
                      if (err) return reject(err);
                    }
                  );

                  db.run(
                    'UPDATE players SET losses = ?, gamesPlayed = ?, rating = ?, opponentsRatings = ? WHERE id = ?',
                    [
                      updatedLoser.losses,
                      updatedLoser.gamesPlayed,
                      updatedLoser.rating,
                      updatedLoser.opponentsRatings,
                      loserId,
                    ],
                    (err) => {
                      if (err) return reject(err);
                    }
                  );

                  db.get(
                    'SELECT * FROM matches ORDER BY id DESC LIMIT 1;',
                    (err, rows) => {
                      if (err) {
                        return reject(err);
                      }
                      resolve(rows);
                    }
                  );
                });
              } else {
                let error;
                // TODO Refactor the following into something that is not so brittle / does not rely on array indices.
                if (rows.length < 1) {
                  error = new Error(
                    'invalid player_id and opponent_id, double check your ids and try again.'
                  );
                } else if (rows[0].id != player_id) {
                  error = new Error(
                    'invalid player_id.  check the player id and try again'
                  );
                } else {
                  error = new Error(
                    'invalid opponent_id given.  check the opponent_id and try again'
                  );
                }

                return reject(error);
              }
            }
          );
        });
      },
    },
  },
});

module.exports = new graphql.GraphQLSchema({
  query: RootQuery,
  mutation: Mutation,
});

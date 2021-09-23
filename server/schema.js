const graphql = require('graphql');

const PlayerType = new graphql.GraphQLObjectType({
    name: "Player",
    fields: {
        id: { type: graphql.GraphQLID },
        name: { type: graphql.GraphQLString },
        wins: { type: graphql.GraphQLInt },
        losses: { type: graphql.GraphQLInt },
        gamesPlayed: { type: graphql.GraphQLInt },
        pointsPerGame: { type: graphql.GraphQLFloat },
        createdAt: { type: graphql.GraphQLString },
    }
});

const MatchType = new graphql.GraphQLObjectType({
    name: "Match",
    fields: {
        id: { type: graphql.GraphQLID },
        player_id: { type: graphql.GraphQLID },
        opponent_id: { type: graphql.GraphQLID },
        finalPlayerScore: { type: graphql.GraphQLInt },
        finalOpponentScore: { type: graphql.GraphQLInt },
        winner_id: { type: graphql.GraphQLID },
        matchTime: { type: graphql.GraphQLFloat },
        location: { type: graphql.GraphQLString },
    }
});

const RootQuery = new graphql.GraphQLObjectType({
    name: "RootQueryType",
    fields: {
        status: {
            type: graphql.GraphQLString,
            resolve(parent, args) {
                return "Welcome to GraphQL"
            }
        },
        matches: {
            type: graphql.GraphQLList(MatchType),
            resolve: (_root, _args, context) => {
                const { db } = context;
                return new Promise((resolve, reject) => {
                    db.all("SELECT * FROM matches;", (err, rows) => {
                        if (err) {
                            reject(new Error('your query could not be completed as entered.  check your parameters and try again.'));
                        } else {
                            resolve(rows);
                        }
                    })
                })
            }
        },
        players: {
            type: graphql.GraphQLList(PlayerType),
            resolve: (_root, _args, context) => {
                const { db } = context;
                return new Promise((resolve, reject) => {
                    db.all("SELECT * FROM players;", (err, rows) => {
                        if (err) {
                            reject(new Error('your query could not be completed as entered.  check your parameters and try again.'));
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
        },
    }
});

const Mutation = new graphql.GraphQLObjectType({
    name: 'Mutations',
    fields: {
        addPlayer: {
            type: PlayerType,
            args: {
                name: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
            },
            resolve(parent, {name}, context) {
                const { db } = context;
                return new Promise((resolve, reject) => {
                    db.run('INSERT INTO players(name) VALUES(?)', [name], (err) => {
                        if (err) {
                            reject(err);
                        } 

                        db.get("SELECT * FROM players ORDER BY id DESC LIMIT 1;", (err, rows) => {
                            if (err) {
                                reject(err);
                            }
                            resolve(rows);
                        });
                    });
                });
            }
        },
        addMatch: {
            type: MatchType,
            args: {
                player_id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                opponent_id: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                finalPlayerScore: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                finalOpponentScore: {type: new graphql.GraphQLNonNull(graphql.GraphQLInt)},
                location: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)},
                matchTime: {type: new graphql.GraphQLNonNull(graphql.GraphQLString)}
            },
            resolve(parent, args, context) {
                const { db } = context;
                const { player_id, opponent_id, finalPlayerScore, finalOpponentScore, location, matchTime } = args;
                return new Promise((resolve, reject) => {
                    if (player_id == opponent_id) {
                        reject(new Error('player_id should be different than opponent id.  Create correct ids and try again.'));
                    }
                    db.all('SELECT * FROM players WHERE id IN (?, ?)', [player_id, opponent_id], (err, rows) => {
                        if (!err && rows.length == 2) {
                            db.serialize(() => {
                                const winnerId = finalPlayerScore > finalOpponentScore ? player_id : opponent_id;
                                db.run('INSERT INTO matches(player_id, opponent_id, finalPlayerScore, finalOpponentScore, winner_id, matchTime, location) VALUES(?, ?, ?, ?, ?, ?, ?)', [args.player_id, args.opponent_id, args.finalPlayerScore, args.finalOpponentScore, winnerId, args.matchTime, args.location], (err) => {
                                    if (err) {
                                        return reject(err);
                                    } 
                                });

                                db.get("SELECT * FROM matches ORDER BY id DESC LIMIT 1;", (err, rows) => {
                                    if (err) {
                                        return reject(err);
                                    }
                                    resolve(rows);
                                });
                            });
                        } else {
                            let error;
                            // TODO Refactor the following into something that is not so brittle / does not rely on array indices.
                            if (rows.length < 1) {
                                error = new Error('invalid player_id and opponent_id, double check your ids and try again.');
                            } else if (rows[0].id != player_id) {
                                error = new Error('invalid player_id.  check the player id and try again');
                            } else {
                                error = new Error('invalid opponent_id given.  check the opponent_id and try again');
                            }
                            
                            return reject(error);
                        }
                    });
                });
            }
        }
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery,
    mutation: Mutation
});
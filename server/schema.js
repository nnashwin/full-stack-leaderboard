const graphql = require('graphql');

const PlayerType = new graphql.GraphQLObjectType({
    name: "Player",
    fields: {
        name: { type: graphql.GraphQLString },
        wins: { type: graphql.GraphQLInt },
        losses: { type: graphql.GraphQLInt },
        gamesPlayed: { type: graphql.GraphQLInt },
        pointsPerGame: { type: graphql.GraphQLFloat },
        createdAt: { type: graphql.GraphQLString },
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
        players: {
            type: graphql.GraphQLList(PlayerType),
            resolve: (root, args, context, info) => {
                const db = context.db;
                return new Promise((resolve, reject) => {
                    db.all("SELECT * FROM players;", (err, rows) => {
                        if (err) {
                            console.error("there was an error in the sql resolver: ", err)
                            reject([]);
                        } else {
                            resolve(rows);
                        }
                    });
                });
            }
        },
    }
});

module.exports = new graphql.GraphQLSchema({
    query: RootQuery
});
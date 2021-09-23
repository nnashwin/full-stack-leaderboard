const process = require('process');

const sqlite3 = require('sqlite3').verbose();

const db = new sqlite3.Database("leaderboard.db3", (err) => {
    if (err) {
        console.error('could not connect to the database withe the following err: ', err);
        console.error('please check your database connection and try again');
        throw err;
    } else {
        console.log(`connected to database`);
    }
});

const createPlayersStr = `CREATE TABLE IF NOT EXISTS players (
        id integer PRIMARY KEY,
        name TEXT,
        wins default 0,
        losses default 0,
        gamesPlayed default 0,
        pointsPerGame REAL default 0,
        createdAt TEXT default (datetime(current_timestamp))
    )`;

const createMatchesStr = `CREATE TABLE IF NOT EXISTS matches (
        id integer PRIMARY KEY,
        player_id INT,
        opponent_id INT,
        finalPlayerScore INT,
        finalOpponentScore INT,
        winner_id INT,
        matchTime TEXT,
        location TEXT,
        createdAt TEXT default (datetime(current_timestamp))
    )`;

const createStrings = [createPlayersStr, createMatchesStr];

const closeDb = (code) => { 
    db.close() 
    process.exit(code);
};

module.exports = {
    connect: () => {
        return new Promise((resolve, reject) => {
            db.serialize((serialErr) => {
                for (let createString of createStrings) {
                    db.run(createString, (err) => {
                        if (err) {
                            console.error('Error creating table in the database: ', err)
                            reject(err);
                        } 
                    });
                }

                if (serialErr) {
                    console.error('Error in serializing table creation: ', err);
                    reject(err);
                }

                resolve(db);
            });               
        });
    },
}; 
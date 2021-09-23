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
        wins INT default 0,
        losses INT default 0,
        gamesPlayed INT default 0,
        pointsPerGame REAL default 0,
        createdAt TEXT default (datetime(current_timestamp))
    )`;

const createMatchesStr = `CREATE TABLE IF NOT EXISTS matches (
        id integer PRIMARY KEY,
        matchTime TEXT,
        location TEXT,
        createdAt TEXT default (datetime(current_timestamp))
    )`;

const createPlayerMatchesStr = `CREATE TABLE IF NOT EXISTS player_matches (
        player_id INT,
        match_id INT,
        finalGameScore INT,
        didWin INT,
        FOREIGN KEY(player_id) REFERENCES players(id) ON DELETE CASCADE,
        FOREIGN KEY(match_id) REFERENCES matches(id) ON DELETE CASCADE
    )`;


const createStrings = [createPlayersStr, createMatchesStr, createPlayerMatchesStr];

const closeDb = (code) => { 
    db.close() 
    process.exit(code);
};

// add stdin resume so that we can catch the signals on Ctrl (Cmd) + c and other kill commands.
process.stdin.resume();
process.on('uncaughtException', (err, origin) => {
  console.error(`the following error occurred in the process: 
    ${err} 
from origin: 
    ${origin}
    `);
  process.exit(1);
});
process.on('exit', closeDb);
process.on('SIGINT', closeDb);
process.on('SIGTERM', closeDb);

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
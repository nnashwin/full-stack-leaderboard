const express = require('express');
const db = require('./db');
const utils = require('./utils');

const PORT = process.env.PORT || 3001;

const app = express();

db
    .connect()
    .then(_res => console.log('table created successfully'))
    .catch(err => {
        console.error('the db was unable to connect with the following error: \n', err);
        // throwing uncaught error to force the process to exit instead of calling process.exit(1);
        // pattern defined in documentation: https://nodejs.org/api/process.html#process_process_exit_code
        throw err;
    });

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.get(utils.createV1ApiString("/players"), (req, res) => {
    res.json({message: "Getting players"});
});

app.post(utils.createV1ApiString("/matches"), (req, res) => {
    res.json({message: "Hello from server!"});
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
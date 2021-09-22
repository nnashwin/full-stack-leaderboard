const express = require('express');
const utils = require('./utils');

const PORT = process.env.PORT || 3001;

const app = express();

const createApiRoute = (version) => 

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.get(utils.createV1ApiString("/"), (req, res) => {
    res.json({message: "Hello from server!"});
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
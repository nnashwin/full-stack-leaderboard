const express = require('express');

const PORT = process.env.PORT || 3001;

const app = express();

app.use((req, res, next) => {
    res.setHeader("Content-Type", "application/json");
    next();
});

app.get("/v1/api/hello", (req, res) => {
    res.json({message: "Hello from server!"});
});

app.listen(PORT, () => {
    console.log(`Server listening on port: ${PORT}`);
});
const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const db = require('./db');
const schema = require('./schema');
const utils = require('./utils');

const PORT = process.env.PORT || 3001;

const app = express();

db
    .connect()
    .then(db => { 
        console.log('tables created successfully') 
        app.use(
            "/graphql", 
            graphqlHTTP({ schema: schema, graphiql: true, context: {db: db}}));
        app.listen(PORT, () => {
            console.log(`Server listening on port: ${PORT}`);
        });
    })
    .catch(err => {
        console.error('the db was unable to connect with the following error: \n', err);
        // throwing uncaught error to force the process to exit instead of calling process.exit(1);
        // pattern defined in documentation: https://nodejs.org/api/process.html#process_process_exit_code
        throw err;
    });
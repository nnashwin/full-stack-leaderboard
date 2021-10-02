# Leaderboard
> An ejected create-react-app application that lets users see ping pong tournament results!


## `Install`

```
yarn
```

## `Available Scripts`

In the project directory, you can run:

### `yarn start`

Runs the client side code in development mode.  Note: You won't be able to see results from the server.  You will be able to see timeouts and fetching.

### `yarn test`

Launches unit tests then api automation tests written through the combination of a postman collection and newman (cli tool to run postman tests).  Both test suites are not in watch mode.

***Note***: The api tests will fail if you do not run the server first.  It is recommended to run yarn dev or yarn run server to launch the server to receive api requests before running api tests.

This is kind of an inconvenience at the time.  In a more robust codebase, we could automate this process by either using the newman api tests in a ci/cd pipeline or by using some combination of other node cli tools that help you start and stop daemon processes (like forever, nodemon, child process etc).

### `yarn dev`

Runs the api server and client-side app concurrently.  Should run both automatically and enable the client-side application to ping the server / db (sqlite, so a db file) to save and read data.


### `yarn build`

Builds the app for production to the `build` folder.\
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.\
Your app is ready to be deployed!

See the section about [deployment](https://facebook.github.io/create-react-app/docs/deployment) for more information.

## `Further Additions`

The following are a list of addons / changes I would implement in a more mature project with more time:


### `Convert Player Ids to UUIDS`

Depending on who was using the api, having incrementing ids in the database is a large security risk that can allow for attackers to infer which users will have which ids.


It's more secure (and computationally intensive at high load) to have users be assigned a uuid when they register in a database.

### `Any any types`

I did my best to use create types and do typechecking.
I haven't touched redux for a little over a year, and this project brought to my attention how much the ecosystem has changed.

It's cool that there are easier methods to handle creating actions, reducers, etc, and I would need more time to research how to implement related logic in a type-correct way.

### `More in-depth tests (Unit and UI / API automation)`

Although I set up few simple tests, there are many additions that should be added to the application.

Mocks for api calls, tests for each individual state change, and better automation tests (potentially with Cypress integration) will increase confidence in this application when pushing out to prod.

A good strategy to run different tests at different stages will also ensure the team can move quickly while not pushing breaking changes.

### `Serialized requests into transactions`

In a couple graphql resolvers we use db.serialize to ensure that a few sequential database calls are synchronized to execute one after another.

This is great, but it would be better to translate some of them into full-fledged db transactions.

If one of the requests in the db.serialize sequence fails without rolling back the previous changes, the db could be put in an invalid state where a player or match online has half-data.  This would provide a poor experience for our users and not allow them to easily view the information they want to see.

### `Add better results from the getMatch query`

On the match leaderboard, it would be better to show the names as well as ideas for each match.

Besides calling all of the players and all of the matches and mixing the two bits of data together through the graphql api itself, a couple other approaches could be used in structuring the data in the matches table to enable us to accomplish this:

1. We could relate the player_id in matches to the actual player rows in the player table. Then we could call a simple join to return both bits of data when we look for matches and retrieve both.

2. We could maintain a redundant copy of the name of the players and put them into the row for each match.

### `Make an individual player view on the Leaderboard`

It would be cool to have an individual player view on the leaderboard.

Based on the needs of the client / project, we could calculate their rating against specific players, calculate their win percentage at a specific location, and see other pieces of data based on their performance.
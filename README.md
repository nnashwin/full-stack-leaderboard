# Leaderboard
> An ejected create-react-app application that lets users see ping pong tournament results!


## Install

yarn

## Available Scripts

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


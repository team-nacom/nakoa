# Nakoa - NamuCompass with Koa and React

## How to run

Install yarn globally.

Run `yarn install-all` to install all npm dependencies in both `client` and `server`. You can install manually, by running `yarn` inside both directory.

You might want to create `.env` files in both `server/` and `clinet/`. Refer to READMEs in each directory.

To build client, run `yarn build-client`.

To build server, run `yarn build-server`.

To build both, run `yarn build`.

To run client, run `yarn watch-client`.

To run server, run `yarn watch-server`.

To run both, run `yarn watch`. It will run both concurrently.

The client server (which is being developed in /client) runs in port 3000, 
The API server (which is being developed in /server) runs in port 3885.

To connect to client server, open `localhost:3000` with your web browser.
To connect to API server, open `localhost:3885` with your web browser.


## Production

First, build both client and server by running `yarn build`.

Install pm2 to configure background & repetitive launch.

To run client, run `sudo pm2 serve --spa client/build 3000`.

To run server, run `sudo pm2 start --node-args="-r dotenv/config" build/index.js`.


## Structure

Developed with Typescript, koajs, Create React App, MongoDB.


## Notes

To use SSL, you might want to use nginx or such to proxy ports.

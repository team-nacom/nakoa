# Nakoa Client

Client will serve at port `3000`. In the production server, it will listen to both `80` and `443` ports, while nginx redirecting any http connection to https on `443` port.

Note that the api call is run on the users' side, not on the server. This means the API server must be open and listen to public.

## Configuration

Default API server address is set to `http://localhost:3885`. If you want to change these values, create `.env` in `client/`, and add `REACT_APP_API_URL` variable. For example, the production server will have the following `client/.env`:

```
REACT_APP_API_URL=https://beta.team-na.com
```

Additionally, if you are using code-server as your workspace for example, then your client root path might not be `/` and should be set manually. To set this root path, `PUBLIC_URL` and `REACT_APP_BASE_URL` variable should be added. In code-server case, the full `client/.env` should contain:

```
PUBLIC_URL="/absproxy/3000"
REACT_APP_BASE_URL="/proxy/3000"
REACT_APP_API_URL="/proxy/3885"
```

## How to run

To build the client (mainly to make static SPA), run `yarn build`.

To run the client, run `yarn start`.

To run the client which updates on changes of code, run `yarn watch`.

After building the client, you can publish the site by serving `build/` as a static single page application. React will magically handle the routing and everything.


## Learn More

You can learn more in the [Create React App documentation](https://facebook.github.io/create-react-app/docs/getting-started).

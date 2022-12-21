# Reparking Game v3.10.0


## Setting up and running DEV app
```
git clone https://github.com/keenethics/reparking_game.git
cd reparking_game
npm install
```
`.env.dev`
```
SERVER_PORT=
REACT_APP_SERVER_URL=
SERVER_CORS_ORIGIN=
DISABLE_ESLINT_PLUGIN=true
```
```
npm run start:dev
```

## Setting up and running PROD app locally
```
git clone https://github.com/keenethics/reparking_game.git
cd reparking_game
npm install
```
`.env.prod`
```
SERVER_PORT=
REACT_APP_SERVER_URL=
NODE_ENV=production
```
```
npm run build:prod-client
npm run start:prod-server
```


## Deploying to Fly
1. Install Flyctl
2. Log in to Fly
3. Execute the command
```
npm run deploy
```

![Game view](game_view.png)

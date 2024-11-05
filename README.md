## A game engine written in typescript

### install

```
npm install
```

start dev server:

```
npm start
```

generate production build:

```
npm run build
```

### features:

- [x] **ECS** pattern implementation
- [x] cached **entity queries**
- [x] utility library: id generation, object lifecycle, events, math
- [x] peer.js-based multiplayer
- [x] **tailwind** for html ui

### TODO:

- [ ] webgl rendering engine
- [ ] chess game demo

### how to configure multiplayer

create a `.env` file:

```
PEER_HOST="peer.example.com"
PEER_PORT=443
PEER_PATH="/peer"
STUN_URL="stun:stun.example.com"
TURN_URL="turn:turn.example.com"
TURN_USERNAME="username"
TURN_CREDENTIAL="password"
```

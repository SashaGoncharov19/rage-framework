# Rage-FW-RPC
is an all-in package with asynchronous RPC implementation for RageMP servers in JS/TS

# Installation
``` shell 
npm i rage-fw-rpc
```
```shell 
pnpm i rage-fw-rpc
```
```shell 
yarn add rage-fw-rpc
```

Import installed package and initialize rpc:
```ts
// lib/rpc.js

import { Rpc } from 'rage-fw-rpc'
export const rpc = new Rpc(/* options */)
```

# Motivation
The idea was to create an extensible package, with various features to simplify the development process and provide as much comfort as possible. It should also be using similar architecture as the framework it was specially built for

Inspired by usage of [rage-rpc](https://github.com/micaww/rage-rpc)

# Features
- Type-safe events via [TS generics](https://www.typescriptlang.org/docs/handbook/2/generics.html), avoiding type wrappers
- Built-in logging options for each environment 
- Error-safe developer mode for browser
- Calls can receive response from called environments via Promises (browser -> server -> browser, etc.)
- Actual human-readable errors

# Docs
## [Extended version available here](https://git.entityseven.com/entityseven/rage-framework/wiki/RPC%400.2.5)

## register
Registers a callback function for a specified event
```ts
rpc.register('playerJoin', (player) => {
  console.log(`Connected: ${player.socialClub}`)
})
```

## unregister
Unregisters callback function for a specified event
```ts
rpc.unregister('playerDamage')
```

## callClient
Calls a client-side event from server or browser

From browser:
```ts
rpc.callClient('updatePlayerData', ['argument']).then(response => {
    console.log(`Received: ${response}`)
})
```
From server (requires player):
```ts
rpc.callClient(player, 'updatePlayerData', ['argument']).then(response => {
    console.log(`Received: ${response}`)
})
```

## callServer
Calls a server-side event from browser or client
```ts
rpc.callServer('updatePlayerData', ['argument']).then(response => {
  console.log(`Received: ${response}`)
})
```

## callBrowser
Calls a server-side event from browser or client

From client:
```ts
rpc.callBrowser('updatePlayerData', ['argument']).then(response => {
    console.log(`Received: ${response}`)
})
```
From client (requires player):
```ts
rpc.callBrowser(player, 'updatePlayerData', ['argument']).then(response => {
    console.log(`Received: ${response}`)
})
```

## call
Calls an event in current environment
```ts
rpc.call('triggerSomething').then(response => {
    console.log(`Received: ${response}`)
})
```
import { Environment, utils } from './utils'
import { EVENT_LISTENER } from './events'

import { client } from './modules/client'
import { server } from './modules/server'
import { cef } from './modules/cef'

class Rpc {
    private _environment = utils.getEnvironment()
    private _state =
        utils.getEnvironment() === Environment.CEF
            ? window.rpcEvents
            : global.rpcEvents

    constructor() {
        if (this._environment === Environment.UNKNOWN) return

        mp.events.add(EVENT_LISTENER, async (player: any, request: string) => {
            switch (this._environment) {
                case Environment.SERVER:
                    await server.listenEvent(player, request)
                    break

                case Environment.CLIENT:
                    request = player

                    // await client.listenEvent(request)
                    break

                case Environment.CEF:
                    request = player
                //
                // await cef
            }
        })
    }

    public register<Callback extends any[] = unknown[], Return = unknown>(
        eventName: string,
        cb: (...args: Callback) => Return,
    ) {
        if (this._environment === Environment.UNKNOWN) return
        this._state[eventName] = cb
    }

    public async callClient<Args extends any[] = unknown[], Return = unknown>(
        player: any,
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        if (this._environment === Environment.UNKNOWN) return
        if (this._environment === Environment.SERVER) {
            // return client.executeClient(player, eventName, args)
        }
    }

    public async callServer<Args extends any[] = unknown[], Return = unknown>(
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        switch (this._environment) {
            case Environment.UNKNOWN:
                return

            case Environment.SERVER:
                return

            case Environment.CEF:
                return client

            case Environment.CLIENT:
                return server.executeServer(eventName, args)
        }
    }
}

const testRpc = new Rpc()
export { testRpc }

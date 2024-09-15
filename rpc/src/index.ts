import { RPC_LISTENER } from './events'
import { Environment, utils } from './utils'

import { client } from './client'
import { server } from './server'
import type { RPCData } from './types.ts'

class FrameworkRpc {
    private readonly _environment: Environment
    private readonly _environmentGlobal: Record<string, Function>

    constructor() {
        this._environment = utils.getEnvironment()
        this._environmentGlobal =
            utils.getEnvironment() === utils.environment.CEF
                ? window.rpcEvents
                : global.rpcEvents

        mp.events.add(RPC_LISTENER, async (player: any, data: string) => {
            switch (this._environment) {
                case utils.environment.UNKNOWN:
                    return

                case utils.environment.CLIENT:
                    player = data
                    return client.listen(player)

                case utils.environment.SERVER:
                    return server.listen(player, data)

                case utils.environment.CEF:
            }
        })
    }

    public register<Args extends any[] = unknown[], Return = unknown>(
        eventName: string,
        cb: (...args: Args) => Return,
    ) {
        if (this._environment === utils.environment.UNKNOWN) return
        this._environmentGlobal[eventName] = cb
    }

    public callClient<Args extends any[] = unknown[], Return = unknown>(
        player: any,
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        return new Promise((resolve, _reject) => {
            const uuid = utils.generateUUID()

            const data: RPCData = {
                uuid,
                eventName,
                from: this._environment,
                to: utils.environment.CLIENT,
                data: args,
            }

            player.call(RPC_LISTENER, [utils.stringifyData(data)])

            const responseEventName = utils.generateResponseEventName(uuid)

            const handler = (_player: any, data: string) => {
                resolve(utils.parseData(data).data)
                mp.events.remove(responseEventName)
            }

            mp.events.add(responseEventName, handler)
        })
    }

    public callServer<Args extends any[] = unknown[], Return = unknown>(
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        return new Promise((resolve, _reject) => {
            const uuid = utils.generateUUID()

            const data: RPCData = {
                uuid,
                eventName,
                from: this._environment,
                to: utils.environment.CLIENT,
                data: args,
            }

            mp.events.callRemote(RPC_LISTENER, utils.stringifyData(data))

            const responseEventName = utils.generateResponseEventName(uuid)

            const handler = (_player: any, data: string) => {
                resolve(utils.parseData(data).data)
                mp.events.remove(responseEventName)
            }

            mp.events.add(responseEventName, handler)
        })
    }
}

const rpc = new FrameworkRpc()

export { rpc }

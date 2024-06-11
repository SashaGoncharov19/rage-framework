import rpc from 'rage-rpc'

import Logger from './logger'

import {
    RageFW_ClientEventCallback,
    RageFW_ClientEvent,
    RageFW_ClientServerEvent,
    RageFW_ClientServerEventArguments,
    RageFW_ClientServerEventReturn,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
} from './types'
import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

class Client {
    public register<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        callback: RageFW_ClientEventCallback<EventName>,
    ): void {
        rpc.register(eventName, data => {
            return callback(data)
        })
    }

    public unregister<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
    ): void {
        rpc.unregister(eventName)
    }

    public trigger<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        args: RageFW_ClientEventArguments<EventName>,
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.call<RageFW_ClientEventReturn<EventName>>(eventName, args)
    }
}

class Player {
    public triggerServer<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        args: RageFW_ClientServerEventArguments<EventName>,
    ): Promise<RageFW_ClientServerEventReturn<EventName>> {
        return rpc.callServer(eventName, args)
    }
}

export const fw = {
    event: new Client(),
    player: new Player(),
    system: {
        log: new Logger(),
    },
}

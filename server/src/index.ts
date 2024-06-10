import rpc from 'rage-rpc'
import {
    RageFW_ClientEvent,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
    RageFW_ServerEvent,
    RageFW_ServerEventCallback,
} from './types.js'
import { nativeEvents } from './native.events'

class Server {
    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void {
        if (nativeEvents.includes(eventName)) {
            mp.events.add(eventName, callback)
        } else {
            rpc.register(eventName, callback as rpc.ProcedureListener)
        }
    }

    public registerMany<EventName extends RageFW_ServerEvent>(events: {
        [event in EventName]: RageFW_ServerEventCallback<event>
    }): void {
        Object.entries(events).map(([eventName, callback]) => {
            if (nativeEvents.includes(eventName)) {
                mp.events.add(
                    eventName as keyof IServerEvents,
                    callback as (...arg: unknown[]) => void,
                )
            } else {
                rpc.register(eventName, (args: unknown[]) => {
                    return Array.isArray(args)
                        ? (callback as (...arg: typeof args) => void)(...args)
                        : (callback as (arg: typeof args) => void)(args)
                })
            }
        })
    }
}

class Player {
    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: RageFW_ClientEventArguments<EventName>
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.callClient(player, eventName, args)
    }
}

export const fw = {
    event: new Server(),
    player: new Player(),
}

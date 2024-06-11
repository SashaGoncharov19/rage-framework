import rpc from 'rage-rpc'
import {
    RageFW_ClientEvent,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
    RageFW_ServerEvent,
    RageFW_ServerEventCallback,
} from './types.js'
import { nativeEvents } from './native.events'
import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

class Server {
    private isNativeEvent(eventName: string): eventName is keyof IServerEvents {
        return nativeEvents.includes(eventName)
    }

    private isCustomEvent(
        eventName: string,
    ): eventName is keyof RageFW_ICustomServerEvent {
        return !nativeEvents.includes(eventName)
    }

    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void {
        if (this.isNativeEvent(eventName)) {
            mp.events.add(eventName, callback)
        } else if (this.isCustomEvent(eventName)) {
            rpc.register(eventName, callback as rpc.ProcedureListener)
        }
    }

    public registerMany<EventName extends RageFW_ServerEvent>(events: {
        [event in EventName]: RageFW_ServerEventCallback<event>
    }): void {
        Object.entries<RageFW_ServerEventCallback<EventName>>(events).map(
            ([eventName, callback]) => {
                if (this.isNativeEvent(eventName)) {
                    mp.events.add(eventName, callback)
                } else if (this.isCustomEvent(eventName)) {
                    rpc.register(eventName, (args: unknown[]) => {
                        return Array.isArray(args)
                            ? (callback as (...arg: typeof args) => void)(
                                  ...args,
                              )
                            : (callback as (arg: typeof args) => void)(args)
                    })
                }
            },
        )
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

fw.event.registerMany({
    playerDeath: (player, arg, killer) => undefined,
    customServerEvent(player, rofls) {
        return true
    },
})

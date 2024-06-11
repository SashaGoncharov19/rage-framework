import rpc from 'rage-rpc'
import {
    RageFW_ClientEvent,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
    RageFW_ServerEvent,
    RageFW_ServerEventCallback,
    RageFW_ServerEventCallbackCustom,
    RageFW_ServerEventCallbackNative,
} from './types.js'
import { nativeEvents } from './native.events'
import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

class Server {
    private isNativeEvent(eventName: string): eventName is keyof IServerEvents {
        return nativeEvents.includes(eventName)
    }

    private registerCustom<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallbackCustom<EventName>,
    ): void {
        rpc.register(
            eventName,
            async (
                args: Parameters<RageFW_ICustomServerEvent[EventName]>,
                info,
            ) => {
                callback(info.player as PlayerMp, args)
            },
        )
    }

    private registerNative<EventName extends keyof IServerEvents>(
        eventName: EventName,
        callback: RageFW_ServerEventCallbackNative<EventName>,
    ): void {
        mp.events.add(eventName, callback)
    }

    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void {
        if (this.isNativeEvent(eventName)) {
            this.registerNative(
                eventName,
                callback as RageFW_ServerEventCallbackNative,
            )
        } else {
            this.registerCustom(
                eventName,
                callback as RageFW_ServerEventCallbackCustom,
            )
        }
    }

    public registerMany<EventName extends RageFW_ServerEvent>(events: {
        [event in EventName]: RageFW_ServerEventCallback<event>
    }): void {
        Object.entries<RageFW_ServerEventCallback<EventName>>(events).map(
            ([eventName, callback]) => {
                if (this.isNativeEvent(eventName)) {
                    this.registerNative(
                        eventName,
                        callback as RageFW_ServerEventCallbackNative,
                    )
                } else {
                    this.registerCustom(
                        eventName as keyof RageFW_ICustomServerEvent,
                        callback as RageFW_ServerEventCallbackCustom,
                    )
                }
            },
        )
    }
}

class Player {
    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        args: RageFW_ClientEventArguments<EventName>,
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.callClient(player, eventName, args)
    }
}

export const fw = {
    event: new Server(),
    player: new Player(),
}

fw.event.register('customServerEvent', (player, args) => true)
fw.event.register('playerDeath', (player, args, killer) => {})

fw.event.registerMany({
    trailerAttached: (vehicle, trailer) => undefined,
})

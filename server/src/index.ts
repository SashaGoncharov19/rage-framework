import rpc from 'rage-rpc'

import Logger from './logger'

import {
    RageFW_CefArgs,
    RageFW_CefEvent,
    RageFW_CefReturn,
    _CefEventHasArgs,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_ClientEvent,
    RageFW_ServerClientEventArguments,
    RageFW_ServerClientEventReturn,
    RageFW_ICustomServerEvent,
    RageFW_ServerEvent,
    RageFW_ServerEventArguments,
    RageFW_ServerEventCallback,
    RageFW_ServerEventCallbackCustom,
    RageFW_ServerEventCallbackNative,
    RageFW_ServerEventReturn,
} from './types'
import { nativeEvents } from './native.events'

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
            async (args: RageFW_ServerEventArguments<EventName>, info) => {
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
                callback as unknown as RageFW_ServerEventCallbackCustom,
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
                        callback as unknown as RageFW_ServerEventCallbackCustom,
                    )
                }
            },
        )
    }

    private unregisterCustom<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
    ): void {
        rpc.unregister(eventName)
    }

    private unregisterNative<EventName extends keyof IServerEvents>(
        eventName: EventName,
    ): void {
        mp.events.remove(eventName)
    }

    public unregister<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
    ): void {
        if (this.isNativeEvent(eventName)) {
            this.unregisterNative(eventName)
        } else {
            this.unregisterCustom(eventName)
        }
    }

    public trigger<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ServerEventArguments<EventName>]
            : []
    ): Promise<RageFW_ServerEventReturn<EventName>> {
        return rpc.call<RageFW_ServerEventReturn<EventName>>(eventName, args)
    }
}

class Player {
    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ServerClientEventArguments<EventName>]
            : []
    ): Promise<RageFW_ServerClientEventReturn<EventName>> {
        return rpc.callClient(player, eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        return rpc.callBrowsers(player, eventName, args)
    }
}

export const fw = {
    event: new Server(),
    player: new Player(),
    system: {
        log: new Logger(),
    },
}

fw.system.log.info(
    'Working on Rage Framework. RageFW © Powered by Entity Seven Group',
)

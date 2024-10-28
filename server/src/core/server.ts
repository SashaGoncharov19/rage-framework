import { Rpc } from '@entityseven/rage-fw-rpc'
import { RageFW_ICustomServerEvent } from '@entityseven/rage-fw-shared-types'

import { nativeEvents } from '../data/nativeEvents'
import type * as T from '../types'

export class Server {
    private _rpc: Rpc = new Rpc()

    get rpc(): Rpc {
        return this._rpc
    }

    private isNativeEvent(eventName: string): eventName is keyof IServerEvents {
        return nativeEvents.includes(eventName)
    }

    private registerCustom<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        callback: T.RageFW_ServerCallbackCustom<EventName>,
    ): void {
        this._rpc.register(
            eventName,
            // fixme
            async (args: T.RageFW_ServerArgs<EventName>, info) => {
                await callback([info.player as PlayerMp, ...args])
            },
        )
    }

    private registerNative<EventName extends keyof IServerEvents>(
        eventName: EventName,
        callback: T.RageFW_ServerCallbackNative<EventName>,
    ): void {
        mp.events.add(
            eventName,
            (...args: Parameters<IServerEvents[EventName]>) =>
                callback([...args]),
        )
    }

    public register<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        callback: T.RageFW_ServerCallback<EventName>,
    ): void {
        if (this.isNativeEvent(eventName)) {
            this.registerNative(
                eventName,
                callback as T.RageFW_ServerCallbackNative,
            )
        } else {
            this.registerCustom(
                eventName,
                callback as unknown as T.RageFW_ServerCallbackCustom,
            )
        }
    }

    public registerMany<EventName extends T.RageFW_ServerEvent>(events: {
        [event in EventName]: T.RageFW_ServerCallback<event>
    }): void {
        Object.entries<T.RageFW_ServerCallback<EventName>>(events).map(
            ([eventName, callback]) => {
                if (this.isNativeEvent(eventName)) {
                    this.registerNative(
                        eventName,
                        callback as T.RageFW_ServerCallbackNative,
                    )
                } else {
                    this.registerCustom(
                        eventName as keyof RageFW_ICustomServerEvent,
                        callback as unknown as T.RageFW_ServerCallbackCustom,
                    )
                }
            },
        )
    }

    private unregisterCustom<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
    ): void {
        this._rpc.unregister(eventName)
    }

    private unregisterNative<EventName extends keyof IServerEvents>(
        eventName: EventName,
    ): void {
        mp.events.remove(eventName)
    }

    public unregister<EventName extends T.RageFW_ServerEvent>(
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
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ServerReturn<EventName>> {
        return this._rpc.call(eventName, args)
    }
}

import { Rpc } from 'rage-fw-rpc'
import { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

import { nativeEvents } from '../native.events'
import type {
    _ServerEventHasArgs,
    RageFW_ServerArgs,
    RageFW_ServerCallback,
    RageFW_ServerCallbackCustom,
    RageFW_ServerCallbackNative,
    RageFW_ServerEvent,
    RageFW_ServerReturn,
} from '../types'

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
        callback: RageFW_ServerCallbackCustom<EventName>,
    ): void {
        this._rpc.register(
            eventName,
            // fixme
            async (args: RageFW_ServerArgs<EventName>, info) => {
                await callback([info.player as PlayerMp, ...args])
            },
        )
    }

    private registerNative<EventName extends keyof IServerEvents>(
        eventName: EventName,
        callback: RageFW_ServerCallbackNative<EventName>,
    ): void {
        mp.events.add(
            eventName,
            (...args: Parameters<IServerEvents[EventName]>) =>
                callback([...args]),
        )
    }

    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerCallback<EventName>,
    ): void {
        if (this.isNativeEvent(eventName)) {
            this.registerNative(
                eventName,
                callback as RageFW_ServerCallbackNative,
            )
        } else {
            this.registerCustom(
                eventName,
                callback as unknown as RageFW_ServerCallbackCustom,
            )
        }
    }

    public registerMany<EventName extends RageFW_ServerEvent>(events: {
        [event in EventName]: RageFW_ServerCallback<event>
    }): void {
        Object.entries<RageFW_ServerCallback<EventName>>(events).map(
            ([eventName, callback]) => {
                if (this.isNativeEvent(eventName)) {
                    this.registerNative(
                        eventName,
                        callback as RageFW_ServerCallbackNative,
                    )
                } else {
                    this.registerCustom(
                        eventName as keyof RageFW_ICustomServerEvent,
                        callback as unknown as RageFW_ServerCallbackCustom,
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
            ? [RageFW_ServerArgs<EventName>]
            : []
    ): Promise<RageFW_ServerReturn<EventName>> {
        return this._rpc.call(eventName, args)
    }
}

import { Rpc } from '@entityseven/rage-fw-rpc'
import type * as T from './types'

class Cef {
    private _debugMode: boolean = false
    private _rpc: Rpc = new Rpc()

    constructor() {}

    set debug(debug: boolean) {
        this._debugMode = debug
    }

    get rpc(): Rpc {
        return this._rpc
    }

    public register<EventName extends keyof T.RageFW_ICustomCefEvent>(
        eventName: EventName,
        callback: T.RageFW_CefCallback<EventName>,
    ): void {
        if (this._debugMode) {
            console.log('[RPC](register):', eventName, callback)
        }

        if ('mp' in window) {
            this._rpc.register(eventName, callback)
        }
    }

    public async trigger<EventName extends keyof T.RageFW_ICustomCefEvent>(
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_CefArgs<EventName>]
            : []
    ): Promise<T.RageFW_CefReturn<EventName>> {
        if (this._debugMode) {
            console.log('[RPC](trigger):', eventName, ...args)
        }

        if ('mp' in window) {
            return await this._rpc.call(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which does not contain MP',
        )
    }

    public async triggerServer<
        EventName extends keyof T.RageFW_ICustomServerEvent,
    >(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ServerReturn<EventName>> {
        if (this._debugMode) {
            console.log('[RPC](triggerServer):', eventName, ...args)
        }

        if ('mp' in window) {
            return await this._rpc.callServer(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which does not contain MP',
        )
    }

    public async triggerClient<
        EventName extends keyof T.RageFW_ICustomClientEvent,
    >(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        if (this._debugMode) {
            console.log('[RPC](triggerClient):', eventName, ...args)
        }

        if ('mp' in window) {
            return await this._rpc.callClient(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which does not contain MP',
        )
    }
}

export const fw = {
    event: new Cef(),
}
;(async () => {
    await fw.event.triggerClient('cefReady')
})()

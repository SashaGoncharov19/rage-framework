import rpc from 'rage-rpc'

import {
    _CefEventHasArgs,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_CefArgs,
    RageFW_CefCallback,
    RageFW_CefReturn,
    RageFW_ClientArgs,
    RageFW_ClientReturn,
    RageFW_ICustomCefEvent,
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
    RageFW_ServerArgs,
    RageFW_ServerReturn,
} from './types'

class Cef {
    public register<EventName extends keyof RageFW_ICustomCefEvent>(
        eventName: EventName,
        callback: RageFW_CefCallback<EventName>,
    ): void {
        if ('mp' in window) {
            rpc.register(eventName, callback)
        }
    }

    public trigger<EventName extends keyof RageFW_ICustomCefEvent>(
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        if ('mp' in window) {
            return rpc.call(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which does not contain MP',
        )
    }

    public triggerServer<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ServerArgs<EventName>]
            : []
    ): Promise<RageFW_ServerReturn<EventName>> {
        if ('mp' in window) {
            return rpc.callServer(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which does not contain MP',
        )
    }

    public triggerClient<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ClientArgs<EventName>]
            : []
    ): Promise<RageFW_ClientReturn<EventName>> {
        if ('mp' in window) {
            return rpc.callClient(eventName, args)
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

import rpc from 'rage-rpc'

import {
    _CefEventHasArgs,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_CefArguments,
    RageFW_CefCallback,
    RageFW_CefReturn,
    RageFW_ClientArguments,
    RageFW_ClientReturn,
    RageFW_ICustomCefEvent,
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
    RageFW_ServerArguments,
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
            ? [RageFW_CefArguments<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        if ('mp' in window) {
            return rpc.call(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which not contain global variable MP!',
        )
    }

    public triggerServer<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ServerArguments<EventName>]
            : []
    ): Promise<RageFW_ServerReturn<EventName>> {
        if ('mp' in window) {
            return rpc.callServer(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which not contain global variable MP!',
        )
    }

    public triggerClient<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ClientArguments<EventName>]
            : []
    ): Promise<RageFW_ClientReturn<EventName>> {
        if ('mp' in window) {
            return rpc.callClient(eventName, args)
        }

        return Promise.reject(
            'RageFW was started in window which not contain global variable MP!',
        )
    }
}

export const fw = {
    event: new Cef(),
}

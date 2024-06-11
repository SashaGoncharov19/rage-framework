import rpc from 'rage-rpc'

import {
    RageFW_CefArguments,
    RageFW_CefCallback,
    RageFW_CefReturn,
    RageFW_ClientArguments,
    RageFW_ClientReturn,
    RageFW_ServerArguments,
    RageFW_ServerReturn,
    RageFW_ICustomCefEvent,
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from './types'

class Cef {
    public register<EventName extends keyof RageFW_ICustomCefEvent>(
        eventName: EventName,
        callback: RageFW_CefCallback<EventName>,
    ): void {
        rpc.register(eventName, callback)
    }

    public trigger<EventName extends keyof RageFW_ICustomCefEvent>(
        eventName: EventName,
        args: RageFW_CefArguments<EventName>,
    ): Promise<RageFW_CefReturn<EventName>> {
        return rpc.call(eventName, args)
    }

    public triggerServer<EventName extends keyof RageFW_ICustomServerEvent>(
        eventName: EventName,
        args: RageFW_ServerArguments<EventName>,
    ): Promise<RageFW_ServerReturn<EventName>> {
        return rpc.callServer(eventName, args)
    }

    public triggerClient<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        args: RageFW_ClientArguments<EventName>,
    ): Promise<RageFW_ClientReturn<EventName>> {
        return rpc.callClient(eventName, args)
    }
}

export const fw = {
    event: new Cef(),
}

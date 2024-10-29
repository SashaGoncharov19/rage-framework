import { Helper } from './helper'
import { rpc } from './rpc'
import type * as T from '../types'
import {
    RageFW_BrowserEvent,
    RageFW_ClientEvent,
    RageFW_ServerEvent,
} from '../types'

export class Browser extends Helper {
    constructor() {
        super()
    }

    set debugLogs(debug: boolean) {
        this.debugLogs_ = debug
    }

    set customLogger(
        fn: (method: string, eventName: string, ...args: unknown[]) => unknown,
    ) {
        this.customLogger_ = fn
    }

    public register<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
        callback: T.RageFW_BrowserCallback<EventName>,
    ): Browser {
        this.log_('register', eventName, callback)

        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback>,
            EventName
        >(eventName, async (...data) => await callback(...data))

        return this
    }

    public unregister<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
    ): Browser {
        rpc.unregister<EventName>(eventName)

        return this
    }

    public async trigger<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.RageFW_BrowserArgs<EventName>]
            : []
    ): Promise<T.RageFW_BrowserReturn<EventName>> {
        this.log_('[RPC](trigger):', eventName, ...args)

        return await rpc.call<
            typeof args,
            EventName,
            T.RageFW_BrowserReturn<EventName>
        >(eventName, args)
    }

    public async triggerServer<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ServerReturn<EventName>> {
        this.log_('[RPC](triggerServer):', eventName, ...args)

        return await rpc.callServer<
            typeof args,
            EventName,
            T.RageFW_ServerReturn<EventName>
        >(eventName, args)
    }

    public async triggerClient<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        this.log_('[RPC](triggerClient):', eventName, ...args)

        return await rpc.callClient<
            typeof args,
            EventName,
            T.RageFW_ClientReturn<EventName>
        >(eventName, args)
    }
}

// new Browser()
//     .register('customCefEvent', async (a, b) => true)
//     .triggerServer('customServerEvent', ['', 1])

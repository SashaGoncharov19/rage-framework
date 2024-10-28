import { rpc } from './rpc'
import type * as T from '../types'

export class Player {
    public browser: BrowserMp | undefined

    public trigger<EventName extends keyof T.RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        return rpc.call<
            typeof args,
            EventName,
            T.RageFW_ClientReturn<EventName>
        >(eventName, args)
    }

    public triggerServer<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientServerReturn<EventName>> {
        return rpc.callServer<
            typeof args,
            EventName,
            T.RageFW_ClientServerReturn<EventName>
        >(eventName, args)
    }

    public triggerBrowser<EventName extends T.RageFW_CefEvent>(
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_CefArgs<EventName>]
            : []
    ): Promise<T.RageFW_CefReturn<EventName>> {
        if (!this.browser)
            throw new Error('You need to initialize browser first')
        return rpc.callBrowser<
            typeof args,
            EventName,
            T.RageFW_CefReturn<EventName>
        >(this.browser, eventName, args)
    }
}

// new Player().trigger('customClientEvent', ['', 1])
// new Player().triggerServer('customServerEvent', ['', 1])
// new Player().triggerBrowser('customCefEvent', ['', 1])

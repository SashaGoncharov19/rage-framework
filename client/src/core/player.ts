import { rpc } from './rpc'
import type * as T from '../types'

export class Player {
    private _browser: BrowserMp | undefined = undefined

    set browser(browser: BrowserMp) {
        this._browser = browser
        rpc.browser = browser
    }

    public async trigger<EventName extends keyof T.RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        return await rpc.call<
            typeof args,
            EventName,
            T.RageFW_ClientReturn<EventName>
        >(eventName, args)
    }

    public async triggerServer<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientServerReturn<EventName>> {
        return await rpc.callServer<
            typeof args,
            EventName,
            T.RageFW_ClientServerReturn<EventName>
        >(eventName, args)
    }

    public async triggerBrowser<EventName extends T.RageFW_CefEvent>(
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_CefArgs<EventName>]
            : []
    ): Promise<T.RageFW_CefReturn<EventName>> {
        if (!this._browser)
            throw new Error('You need to initialize browser first')

        return await rpc.callBrowser<
            typeof args,
            EventName,
            T.RageFW_CefReturn<EventName>
        >(eventName, args)
    }
}

// new Player().trigger('customClientEvent', ['', 1])
// new Player().triggerServer('customServerEvent', ['', 1])
// new Player().triggerBrowser('customCefEvent', ['', 1])

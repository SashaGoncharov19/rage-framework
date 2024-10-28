import { Rpc } from '@entityseven/rage-fw-rpc'
import type { RageFW_ICustomClientEvent } from '@entityseven/rage-fw-shared-types'

import type * as T from '../types'

export class Player {
    private _rpc: Rpc = new Rpc()
    public browser: BrowserMp | undefined

    get rpc(): Rpc {
        return this._rpc
    }
    public trigger<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        return this._rpc.call(eventName, args)
    }

    public triggerServer<EventName extends T.RageFW_ClientServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientServerReturn<EventName>> {
        return this._rpc.callServer(eventName, args)
    }

    public triggerBrowser<EventName extends T.RageFW_CefEvent>(
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_CefArgs<EventName>]
            : []
    ): Promise<T.RageFW_CefReturn<EventName>> {
        if (!this.browser)
            throw new Error('You need to initialize browser first')
        return this._rpc.callBrowser(this.browser, eventName, args)
    }
}

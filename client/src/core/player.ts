import { Rpc } from 'rage-fw-rpc'
import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

import {
    _CefEventHasArgs,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_CefArgs,
    RageFW_CefEvent,
    RageFW_CefReturn,
    RageFW_ClientArgs,
    RageFW_ClientReturn,
    RageFW_ClientServerEvent,
    RageFW_ClientServerArgs,
    RageFW_ClientServerReturn,
} from '../types'

export class Player {
    private _rpc: Rpc = new Rpc()
    public browser: BrowserMp | undefined

    get rpc(): Rpc {
        return this._rpc
    }
    public trigger<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ClientArgs<EventName>]
            : []
    ): Promise<RageFW_ClientReturn<EventName>> {
        return this._rpc.call(eventName, args)
    }

    public triggerServer<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ClientServerArgs<EventName>]
            : []
    ): Promise<RageFW_ClientServerReturn<EventName>> {
        return this._rpc.callServer(eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        if (!this.browser)
            throw new Error('You need to initialize browser first')
        return this._rpc.callBrowser(this.browser, eventName, args)
    }
}

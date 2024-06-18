import rpc from 'rage-rpc'
import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

import {
    _CefEventHasArgs,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_CefArgs,
    RageFW_CefEvent,
    RageFW_CefReturn,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
    RageFW_ClientServerEvent,
    RageFW_ClientServerEventArguments,
    RageFW_ClientServerEventReturn,
} from '../types'

export class Player {
    public browser: BrowserMp | undefined

    public trigger<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ClientEventArguments<EventName>]
            : []
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.call<RageFW_ClientEventReturn<EventName>>(eventName, args)
    }

    public triggerServer<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ClientServerEventArguments<EventName>]
            : []
    ): Promise<RageFW_ClientServerEventReturn<EventName>> {
        return rpc.callServer(eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        if (!this.browser)
            throw new Error('You need to initialize browser first!')
        return rpc.callBrowser(this.browser, eventName, args)
    }
}

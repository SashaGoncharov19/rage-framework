import rpc from 'rage-rpc'

import {
    _CefEventHasArgs,
    _ClientEventHasArgs,
    RageFW_CefArgs,
    RageFW_CefEvent,
    RageFW_CefReturn,
    RageFW_ClientEvent,
    RageFW_ServerClientArgs,
    RageFW_ServerClientReturn,
} from '../types'

export class Player {
    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ServerClientArgs<EventName>]
            : []
    ): Promise<RageFW_ServerClientReturn<EventName>> {
        return rpc.callClient(player, eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        return rpc.callBrowsers(player, eventName, args)
    }
}

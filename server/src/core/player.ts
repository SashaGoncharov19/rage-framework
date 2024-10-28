import { Rpc } from 'rage-fw-rpc'

import type {
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
    private _rpc: Rpc = new Rpc()

    get rpc(): Rpc {
        return this._rpc
    }

    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ServerClientArgs<EventName>]
            : []
    ): Promise<RageFW_ServerClientReturn<EventName>> {
        return this._rpc.callClient(player, eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: _CefEventHasArgs<EventName> extends true
            ? [RageFW_CefArgs<EventName>]
            : []
    ): Promise<RageFW_CefReturn<EventName>> {
        return this._rpc.callBrowser(player, eventName, args)
    }
}

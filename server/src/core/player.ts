import { Rpc } from '@entityseven/rage-fw-rpc'

import type * as T from '../types'

export class Player {
    private _rpc: Rpc = new Rpc()

    get rpc(): Rpc {
        return this._rpc
    }

    public triggerClient<EventName extends T.RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ServerClientReturn<EventName>> {
        return this._rpc.callClient(player, eventName, args)
    }

    public triggerBrowser<EventName extends T.RageFW_CefEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_CefArgs<EventName>]
            : []
    ): Promise<T.RageFW_CefReturn<EventName>> {
        return this._rpc.callBrowser(player, eventName, args)
    }
}

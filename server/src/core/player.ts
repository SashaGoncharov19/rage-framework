import { rpc } from './rpc'
import type * as T from '../types'

export class Player {
    public async triggerClient<EventName extends T.RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        return await rpc.callClient(player, eventName, args)
    }

    public async triggerBrowser<EventName extends T.RageFW_BrowserEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._CefEventHasArgs<EventName> extends true
            ? [T.RageFW_BrowserArgs<EventName>]
            : []
    ): Promise<T.RageFW_BrowserReturn<EventName>> {
        return await rpc.callBrowser(player, eventName, args)
    }
}

// new Player().triggerBrowser({} as PlayerMp, 'customCefEvent', ['', 1])
// new Player().triggerClient({} as PlayerMp, 'customClientEvent', ['', 1])

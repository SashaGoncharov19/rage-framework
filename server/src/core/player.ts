import { rpc } from './rpc'
import type * as T from '../types'

/** Handles event manipulations that require player to be present in context */
export class FW_Player {
    /**
     * Triggers a client event from the server with arguments from shared types
     *
     * Formerly known as ``callClient`` or ``emitClient``
     *
     * @param {PlayerMp} player - Player object as an event target
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {Promise} resolving to the client's response for the event
     *
     * @example
     * // Triggering a client event without arguments
     * fw.player.triggerClient("clientEventName")
     *
     * @example
     * // Triggering a client event with arguments
     * fw.player.triggerClient("clientEventName", ["message to client"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerClient<EventName extends T.FW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): Promise<T.FW_ClientReturn<EventName>> {
        return await rpc.callClient(player, eventName, args)
    }

    /**
     * Triggers a browser event from the server with arguments from shared types
     *
     * Formerly known as ``callBrowser`` or ``emitBrowser``
     *
     * @param {PlayerMp} player - Player object as an event target
     * @param eventName - The name of the browser event to trigger
     * @param [args] - Arguments for the browser event, if present
     * @returns {Promise} resolving to the browser's response for the event
     *
     * @example
     * // Triggering a browser event without arguments
     * fw.player.triggerBrowser("browserEventName")
     *
     * @example
     * // Triggering a browser event with arguments
     * fw.player.triggerBrowser("browserEventName", ["message to browser"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerBrowser<EventName extends T.FW_BrowserEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): Promise<T.FW_BrowserReturn<EventName>> {
        return await rpc.callBrowser(player, eventName, args)
    }
}

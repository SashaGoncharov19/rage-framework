import { rpc } from './rpc'
import type * as T from '../types'

/** Handles event manipulations that require player to be present in context */
export class FW_Player {
    /**
     * Triggers a client event from the server with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callClient`` or ``emitClient``
     *
     * @param {PlayerMp} player - Player object as an event target
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {void}
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
    public triggerClient<EventName extends T.FW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): void {
        rpc.callClient<typeof args, EventName>(player, eventName, args)
    }

    /**
     * Triggers an asynchronous client event from the server with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callClientAsync`` or ``emitClientAsync``
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
    public async triggerClientAsync<EventName extends T.FW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): Promise<T.FW_ClientReturn<EventName>> {
        return await rpc.callClientAsync<
            typeof args,
            EventName,
            T.FW_ClientReturn<EventName>
        >(player, eventName, args)
    }

    /**
     * Triggers a browser event from the server with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callBrowser`` or ``emitBrowser``
     *
     * @param {PlayerMp} player - Player object as an event target
     * @param eventName - The name of the browser event to trigger
     * @param [args] - Arguments for the browser event, if present
     * @returns {void}
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
    public triggerBrowser<EventName extends T.FW_BrowserEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): void {
        rpc.callBrowser<typeof args, EventName>(player, eventName, args)
    }

    /**
     * Triggers an asynchronous browser event from the server with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callBrowserAsync`` or ``emitBrowserAsync``
     *
     * @param {PlayerMp} player - Player object as an event target
     * @param eventName - The name of the browser event to trigger
     * @param [args] - Arguments for the browser event, if present
     * @returns {Promise} resolving to the browser's response for the event
     *
     * @example
     * // Triggering a browser event without arguments
     * fw.player.triggerBrowserAsync("browserEventName")
     *
     * @example
     * // Triggering a browser event with arguments
     * fw.player.triggerBrowserAsync("browserEventName", ["message to browser"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerBrowserAsync<EventName extends T.FW_BrowserEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): Promise<T.FW_BrowserReturn<EventName>> {
        return await rpc.callBrowserAsync<
            typeof args,
            EventName,
            T.FW_BrowserReturn<EventName>
        >(player, eventName, args)
    }
}

import { rpc } from './rpc'
import type * as T from '../types'

/** Handles event manipulations that require player to be present in context */
export class Player {
    private _browser: BrowserMp | undefined = undefined

    /**
     * Setter. Also shares browser with ``rage-fw-rpc``
     */
    set browser(browser: BrowserMp) {
        this._browser = browser
        rpc.browser = browser
    }

    /**
     * Triggers a client event from the client with arguments from shared types
     *
     * Formerly known as ``call`` or ``emit``
     *
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {Promise} resolving to the client's response for the event
     *
     * @example
     * // Triggering a client event without arguments
     * fw.player.trigger("clientEventName")
     *
     * @example
     * // Triggering a client event with arguments
     * fw.player.trigger("clientEventName", ["message to me"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
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

    /**
     * Triggers a server event from the client with arguments from shared types
     *
     * Formerly known as ``callServer`` or ``emitServer``
     *
     * @param eventName - The name of the server event to trigger
     * @param [args] - Arguments for the server event, if present
     * @returns {Promise} resolving to the server's response for the event
     *
     * @example
     * // Triggering a server event without arguments
     * fw.player.triggerServer("serverEventName")
     *
     * @example
     * // Triggering a server event with arguments
     * fw.player.triggerServer("serverEventName", ["message to server"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
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

    /**
     * Triggers a browser event from the client with arguments from shared types
     *
     * Formerly known as ``callBrowser`` or ``emitBrowser``
     *
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
    public async triggerBrowser<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.RageFW_BrowserArgs<EventName>]
            : []
    ): Promise<T.RageFW_BrowserReturn<EventName>> {
        if (!this._browser)
            throw new Error('You need to initialize browser first')

        return await rpc.callBrowser<
            typeof args,
            EventName,
            T.RageFW_BrowserReturn<EventName>
        >(eventName, args)
    }
}

// new Player().trigger('customClientEvent', ['', 1])
// new Player().triggerServer('customServerEvent', ['', 1])
// new Player().triggerBrowser('customCefEvent', ['', 1])

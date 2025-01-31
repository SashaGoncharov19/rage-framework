import { rpc } from './rpc'
import type * as T from '../types'

/** Handles event manipulations that require player to be present in context */
export class FW_Player {
    private _browser: BrowserMp | undefined = undefined

    /**
     * Setter. Also shares browser with ``rage-fw-rpc``
     */
    set browser(browser: BrowserMp) {
        this._browser = browser
        rpc.browser = browser
    }

    /**
     * Triggers a client event from the client with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``call`` or ``emit``
     *
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {void}
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
    public trigger<EventName extends keyof T.FW_ICustomClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): void {
        rpc.call<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous client event from the client with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callAsync`` or ``emitAsync``
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
    public async triggerAsync<EventName extends keyof T.FW_ICustomClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): Promise<T.FW_ClientReturn<EventName>> {
        return await rpc.callAsync<
            typeof args,
            EventName,
            T.FW_ClientReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a server event from the client with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callServer`` or ``emitServer``
     *
     * @param eventName - The name of the server event to trigger
     * @param [args] - Arguments for the server event, if present
     * @returns {void}
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
    public triggerServer<EventName extends T.FW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.FW_ServerArgs<EventName>]
            : []
    ): void {
        rpc.callServer<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous server event from the client with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callServerAsync`` or ``emitServerAsync``
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
    public async triggerServerAsync<EventName extends T.FW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.FW_ServerArgs<EventName>]
            : []
    ): Promise<T.FW_ClientServerReturn<EventName>> {
        return await rpc.callServerAsync<
            typeof args,
            EventName,
            T.FW_ClientServerReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a browser event from the client with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callBrowser`` or ``emitBrowser``
     *
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
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): void {
        if (!this._browser)
            throw new Error('You need to initialize browser first')

        rpc.callBrowser<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous browser event from the client with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callBrowserAsync`` or ``emitBrowserAsync``
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
    public async triggerBrowserAsync<EventName extends T.FW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): Promise<T.FW_BrowserReturn<EventName>> {
        if (!this._browser)
            throw new Error('You need to initialize browser first')

        return await rpc.callBrowserAsync<
            typeof args,
            EventName,
            T.FW_BrowserReturn<EventName>
        >(eventName, args)
    }
}

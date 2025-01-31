import { FW_Helper } from './helper'
import { rpc } from './rpc'
import type * as T from '../types'

/** Browser-side interactions */
export class FW_Browser extends FW_Helper {
    constructor() {
        super()
    }

    /**
     * Setter. Enables console debug logs for events
     */
    set debugLogs(debug: boolean) {
        this.debugLogs_ = debug
    }

    /**
     * Setter. Provides an ability to specify custom logger function to get special formatting. Using this enables ``debugLogs``
     */
    set customLogger(
        fn: (method: string, eventName: string, ...args: unknown[]) => unknown,
    ) {
        this.customLogger_ = fn
    }

    /**
     * Registers a browser event with an associated callback
     *
     * @param eventName - The name of the event to register
     * @param callback - The callback function to be executed when the event is triggered
     * @returns {FW_Browser} The current browser instance, enabling method chaining
     *
     * @example
     * // Registering an event
     * fw.event.register("showNotification", (message, color) => {
     *     // do something
     * })
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public register<EventName extends T.FW_BrowserEvent>(
        eventName: EventName,
        callback: T.FW_BrowserCallback<EventName>,
    ): FW_Browser {
        this.log_('register', eventName, callback)

        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback>,
            EventName
        >(eventName, async (...data) => await callback(...data))

        return this
    }

    /**
     * Unregisters a browser event, removing the associated callback
     *
     * @param eventName - The name of the event to unregister
     * @returns {FW_Browser} The current browser instance, enabling method chaining
     *
     * @example
     * // Unregistering an event
     * fw.event.unregister("showNotification")
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public unregister<EventName extends T.FW_BrowserEvent>(
        eventName: EventName,
    ): FW_Browser {
        rpc.unregister<EventName>(eventName)

        return this
    }

    /**
     * Triggers a browser event from the browser with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``call`` or ``emit``
     *
     * @param eventName - The name of the browser event to trigger
     * @param [args] - Arguments for the browser event, if present
     * @returns {void}
     *
     * @example
     * // Triggering a browser event without arguments
     * fw.event.trigger("browserEventName")
     *
     * @example
     * // Triggering a browser event with arguments
     * fw.event.trigger("browserEventName", ["message to me"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public trigger<EventName extends T.FW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): void {
        this.log_('[RPC](trigger):', eventName, ...args)

        rpc.call<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous browser event from the browser with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callAsync`` or ``emitAsync``
     *
     * @param eventName - The name of the browser event to trigger
     * @param [args] - Arguments for the browser event, if present
     * @returns {Promise} resolving to the browser's response for the event
     *
     * @example
     * // Triggering a browser event without arguments
     * fw.event.trigger("browserEventName")
     *
     * @example
     * // Triggering a browser event with arguments
     * fw.event.trigger("browserEventName", ["message to me"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerAsync<EventName extends T.FW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.FW_BrowserArgs<EventName>]
            : []
    ): Promise<T.FW_BrowserReturn<EventName>> {
        this.log_('[RPC](trigger):', eventName, ...args)

        return await rpc.callAsync<
            typeof args,
            EventName,
            T.FW_BrowserReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a server event from the browser with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callServer`` or ``emitServer``
     *
     * @param eventName - The name of the server event to trigger
     * @param [args] - Arguments for the server event, if present
     * @returns {void}
     *
     * @example
     * // Triggering a server event without arguments
     * fw.event.triggerServer("serverEventName")
     *
     * @example
     * // Triggering a server event with arguments
     * fw.event.triggerServer("serverEventName", ["message to server"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public triggerServer<EventName extends T.FW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.FW_ServerArgs<EventName>]
            : []
    ): void {
        this.log_('[RPC](triggerServer):', eventName, ...args)

        rpc.callServer<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous server event from the browser with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callServerAsync`` or ``emitServerAsync``
     *
     * @param eventName - The name of the server event to trigger
     * @param [args] - Arguments for the server event, if present
     * @returns {Promise} resolving to the server's response for the event
     *
     * @example
     * // Triggering a server event without arguments
     * fw.event.triggerServer("serverEventName")
     *
     * @example
     * // Triggering a server event with arguments
     * fw.event.triggerServer("serverEventName", ["message to server"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerServerAsync<EventName extends T.FW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.FW_ServerArgs<EventName>]
            : []
    ): Promise<T.FW_ServerReturn<EventName>> {
        this.log_('[RPC](triggerServer):', eventName, ...args)

        return await rpc.callServerAsync<
            typeof args,
            EventName,
            T.FW_ServerReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a browser event from the browser with arguments from 'rage-fw-shared-types'
     *
     * Formerly known as ``callClient`` or ``emitClient``
     *
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {void}
     *
     * @example
     * // Triggering a client event without arguments
     * fw.event.triggerClient("clientEventName")
     *
     * @example
     * // Triggering a client event with arguments
     * fw.event.triggerClient("clientEventName", ["message to client"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public triggerClient<EventName extends T.FW_ClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): void {
        this.log_('[RPC](triggerClient):', eventName, ...args)

        rpc.callClient<typeof args, EventName>(eventName, args)
    }

    /**
     * Triggers an asynchronous client event from the browser with arguments from 'rage-fw-shared-types', and expects to receive a response from an event
     *
     * Formerly known as ``callClientAsync`` or ``emitClientAsync``
     *
     * @param eventName - The name of the client event to trigger
     * @param [args] - Arguments for the client event, if present
     * @returns {Promise} resolving to the client's response for the event
     *
     * @example
     * // Triggering a client event without arguments
     * fw.event.triggerClient("clientEventName")
     *
     * @example
     * // Triggering a client event with arguments
     * fw.event.triggerClient("clientEventName", ["message to client"])
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public async triggerClientAsync<EventName extends T.FW_ClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.FW_ClientArgs<EventName>]
            : []
    ): Promise<T.FW_ClientReturn<EventName>> {
        this.log_('[RPC](triggerClient):', eventName, ...args)

        return await rpc.callClientAsync<
            typeof args,
            EventName,
            T.FW_ClientReturn<EventName>
        >(eventName, args)
    }
}

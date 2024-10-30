import { Helper } from './helper'
import { rpc } from './rpc'
import type * as T from '../types'
import {
    RageFW_BrowserEvent,
    RageFW_ClientEvent,
    RageFW_ServerEvent,
} from '../types'

/** Browser-side interactions */
export class Browser extends Helper {
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
     * @returns {Browser} The current browser instance, enabling method chaining
     *
     * @example
     * // Registering an event
     * fw.event.register("showNotification", (message, color) => {
     *     // do something
     * })
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public register<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
        callback: T.RageFW_BrowserCallback<EventName>,
    ): Browser {
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
     * @returns {Browser} The current browser instance, enabling method chaining
     *
     * @example
     * // Unregistering an event
     * fw.event.unregister("showNotification")
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public unregister<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
    ): Browser {
        rpc.unregister<EventName>(eventName)

        return this
    }

    /**
     * Triggers a browser event from the browser with arguments from shared types
     *
     * Formerly known as ``call`` or ``emit``
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
    public async trigger<EventName extends T.RageFW_BrowserEvent>(
        eventName: EventName,
        ...args: T._BrowserEventHasArgs<EventName> extends true
            ? [T.RageFW_BrowserArgs<EventName>]
            : []
    ): Promise<T.RageFW_BrowserReturn<EventName>> {
        this.log_('[RPC](trigger):', eventName, ...args)

        return await rpc.call<
            typeof args,
            EventName,
            T.RageFW_BrowserReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a server event from the browser with arguments from shared types
     *
     * Formerly known as ``callServer`` or ``emitServer``
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
    public async triggerServer<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        ...args: T._ServerEventHasArgs<EventName> extends true
            ? [T.RageFW_ServerArgs<EventName>]
            : []
    ): Promise<T.RageFW_ServerReturn<EventName>> {
        this.log_('[RPC](triggerServer):', eventName, ...args)

        return await rpc.callServer<
            typeof args,
            EventName,
            T.RageFW_ServerReturn<EventName>
        >(eventName, args)
    }

    /**
     * Triggers a client event from the browser with arguments from shared types
     *
     * Formerly known as ``callClient`` or ``emitClient``
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
    public async triggerClient<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        ...args: T._ClientEventHasArgs<EventName> extends true
            ? [T.RageFW_ClientArgs<EventName>]
            : []
    ): Promise<T.RageFW_ClientReturn<EventName>> {
        this.log_('[RPC](triggerClient):', eventName, ...args)

        return await rpc.callClient<
            typeof args,
            EventName,
            T.RageFW_ClientReturn<EventName>
        >(eventName, args)
    }
}

// new Browser()
//     .register('customCefEvent', async (a, b) => true)
//     .triggerServer('customServerEvent', ['', 1])

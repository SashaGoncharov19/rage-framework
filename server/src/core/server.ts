import { rpc } from './rpc'
import { Middleware } from './middleware'
import type * as T from '../types'

/** Server-side interactions */
export class Server {
    /**
     * Registers a server event with an associated callback
     *
     * @param eventName - The name of the event to register
     * @param callback - The callback function to be executed when the event is triggered
     * @param [options] - Optional settings for callback execution
     * @param [options.middlewares] - Middleware functions to be checked before the callback executes
     * @returns {Server} The current server instance, enabling method chaining
     *
     * @example
     * // Registering an event
     * fw.event.register("playerJoin", (player) => {
     *     fw.system.log.info(`${player.socialClub} has joined the game`)
     * })
     *
     * @example
     * // Registering an event with middlewares
     * fw.event.register("playerJoin", (player) => {
     *     fw.system.log.info(`${player.name} has joined the game`)
     * }, {
     *     middlewares: [ignoreBots] // <- your middlewares here
     * })
     *
     * // or
     *
     * fw.event.register("playerJoin", (player) => {
     *     fw.system.log.info(`${player.socialClub} has joined the game`)
     * }, {
     *     middlewares: {
     *         executables: [ignoreBots], // <- your middlewares here
     *         onError: (msg) => fw.system.log.info(`[BOT] ${player.socialClub} has joined the game`)
     *     }
     * })
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public register<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        callback: T.RageFW_ServerCallback<EventName>,
        options?: {
            middlewares?: T.RageFW_MiddlewareOptions<EventName>
        },
    ): Server {
        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback> | Promise<unknown>,
            EventName
        >(eventName, async (...data) => {
            if (!options?.middlewares) return await callback(...data)

            await Middleware.process(options.middlewares, callback, data)
        })

        return this
    }

    /**
     * Unregisters a server event, removing the associated callback
     *
     * @param eventName - The name of the event to unregister
     * @returns {Server} The current server instance, enabling method chaining
     *
     * @example
     * // Unregistering an event
     * fw.event.unregister("playerJoin")
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public unregister<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
    ): Server {
        rpc.unregister<EventName>(eventName)

        return this
    }

    // fixme
    // public trigger<EventName extends keyof T.RageFW_ICustomServerEvent>(
    //     eventName: EventName,
    //     ...args: T._ServerEventHasArgs<EventName> extends true
    //         ? [T.RageFW_ServerArgs<EventName>]
    //         : []
    // ): Promise<T.RageFW_ServerReturn<EventName>> {
    //     return rpc.call(eventName, args)
    // }
}

// new Server()
//     .register('customServerEvent', async (a, b, c) => true)
//     .unregister('customServerEvent')

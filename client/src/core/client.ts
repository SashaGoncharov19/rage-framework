import { rpc } from './rpc'
import { FW_Middleware } from './middleware'
import type * as T from '../types'

/** Client-side interactions */
export class FW_Client {
    /**
     * Registers a client event with an associated callback
     *
     * @param eventName - The name of the event to register
     * @param callback - The callback function to be executed when the event is triggered
     * @param [options] - Optional settings for callback execution
     * @param [options.middlewares] - Middleware functions to be checked before the callback executes
     * @returns {FW_Client} The current client instance, enabling method chaining
     *
     * @example
     * // Registering an event
     * fw.event.register("playerDeath", (player, reason, killer) => {
     *     fw.system.log.info(player, reason, killer)
     * })
     *
     * @example
     * // Registering an event with middlewares
     * fw.event.register("playerDeath", (player, reason, killer) => {
     *     fw.system.log.info(player, reason, killer)
     * }, {
     *     middlewares: [ignoreSuicide] // <- your middlewares here
     * })
     *
     * // or
     *
     * fw.event.register("playerDeath", (player, reason, killer) => {
     *     fw.system.log.info(player, reason, killer)
     * }, {
     *     middlewares: {
     *         executables: [ignoreSuicide], // <- your middlewares here
     *         onError: (msg) => fw.system.log.info(`${player.socialClub} has commited suicide`)
     *     }
     * })
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public register<EventName extends T.FW_ClientEvent>(
        eventName: EventName,
        callback: T.FW_ClientCallback<EventName>,
        options?: {
            middlewares?: T.FW_MiddlewareOptions<EventName>
        },
    ): FW_Client {
        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback> | Promise<unknown>,
            EventName
        >(eventName, async (...data) => {
            if (!options?.middlewares) return await callback(...data)

            await FW_Middleware.process(options.middlewares, callback, data)
        })

        return this
    }

    /**
     * Unregisters a client event, removing the associated callback
     *
     * @param eventName - The name of the event to unregister
     * @returns {Client} The current client instance, enabling method chaining
     *
     * @example
     * // Unregistering an event
     * fw.event.unregister("playerDeath")
     *
     * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
     */
    public unregister<EventName extends T.FW_ClientEvent>(
        eventName: EventName,
    ): FW_Client {
        rpc.unregister<EventName>(eventName)

        return this
    }
}

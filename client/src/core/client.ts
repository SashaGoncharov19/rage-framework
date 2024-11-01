import { rpc } from './rpc'
import { Middleware } from './middleware'
import { Validation } from './validation'
import type * as T from '../types'

/** Client-side interactions */
export class Client {
    /**
     * Registers a client event with an associated callback
     *
     * @param eventName - The name of the event to register
     * @param callback - The callback function to be executed when the event is triggered
     * @param [options] - Optional settings for callback execution
     * @param [options.validation] - Validation schema to be checked before the callback executes
     * @param [options.middlewares] - Middleware functions to be checked before the callback executes
     * @returns {Client} The current client instance, enabling method chaining
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
    public register<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        callback: T.RageFW_ClientCallback<EventName>,
        options?: {
            validation?: T.RageFW_ValidationOptions
            middlewares?: T.RageFW_MiddlewareOptions<EventName>
        },
    ): Client {
        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback> | Promise<unknown>,
            EventName
        >(eventName, async (...data) => {
            if (!options?.middlewares && !options?.validation)
                return await callback(...data)

            const validationSuccess = Validation.process(
                data,
                options?.validation,
            )
            if (!validationSuccess) return

            const middlewaresSuccess = await Middleware.process(
                data,
                options?.middlewares,
            )
            if (!middlewaresSuccess) return

            return await callback(...data)
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
    public unregister<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
    ): Client {
        rpc.unregister<EventName>(eventName)

        return this
    }
}

// new Client()
//     .register('customClientEvent', async (a, b) => true)
//     .unregister('customClientEvent')

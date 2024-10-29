import { rpc } from './rpc'
import { Middleware } from './middleware'
import type * as T from '../types'

export class Client {
    public register<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        callback: T.RageFW_ClientCallback<EventName>,
        options?: {
            middlewares?: T.RageFW_MiddlewareOptions<EventName>
        },
    ): Client {
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

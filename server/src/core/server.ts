import { rpc } from './rpc'
import type * as T from '../types'

export class Server {
    public register<EventName extends T.RageFW_ServerEvent>(
        eventName: EventName,
        callback: T.RageFW_ServerCallback<EventName>,
    ): Server {
        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback>,
            EventName
        >(eventName, async (...data) => await callback(...data))

        return this
    }

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

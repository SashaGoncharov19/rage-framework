import { rpc } from './rpc'
import type * as T from '../types'

export class Client {
    public register<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        callback: T.RageFW_ClientCallback<EventName>,
    ): Client {
        rpc.register<
            Parameters<typeof callback>,
            ReturnType<typeof callback>,
            EventName
        >(eventName, async (...data) => await callback(...data))

        return this
    }

    public unregister<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
    ): Client {
        rpc.unregister(eventName)

        return this
    }
}

// new Client()
//     .register('customClientEvent', async (a, b) => true)
//     .unregister('customClientEvent')

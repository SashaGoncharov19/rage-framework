import rpc from 'rage-rpc'

import { RageFW_ClientCallback, RageFW_ClientEvent } from '../types'

export class Client {
    public register<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        callback: RageFW_ClientCallback<EventName>,
    ): void {
        rpc.register(eventName, async data => {
            return await callback(data)
        })
    }

    public unregister<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
    ): void {
        rpc.unregister(eventName)
    }
}

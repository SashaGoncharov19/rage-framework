import { Rpc } from '@entityseven/rage-fw-rpc'

import type * as T from '../types'

export class Client {
    private _rpc: Rpc = new Rpc()

    get rpc(): Rpc {
        return this._rpc
    }

    public register<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
        callback: T.RageFW_ClientCallback<EventName>,
    ): void {
        this._rpc.register(
            eventName,
            async (data: T.RageFW_ClientArgs<EventName>) => {
                return await callback(data)
            },
        )
    }

    public unregister<EventName extends T.RageFW_ClientEvent>(
        eventName: EventName,
    ): void {
        this._rpc.unregister(eventName)
    }
}

import { Rpc } from 'rage-fw-rpc'

import type {
    RageFW_ClientArgs,
    RageFW_ClientCallback,
    RageFW_ClientEvent,
} from '../types'

export class Client {
    private _rpc: Rpc = new Rpc()

    get rpc(): Rpc {
        return this._rpc
    }

    public register<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        callback: RageFW_ClientCallback<EventName>,
    ): void {
        this._rpc.register(
            eventName,
            async (data: RageFW_ClientArgs<EventName>) => {
                return await callback(data)
            },
        )
    }

    public unregister<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
    ): void {
        this._rpc.unregister(eventName)
    }
}

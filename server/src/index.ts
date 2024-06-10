import rpc from 'rage-rpc'
import { RageFW_ServerEvent, RageFW_ServerEventCallback } from './types.js'

class Server {
    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void {
        rpc.register(eventName, callback as rpc.ProcedureListener)
    }

    public registerMany<EventName extends RageFW_ServerEvent>(events: {
        [event in EventName]: RageFW_ServerEventCallback<event>
    }): void {
        Object.entries(events).map(([eventName, callback]) =>
            rpc.register(eventName, (args: unknown[]) => {
                return Array.isArray(args)
                    ? (callback as (...arg: typeof args) => void)(...args)
                    : (callback as (arg: typeof args) => void)(args)
            }),
        )
    }
}

export const rage = {
    event: new Server(),
}

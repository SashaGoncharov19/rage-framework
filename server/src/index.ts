/// <reference types="../../shared/server/index.d.ts" />
import rpc from 'rage-rpc'

class Server implements RageFW_Server {
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
        // Object.keys(events).forEach(eventName =>
        //     // unknown[] ?
        //     // rpc.register(eventName, (args: unknown[]) =>
        //     //     Array.isArray(args) ? events[eventName as keyof typeof events](...args) : callback(args),
        //     // ),
        //     rpc.register(eventName, (...args: unknown[]) =>
        //         events[eventName as EventName](args),
        //     ),
        // )
    }
}

export const rage = {
    event: new Server(),
}

rage.event.register('customServerEvent', (player, arg1, arg2) => {
    console.log(player, arg1, arg2)
    return true
})

rage.event.registerMany({
    customServerEvent: (player, arg1, arg2) => {
        console.log(player, arg1, arg2)
        return true
    },
    playerDeath: (player, reason, killer) => {
        console.log(player, reason, killer)
        return undefined
    },
})

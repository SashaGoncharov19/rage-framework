/// <reference types="../../shared/server/index.d.ts" />
import rpc from 'rage-rpc'

class Server implements RageFW_Server {
    public register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void {
        rpc.register(eventName, callback as rpc.ProcedureListener)
    }
}

export const rage = {
    event: new Server(),
}

rage.event.register('customServerEvent', (player, arg1, arg2) => {
    return true
})

// public registerMultiple(events: {
//     [name: string]: (player: PlayerMp, ...args: any[]) => any
// }): void
//
// registerMultiple(events: { [name: string]: (...args: any[]) => any }) {
//     Object.entries(events).forEach(([name, callback]) =>
//         rpc.register(name, (data: any[]) => {
//             return Array.isArray(data) ? callback(...data) : callback(data)
//         }),
//     )
// }

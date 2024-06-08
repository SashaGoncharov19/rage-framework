/// <reference types="@ragempcommunity/types-server" />
import rpc from 'rage-rpc'

type ServerEvent<K> = K extends keyof IServerEvents ? K : never
type ServerEventCallback<K> = K extends keyof IServerEvents
    ? ThisifyServerEvents[K]
    : never

declare class Server {
    public register<K = ServerEvent<K>>(
        eventName: K,
        callback: ServerEventCallback,
    ): void

    public registerMultiple(events: {
        [name: string]: (player: PlayerMp, ...args: any[]) => any
    }): void

    registerMultiple(events: { [name: string]: (...args: any[]) => any }) {
        Object.entries(events).forEach(([name, callback]) =>
            rpc.register(name, (data: any[]) => {
                return Array.isArray(data) ? callback(...data) : callback(data)
            }),
        )
    }

    register() {}
}

export const rage = {
    event: new Server(),
}

rage.event.register('customevent', vehicle => {})

function test() {}

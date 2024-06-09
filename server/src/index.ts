/// <reference types="@ragempcommunity/types-server" />
import rpc from 'rage-rpc'

type RageFW_ServerEvent<K> = K extends keyof RageFW_ICustomServerEvent
    ? K
    : K extends keyof IServerEvents
      ? K
      : never

type RageFW_ServerEventCallback<K> = K extends keyof RageFW_ICustomServerEvent
    ? (
          player: PlayerMp,
          ...args: Parameters<RageFW_ICustomServerEvent[K]>
      ) => ReturnType<RageFW_ICustomServerEvent[K]>
    : K extends keyof IServerEvents
      ? ThisifyServerEvents[K]
      : never

type RageFW_ClientEvent<K> = K extends keyof RageFW_ICustomClientEvent
    ? K
    : K extends keyof IServerEvents
      ? K
      : never

type RageFW_ClientEventArguments<K> = K extends keyof RageFW_ICustomClientEvent
    ? Parameters<RageFW_ICustomClientEvent[K]>
    : (K extends keyof IServerEvents ? ThisifyServerEvents[K] : never)[]

type RageFW_ClientEventReturn<K> = K extends keyof RageFW_ICustomClientEvent
    ? ReturnType<RageFW_ICustomClientEvent[K]>
    : never

interface RageFW_ICustomServerEvent {
    customEvent(arg1: number, arg2: boolean): void
}

interface RageFW_ICustomClientEvent {
    customClientEvent(arg1: number, arg2: boolean): boolean
}

class Server {
    register<EventName extends string>(
        eventName: RageFW_ServerEvent<EventName>,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void

    public register(
        eventName: string,
        callback: (...args: unknown[]) => unknown,
    ) {
        rpc.register(eventName, callback)
    }

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
    //
    // register() {}
}

class Player {
    triggerClient<EventName extends string>(
        player: PlayerMp,
        eventName: RageFW_ClientEvent<EventName>,
        ...args: RageFW_ClientEventArguments<EventName>
    ): RageFW_ClientEventReturn<EventName>
    public triggerClient(
        player: PlayerMp,
        eventName: string,
        ...args: unknown[]
    ) {
        return rpc.callClient(player, eventName, ...args)
    }
}

export const rage = {
    event: new Server(),
    player: new Player(),
}

rage.event.register('customEvent', (player, arg1, arg2) => {
    rage.player.triggerClient(player, 'customClientEvent', arg1, arg2)
})

function test() {}

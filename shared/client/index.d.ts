/// <reference types="@ragempcommunity/types-client" />

interface RageFW_ICustomClientEvent {
    customClientEvent(arg1: string, arg2: number): boolean
}

type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent | keyof IClientEvents

type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? Parameters<RageFW_ICustomClientEvent[K]>
        : (K extends keyof IClientEvents ? ThisifyClientEvents[K] : never)[]

type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

declare class RageFW_Player {
    declare triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: RageFW_ClientEventArguments<EventName>
    ): Promise<RageFW_ClientEventReturn<EventName>>
}
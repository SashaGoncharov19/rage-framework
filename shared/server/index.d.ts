/// <reference types="@ragempcommunity/types-server" />
declare interface RageFW_ICustomServerEvent {
    customServerEvent(arg1: string, arg2: number): boolean
}

type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

type RageFW_ServerEventCallback<
    K extends keyof RageFW_ICustomServerEvent | keyof IServerEvents,
> = K extends keyof RageFW_ICustomServerEvent
    ? (
          player: PlayerMp,
          ...args: Parameters<RageFW_ICustomServerEvent[K]>
      ) => ReturnType<RageFW_ICustomServerEvent[K]>
    : K extends keyof IServerEvents
      ? ThisifyServerEvents[K]
      : never

declare class RageFW_Server {
    declare register<EventName extends RageFW_ServerEvent>(
        eventName: EventName,
        callback: RageFW_ServerEventCallback<EventName>,
    ): void
}

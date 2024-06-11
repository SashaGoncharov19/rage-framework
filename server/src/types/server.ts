/// <reference types="@ragempcommunity/types-server" />

import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'
export type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

export type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

export type RageFW_ServerEventArguments<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? Parameters<RageFW_ServerEventCallbackCustom<K>>
        : K extends keyof IServerEvents
          ? Parameters<RageFW_ServerEventCallbackNative<K>>
          : never

export type RageFW_ServerEventCallback<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? RageFW_ServerEventCallbackCustom<K>
        : K extends keyof IServerEvents
          ? RageFW_ServerEventCallbackNative<K>
          : never

export type RageFW_ServerEventReturn<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? ReturnType<IServerEvents[K]>
          : never

export type RageFW_ServerEventCallbackCustom<
    K extends keyof RageFW_ICustomServerEvent = keyof RageFW_ICustomServerEvent,
> = (
    player: PlayerMp,
    args: RageFW_ServerEventArguments<K>,
) => RageFW_ServerEventReturn<K>

export type RageFW_ServerEventCallbackNative<
    K extends keyof IServerEvents = keyof IServerEvents,
> = IServerEvents[K]

/// <reference types="@ragempcommunity/types-server" />

import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'
export type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

export type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

export type RageFW_ServerEventCallbackCustom<
    K extends keyof RageFW_ICustomServerEvent = keyof RageFW_ICustomServerEvent,
> = (
    player: PlayerMp,
    args: Parameters<RageFW_ICustomServerEvent[K]>,
) => ReturnType<RageFW_ICustomServerEvent[K]>

export type RageFW_ServerEventCallbackNative<
    K extends keyof IServerEvents = keyof IServerEvents,
> = IServerEvents[K]

export type RageFW_ServerEventCallback<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? RageFW_ServerEventCallbackCustom<K>
        : K extends keyof IServerEvents
          ? RageFW_ServerEventCallbackNative<K>
          : never

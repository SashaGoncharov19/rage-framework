/// <reference types="@ragempcommunity/types-server" />

import type {
    RageFW_ICustomServerEvent,
    RageFW_ICustomClientEvent,
} from 'rage-fw-shared-types'

export type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

export type RageFW_ServerEventCallback<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? (
              player: PlayerMp,
              ...args: Parameters<RageFW_ICustomServerEvent[K]>
          ) => ReturnType<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? IServerEvents[K]
          : never

export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

export type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? Parameters<RageFW_ICustomClientEvent[K]>
        : never

export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

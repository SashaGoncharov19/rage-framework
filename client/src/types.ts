/// <reference types="@ragempcommunity/types-client" />

import type {
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from 'rage-fw-shared-types'

export type RageFW_ClientEvent = keyof RageFW_ICustomServerEvent

export type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? Parameters<RageFW_ICustomServerEvent[K]>
        : never

export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

export type RageFW_ClientServerEvent = keyof RageFW_ICustomClientEvent

export type RageFW_ClientServerCallback<K extends RageFW_ClientServerEvent> = (
    ...args: Parameters<RageFW_ICustomClientEvent[K]>
) => ReturnType<RageFW_ICustomClientEvent[K]>

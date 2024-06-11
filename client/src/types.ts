/// <reference types="@ragempcommunity/types-client" />

import type {
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from 'rage-fw-shared-types'

// CLIENT

export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

export type RageFW_ClientCallback<K extends RageFW_ClientEvent> = (
    args: Parameters<RageFW_ICustomClientEvent[K]>,
) => RageFW_ClientEventReturn<K>

export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

// SERVER

export type RageFW_ClientServerEvent = keyof RageFW_ICustomServerEvent

export type RageFW_ClientServerEventArguments<
    K extends RageFW_ClientServerEvent,
> = K extends keyof RageFW_ICustomServerEvent
    ? Parameters<RageFW_ICustomServerEvent[K]>
    : never

export type RageFW_ClientServerEventReturn<K extends RageFW_ClientServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : never

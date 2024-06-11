/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

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

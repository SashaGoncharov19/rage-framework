/// <reference types="@ragempcommunity/types-server" />

import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

export type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? Parameters<RageFW_ICustomClientEvent[K]>
        : never

export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

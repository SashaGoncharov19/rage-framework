/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

export type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    Parameters<RageFW_ICustomClientEvent[K]>

export type RageFW_ClientEventCallback<K extends RageFW_ClientEvent> = (
    args: RageFW_ClientEventArguments<K>,
) => RageFW_ClientEventReturn<K>

export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

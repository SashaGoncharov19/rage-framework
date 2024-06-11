/// <reference types="@ragempcommunity/types-server" />

import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

/**
 * Union of all available client event names
 * These only include custom events
 */
export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientEventArguments<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? Parameters<RageFW_ICustomClientEvent[K]>
        : never

/**
 * Return type of event you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientEventReturn<K extends RageFW_ClientEvent> =
    K extends RageFW_ClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : never

/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

/**
 * Union of all available server event names callable from client
 * These only include custom events
 */
export type RageFW_ClientServerEvent = keyof RageFW_ICustomServerEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientServerEventArguments<
    K extends RageFW_ClientServerEvent,
> = K extends keyof RageFW_ICustomServerEvent
    ? Parameters<RageFW_ICustomServerEvent[K]>
    : never

/**
 * Return type for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientServerEventReturn<K extends RageFW_ClientServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : never

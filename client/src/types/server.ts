/// <reference types="@ragempcommunity/types-client" />

import type {
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available server event names callable from client
 * These only include custom events
 */
export type RageFW_ClientServerEvent = keyof RageFW_ICustomServerEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientServerArgs<K extends RageFW_ClientServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? Parameters<RageFW_ICustomServerEvent[K]>
        : never

/**
 * Return type for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientServerReturn<K extends RageFW_ClientServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : never

export type _ServerEventHasArgs<
    EventName extends keyof RageFW_ICustomServerEvent,
> = keyof RageFW_ICustomClientEvent extends never
    ? false
    : Parameters<RageFW_ICustomServerEvent[EventName]>[0] extends undefined
      ? false
      : true

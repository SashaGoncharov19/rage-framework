/// <reference types="@ragempcommunity/types-client" />

import type {
    FW_ICustomClientEvent,
    FW_ICustomServerEvent,
} from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available server event names callable from client
 * These only include custom events
 */
export type FW_ServerEvent = keyof FW_ICustomServerEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type FW_ServerArgs<K extends FW_ServerEvent> =
    K extends keyof FW_ICustomServerEvent
        ? Parameters<FW_ICustomServerEvent[K]>
        : never

/**
 * Return type for an event, name of which you pass as a generic
 * These only include custom events
 */
export type FW_ClientServerReturn<K extends FW_ServerEvent> =
    K extends keyof FW_ICustomServerEvent
        ? ReturnType<FW_ICustomServerEvent[K]>
        : never

export type _ServerEventHasArgs<EventName extends keyof FW_ICustomServerEvent> =
    keyof FW_ICustomClientEvent extends never
        ? false
        : Parameters<FW_ICustomServerEvent[EventName]>[0] extends undefined
          ? false
          : true

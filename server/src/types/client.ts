/// <reference types="@ragempcommunity/types-server" />

import type { FW_ICustomClientEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available client event names
 * These only include custom events
 */
export type FW_ClientEvent = keyof FW_ICustomClientEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom events
 */
export type FW_ClientArgs<K extends FW_ClientEvent> = K extends FW_ClientEvent
    ? Parameters<FW_ICustomClientEvent[K]>
    : never

/**
 * Return type of event you pass as a generic
 * These only include custom events
 */
export type FW_ClientReturn<K extends FW_ClientEvent> = K extends FW_ClientEvent
    ? ReturnType<FW_ICustomClientEvent[K]>
    : never

/**
 *
 */
export type _ClientEventHasArgs<EventName extends keyof FW_ICustomClientEvent> =
    keyof FW_ICustomClientEvent extends never
        ? false
        : Parameters<FW_ICustomClientEvent[EventName]>[0] extends undefined
          ? false
          : true

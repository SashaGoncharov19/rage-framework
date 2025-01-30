/// <reference types="@ragempcommunity/types-client" />

import type { FW_ICustomClientEvent } from '@entityseven/rage-fw-shared-types'

export type { FW_ICustomClientEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available client event names
 * These include custom and system events
 */
export type FW_ClientEvent = keyof FW_ICustomClientEvent | keyof IClientEvents

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These include custom and system events
 */
export type FW_ClientArgs<K extends FW_ClientEvent> =
    K extends keyof FW_ICustomClientEvent
        ? Parameters<FW_ICustomClientEvent[K]>
        : K extends keyof IClientEvents
          ? Parameters<IClientEvents[K]>
          : never

/**
 * Return type for an event, name of which you pass as a generic
 * These include custom and system events
 */
export type FW_ClientReturn<K extends FW_ClientEvent> =
    K extends keyof FW_ICustomClientEvent
        ? ReturnType<FW_ICustomClientEvent[K]>
        : K extends keyof IClientEvents
          ? ReturnType<IClientEvents[K]>
          : void

/**
 * Callback (function) for an event, name of which you pass as a generic
 * These include custom and system events
 */
export type FW_ClientCallback<K extends FW_ClientEvent> = (
    ...args: FW_ClientArgs<K>
) => Promise<FW_ClientReturn<K>>

/**
 *
 */
export type _ClientEventHasArgs<EventName extends keyof FW_ICustomClientEvent> =
    keyof FW_ICustomClientEvent extends never
        ? false
        : Parameters<FW_ICustomClientEvent[EventName]>[0] extends undefined
          ? false
          : true

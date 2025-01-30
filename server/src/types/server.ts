/// <reference types="@ragempcommunity/types-server" />

import type {
    FW_ICustomClientEvent,
    FW_ICustomServerEvent,
} from '@entityseven/rage-fw-shared-types'

export type { FW_ICustomServerEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available server event names
 * These also include system events
 */
export type FW_ServerEvent = keyof FW_ICustomServerEvent | keyof IServerEvents

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These also include system events
 */
export type FW_ServerArgs<K extends FW_ServerEvent> =
    K extends keyof FW_ICustomServerEvent
        ? [PlayerMp, ...Parameters<FW_ICustomServerEvent[K]>]
        : K extends keyof IServerEvents
          ? [PlayerMp, Parameters<IServerEvents[K]>]
          : never

/**
 * Return type for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type FW_ServerReturn<K extends FW_ServerEvent> =
    K extends keyof FW_ICustomServerEvent
        ? ReturnType<FW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? ReturnType<IServerEvents[K]>
          : void

/**
 * Callback (function) for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type FW_ServerCallback<K extends FW_ServerEvent> = (
    ...args: FW_ServerArgs<K>
) => Promise<FW_ServerReturn<K>>

/**
 *
 */
export type _ServerEventHasArgs<EventName extends FW_ServerEvent> =
    EventName extends keyof FW_ICustomServerEvent
        ? keyof FW_ICustomClientEvent extends never
            ? false
            : Parameters<FW_ICustomServerEvent[EventName]>[0] extends undefined
              ? false
              : true
        : EventName extends keyof IServerEvents
          ? keyof IServerEvents extends never
              ? false
              : Parameters<IServerEvents[EventName]>[0] extends undefined
                ? false
                : true
          : false

import type { FW_ICustomServerEvent } from '@entityseven/rage-fw-shared-types'

export type { FW_ICustomServerEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available server event names
 * These only include custom events
 */
export type FW_ServerEvent = keyof FW_ICustomServerEvent

/**
 * Array of arguments of event you pass as a generic
 * These only include custom server events
 */
export type FW_ServerArgs<K extends FW_ServerEvent> = Parameters<
    FW_ICustomServerEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom server events
 */
export type FW_ServerReturn<K extends FW_ServerEvent> = ReturnType<
    FW_ICustomServerEvent[K]
>

export type _ServerEventHasArgs<EventName extends keyof FW_ICustomServerEvent> =
    keyof FW_ICustomServerEvent extends never
        ? false
        : Parameters<FW_ICustomServerEvent[EventName]>[0] extends undefined
          ? false
          : true

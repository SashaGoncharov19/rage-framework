import type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'
export type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

/**
 * Union of all available server event names
 * These only include custom events
 */
export type RageFW_ServerEvent = keyof RageFW_ICustomServerEvent

/**
 * Array of arguments of event you pass as a generic
 * These only include custom server events
 */
export type RageFW_ServerArguments<K extends RageFW_ServerEvent> = Parameters<
    RageFW_ICustomServerEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom server events
 */
export type RageFW_ServerReturn<K extends RageFW_ServerEvent> = ReturnType<
    RageFW_ICustomServerEvent[K]
>

export type _ServerEventHasArgs<
    EventName extends keyof RageFW_ICustomServerEvent,
> = keyof RageFW_ICustomServerEvent extends never
    ? false
    : Parameters<RageFW_ICustomServerEvent[EventName]>[0] extends undefined
      ? false
      : true

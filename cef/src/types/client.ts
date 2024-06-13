import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'
export type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

/**
 * Union of all available client event names
 * These only include custom events
 */
export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

/**
 * Array of arguments of event you pass as a generic
 * These only include custom client events
 */
export type RageFW_ClientArguments<K extends RageFW_ClientEvent> = Parameters<
    RageFW_ICustomClientEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom client events
 */
export type RageFW_ClientReturn<K extends RageFW_ClientEvent> = ReturnType<
    RageFW_ICustomClientEvent[K]
>

export type _ClientEventHasArgs<
    EventName extends keyof RageFW_ICustomClientEvent,
> = keyof RageFW_ICustomClientEvent extends never
    ? false
    : Parameters<RageFW_ICustomClientEvent[EventName]>[0] extends undefined
      ? false
      : true

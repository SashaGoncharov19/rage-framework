/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomClientEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available client event names
 * These include custom and system events
 */
export type RageFW_ClientEvent =
    | keyof RageFW_ICustomClientEvent
    | keyof IClientEvents

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These include custom and system events
 */
export type RageFW_ClientArgs<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? Parameters<RageFW_ICustomClientEvent[K]>
        : K extends keyof IClientEvents
          ? Parameters<IClientEvents[K]>
          : never

/**
 * Callback (function) for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientCallback<K extends RageFW_ClientEvent> = (
    args: RageFW_ClientArgs<K>,
) => Promise<RageFW_ClientReturn<K>>

/**
 * Return type for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ClientReturn<K extends RageFW_ClientEvent> =
    K extends keyof RageFW_ICustomClientEvent
        ? ReturnType<RageFW_ICustomClientEvent[K]>
        : void

export type _ClientEventHasArgs<
    EventName extends keyof RageFW_ICustomClientEvent,
> = keyof RageFW_ICustomClientEvent extends never
    ? false
    : Parameters<RageFW_ICustomClientEvent[EventName]>[0] extends undefined
      ? false
      : true

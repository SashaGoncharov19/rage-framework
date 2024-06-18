/// <reference types="@ragempcommunity/types-server" />

import type {
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from 'rage-fw-shared-types'
export type { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

/**
 * Union of all available server event names
 * These also include system events
 */
export type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These also include system events
 */
export type RageFW_ServerArgs<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? Parameters<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? Parameters<IServerEvents[K]>
          : never

/**
 * Callback (function) for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type RageFW_ServerCallback<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? RageFW_ServerCallbackCustom<K>
        : K extends keyof IServerEvents
          ? RageFW_ServerCallbackNative<K>
          : never

/**
 * Return type for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type RageFW_ServerReturn<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? ReturnType<IServerEvents[K]>
          : never

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ServerCallbackCustom<
    K extends keyof RageFW_ICustomServerEvent = keyof RageFW_ICustomServerEvent,
> = (
    payload: [player: PlayerMp, ...args: RageFW_ServerArgs<K>],
) => RageFW_ServerReturn<K>

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include system events
 */
export type RageFW_ServerCallbackNative<
    K extends keyof IServerEvents = keyof IServerEvents,
> = (payload: Parameters<IServerEvents[K]>) => ReturnType<IServerEvents[K]>

export type _ServerEventHasArgs<EventName extends RageFW_ServerEvent> =
    EventName extends keyof RageFW_ICustomServerEvent
        ? keyof RageFW_ICustomClientEvent extends never
            ? false
            : Parameters<
                    RageFW_ICustomServerEvent[EventName]
                >[0] extends undefined
              ? false
              : true
        : EventName extends keyof IServerEvents
          ? keyof IServerEvents extends never
              ? false
              : Parameters<IServerEvents[EventName]>[0] extends undefined
                ? false
                : true
          : false

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
export type RageFW_ServerEventArguments<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? Parameters<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? Parameters<IServerEvents[K]>
          : never

/**
 * Callback (function) for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type RageFW_ServerEventCallback<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? RageFW_ServerEventCallbackCustom<K>
        : K extends keyof IServerEvents
          ? RageFW_ServerEventCallbackNative<K>
          : never

/**
 * Return type for an event, name of which you pass as a generic
 * These include system and custom events
 */
export type RageFW_ServerEventReturn<K extends RageFW_ServerEvent> =
    K extends keyof RageFW_ICustomServerEvent
        ? ReturnType<RageFW_ICustomServerEvent[K]>
        : K extends keyof IServerEvents
          ? ReturnType<IServerEvents[K]>
          : never

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_ServerEventCallbackCustom<
    K extends keyof RageFW_ICustomServerEvent = keyof RageFW_ICustomServerEvent,
> = (
    payload: [player: PlayerMp, ...args: RageFW_ServerEventArguments<K>],
) => RageFW_ServerEventReturn<K>

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include system events
 */
export type RageFW_ServerEventCallbackNative<
    K extends keyof IServerEvents = keyof IServerEvents,
> = (payload: Parameters<IServerEvents[K]>) => ReturnType<IServerEvents[K]>

export type _ServerEventHasArgs<
    EventName extends keyof RageFW_ICustomServerEvent,
> = keyof RageFW_ICustomClientEvent extends never
    ? false
    : Parameters<RageFW_ICustomServerEvent[EventName]>[0] extends undefined
      ? false
      : true

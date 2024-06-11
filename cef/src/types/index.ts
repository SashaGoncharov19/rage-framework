/// <reference types="@ragempcommunity/types-cef" />

import type {
    RageFW_ICustomCefEvent,
    RageFW_ICustomClientEvent,
    RageFW_ICustomServerEvent,
} from 'rage-fw-shared-types'

export type {
    RageFW_ICustomCefEvent,
    RageFW_ICustomServerEvent,
    RageFW_ICustomClientEvent,
} from 'rage-fw-shared-types'

/**
 * Union of all available cef event names
 * These only include custom events
 */
export type RageFW_CefEvent = keyof RageFW_ICustomCefEvent

/**
 * Union of all available server event names
 * These only include custom events
 */
export type RageFW_ServerEvent = keyof RageFW_ICustomServerEvent

/**
 * Union of all available client event names
 * These only include custom events
 */
export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom cef events
 */
export type RageFW_CefArguments<K extends RageFW_CefEvent> = Parameters<
    RageFW_ICustomCefEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom cef events
 */
export type RageFW_CefReturn<K extends RageFW_CefEvent> = ReturnType<
    RageFW_ICustomCefEvent[K]
>

/**
 * Callback (function) of event you pass as a generic
 * These only include custom cef events
 */
export type RageFW_CefCallback<K extends keyof RageFW_ICustomCefEvent> = (
    args: RageFW_CefArguments<K>,
) => RageFW_CefReturn<K>

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

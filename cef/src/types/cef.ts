import type { RageFW_ICustomCefEvent } from '@entityseven/rage-fw-shared-types'

export type { RageFW_ICustomCefEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available cef event names
 * These only include custom events
 */
export type RageFW_CefEvent = keyof RageFW_ICustomCefEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom cef events
 */
export type RageFW_CefArgs<K extends RageFW_CefEvent> = Parameters<
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
    args: RageFW_CefArgs<K>,
) => Promise<RageFW_CefReturn<K>>

export type _CefEventHasArgs<EventName extends keyof RageFW_ICustomCefEvent> =
    keyof RageFW_ICustomCefEvent extends never
        ? false
        : Parameters<RageFW_ICustomCefEvent[EventName]>[0] extends undefined
          ? false
          : true

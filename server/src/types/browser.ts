import type { RageFW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available browser event names
 * These only include custom events
 */
export type RageFW_BrowserEvent = keyof RageFW_ICustomBrowserEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom events
 */
export type RageFW_BrowserArgs<K extends RageFW_BrowserEvent> = Parameters<
    RageFW_ICustomBrowserEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom events
 */
export type RageFW_BrowserReturn<K extends RageFW_BrowserEvent> = ReturnType<
    RageFW_ICustomBrowserEvent[K]
>

/**
 *
 */
export type _CefEventHasArgs<
    EventName extends keyof RageFW_ICustomBrowserEvent,
> = keyof RageFW_ICustomBrowserEvent extends never
    ? false
    : Parameters<RageFW_ICustomBrowserEvent[EventName]>[0] extends undefined
      ? false
      : true

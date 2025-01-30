import type { FW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

export type { FW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available browser event names
 * These only include custom events
 */
export type FW_BrowserEvent = keyof FW_ICustomBrowserEvent

/**
 * Array of arguments of an event you pass as a generic
 * These only include custom browser events
 */
export type FW_BrowserArgs<K extends FW_BrowserEvent> = Parameters<
    FW_ICustomBrowserEvent[K]
>

/**
 * Return type of event you pass as a generic
 * These only include custom browser events
 */
export type FW_BrowserReturn<K extends FW_BrowserEvent> = ReturnType<
    FW_ICustomBrowserEvent[K]
>

/**
 * Callback (function) of event you pass as a generic
 * These only include custom browser events
 */
export type FW_BrowserCallback<K extends keyof FW_ICustomBrowserEvent> = (
    ...args: FW_BrowserArgs<K>
) => Promise<FW_BrowserReturn<K>>

export type _BrowserEventHasArgs<
    EventName extends keyof FW_ICustomBrowserEvent,
> = keyof FW_ICustomBrowserEvent extends never
    ? false
    : Parameters<FW_ICustomBrowserEvent[EventName]>[0] extends undefined
      ? false
      : true

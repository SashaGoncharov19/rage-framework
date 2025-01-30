/// <reference types="@ragempcommunity/types-client" />

import type { FW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available browser event names callable from client
 * These only include custom events
 */
export type FW_BrowserEvent = keyof FW_ICustomBrowserEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type FW_BrowserArgs<K extends FW_BrowserEvent> = Parameters<
    FW_ICustomBrowserEvent[K]
>

export type FW_BrowserReturn<K extends FW_BrowserEvent> = ReturnType<
    FW_ICustomBrowserEvent[K]
>

export type _BrowserEventHasArgs<
    EventName extends keyof FW_ICustomBrowserEvent,
> = keyof FW_ICustomBrowserEvent extends never
    ? false
    : Parameters<FW_ICustomBrowserEvent[EventName]>[0] extends undefined
      ? false
      : true

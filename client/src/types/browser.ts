/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available browser event names callable from client
 * These only include custom events
 */
export type RageFW_BrowserEvent = keyof RageFW_ICustomBrowserEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_BrowserArgs<K extends RageFW_BrowserEvent> = Parameters<
    RageFW_ICustomBrowserEvent[K]
>

export type RageFW_BrowserReturn<K extends RageFW_BrowserEvent> = ReturnType<
    RageFW_ICustomBrowserEvent[K]
>

export type _BrowserEventHasArgs<
    EventName extends keyof RageFW_ICustomBrowserEvent,
> = keyof RageFW_ICustomBrowserEvent extends never
    ? false
    : Parameters<RageFW_ICustomBrowserEvent[EventName]>[0] extends undefined
      ? false
      : true

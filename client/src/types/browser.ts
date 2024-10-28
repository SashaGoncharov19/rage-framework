/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomBrowserEvent } from '@entityseven/rage-fw-shared-types'

/**
 * Union of all available browser event names callable from client
 * These only include custom events
 */
export type RageFW_CefEvent = keyof RageFW_ICustomBrowserEvent

/**
 * Array of arguments for an event, name of which you pass as a generic
 * These only include custom events
 */
export type RageFW_CefArgs<K extends RageFW_CefEvent> = Parameters<
    RageFW_ICustomBrowserEvent[K]
>

export type RageFW_CefReturn<K extends RageFW_CefEvent> = ReturnType<
    RageFW_ICustomBrowserEvent[K]
>

export type _CefEventHasArgs<
    EventName extends keyof RageFW_ICustomBrowserEvent,
> = keyof RageFW_ICustomBrowserEvent extends never
    ? false
    : Parameters<RageFW_ICustomBrowserEvent[EventName]>[0] extends undefined
      ? false
      : true

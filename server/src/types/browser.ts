import type { RageFW_ICustomCefEvent } from 'rage-fw-shared-types'

export type RageFW_CefEvent = keyof RageFW_ICustomCefEvent

export type RageFW_CefArgs<K extends RageFW_CefEvent> = Parameters<
    RageFW_ICustomCefEvent[K]
>

export type RageFW_CefReturn<K extends RageFW_CefEvent> = ReturnType<
    RageFW_ICustomCefEvent[K]
>

export type _CefEventHasArgs<EventName extends keyof RageFW_ICustomCefEvent> =
    keyof RageFW_ICustomCefEvent extends never
        ? false
        : Parameters<RageFW_ICustomCefEvent[EventName]>[0] extends undefined
          ? false
          : true

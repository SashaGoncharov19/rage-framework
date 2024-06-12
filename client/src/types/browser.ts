/// <reference types="@ragempcommunity/types-client" />

import type { RageFW_ICustomCefEvent } from 'rage-fw-shared-types'

export type RageFW_CefEvent = keyof RageFW_ICustomCefEvent

export type RageFW_CefArgs<K extends RageFW_CefEvent> = Parameters<
    RageFW_ICustomCefEvent[K]
>

export type RageFW_CefReturn<K extends RageFW_CefEvent> = ReturnType<
    RageFW_ICustomCefEvent[K]
>

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

export type RageFW_CefEvent = keyof RageFW_ICustomCefEvent
export type RageFW_ServerEvent = keyof RageFW_ICustomServerEvent
export type RageFW_ClientEvent = keyof RageFW_ICustomClientEvent

export type RageFW_CefArguments<K extends RageFW_CefEvent> = Parameters<
    RageFW_ICustomCefEvent[K]
>

export type RageFW_CefReturn<K extends RageFW_CefEvent> = ReturnType<
    RageFW_ICustomCefEvent[K]
>

export type RageFW_CefCallback<K extends keyof RageFW_ICustomCefEvent> = (
    args: RageFW_CefArguments<K>,
) => RageFW_CefReturn<K>

export type RageFW_ServerArguments<K extends RageFW_ServerEvent> = Parameters<
    RageFW_ICustomServerEvent[K]
>

export type RageFW_ServerReturn<K extends RageFW_ServerEvent> = ReturnType<
    RageFW_ICustomServerEvent[K]
>

export type RageFW_ClientArguments<K extends RageFW_ClientEvent> = Parameters<
    RageFW_ICustomClientEvent[K]
>

export type RageFW_ClientReturn<K extends RageFW_ClientEvent> = ReturnType<
    RageFW_ICustomClientEvent[K]
>

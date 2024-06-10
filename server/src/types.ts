/// <reference types="@ragempcommunity/types-server" />

import { RageFW_ICustomServerEvent } from 'rage-fw-shared-types'

export type RageFW_ServerEvent =
    | keyof RageFW_ICustomServerEvent
    | keyof IServerEvents

export type RageFW_ServerEventCallback<
    K extends keyof RageFW_ICustomServerEvent | keyof IServerEvents,
> = K extends keyof RageFW_ICustomServerEvent
    ? (
          player: PlayerMp,
          ...args: Parameters<RageFW_ICustomServerEvent[K]>
      ) => ReturnType<RageFW_ICustomServerEvent[K]>
    : K extends keyof IServerEvents
      ? ThisifyServerEvents[K]
      : never

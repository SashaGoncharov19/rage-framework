import type * as T from './client'

export type RageFW_MiddlewareResponse =
    | {
          success: boolean
          message?: string
      }
    | boolean

export type RageFW_MiddlewareResponseInternal = {
    success: boolean
    message?: string
    id?: number
}

export type RageFW_MiddlewareFunction<EventName extends T.RageFW_ClientEvent> =
    (
        ...args: T.RageFW_ClientArgs<EventName>
    ) => Promise<RageFW_MiddlewareResponse>

export type RageFW_MiddlewareOptions<EventName extends T.RageFW_ClientEvent> =
    | RageFW_MiddlewareFunction<EventName>[]
    | {
          executables: RageFW_MiddlewareFunction<EventName>[]
          onError: (error: string) => unknown
      }

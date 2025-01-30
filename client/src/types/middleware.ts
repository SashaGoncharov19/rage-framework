import type * as T from './client'

export type FW_MiddlewareResponse =
    | {
          success: boolean
          message?: string
      }
    | boolean

export type FW_MiddlewareResponseInternal = {
    success: boolean
    message?: string
    id?: number
}

export type FW_MiddlewareFunction<EventName extends T.FW_ClientEvent> = (
    ...args: T.FW_ClientArgs<EventName>
) => Promise<FW_MiddlewareResponse>

export type FW_MiddlewareOptions<EventName extends T.FW_ClientEvent> =
    | FW_MiddlewareFunction<EventName>[]
    | {
          executables: FW_MiddlewareFunction<EventName>[]
          onError: (error: string) => unknown
      }

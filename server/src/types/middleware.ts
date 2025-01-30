import type * as T from './server'

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

export type FW_MiddlewareFunction<EventName extends T.FW_ServerEvent> = (
    ...args: T.FW_ServerArgs<EventName>
) => Promise<FW_MiddlewareResponse>

export type FW_MiddlewareOptions<EventName extends T.FW_ServerEvent> =
    | FW_MiddlewareFunction<EventName>[]
    | {
          executables: FW_MiddlewareFunction<EventName>[]
          onError: (error: string) => unknown
      }

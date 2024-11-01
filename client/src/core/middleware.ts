import type * as T from '../types'

export class Middleware {
    constructor() {}

    private static async execute<EventName extends T.RageFW_ClientEvent>(
        args: T.RageFW_ClientArgs<EventName>,
        middlewares: T.RageFW_MiddlewareFunction<EventName>[],
    ): Promise<T.RageFW_MiddlewareResponseInternal> {
        for (let i = 0; i < middlewares.length; i++) {
            const result = await middlewares[i](...args)

            if (typeof result === 'boolean' && !result)
                return { success: result, id: i }
            if (typeof result !== 'boolean' && !result.success)
                return { ...result, id: i }
        }

        return {
            success: true,
        }
    }

    public static async process<EventName extends T.RageFW_ClientEvent>(
        args: T.RageFW_ClientArgs<EventName>,
        middlewareOptions?: T.RageFW_MiddlewareOptions<EventName>,
    ): Promise<boolean> {
        if (!middlewareOptions) return true

        if (Array.isArray(middlewareOptions)) {
            const middlewaresResponse = await Middleware.execute(
                args,
                middlewareOptions,
            )
            return middlewaresResponse.success
        } else {
            const middlewaresResponse = await Middleware.execute(
                args,
                middlewareOptions.executables,
            )

            if (middlewaresResponse.success) {
                return true
            } else {
                middlewareOptions.onError(
                    middlewaresResponse.message ??
                        'Middleware with id ' +
                            middlewaresResponse.id +
                            ' failed',
                )
                return false
            }
        }
    }
}

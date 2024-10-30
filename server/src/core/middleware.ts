import type * as T from '../types'

export class Middleware {
    constructor() {}

    private static async execute<EventName extends T.RageFW_ServerEvent>(
        middlewares: T.RageFW_MiddlewareFunction<EventName>[],
        args: T.RageFW_ServerArgs<EventName>,
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

    public static async process<EventName extends T.RageFW_ServerEvent>(
        middlewareOptions: T.RageFW_MiddlewareOptions<EventName>,
        callback: T.RageFW_ServerCallback<EventName>,
        args: T.RageFW_ServerArgs<EventName>,
    ) {
        if (Array.isArray(middlewareOptions)) {
            const middlewaresResponse = await Middleware.execute(
                middlewareOptions,
                args,
            )

            if (middlewaresResponse.success) return await callback(...args)
        } else {
            const middlewaresResponse = await Middleware.execute(
                middlewareOptions.executables,
                args,
            )

            if (middlewaresResponse.success) {
                return await callback(...args)
            } else {
                middlewareOptions.onError(
                    middlewaresResponse.message ??
                        'Middleware with id ' +
                            middlewaresResponse.id +
                            ' failed',
                )
            }
        }
    }
}

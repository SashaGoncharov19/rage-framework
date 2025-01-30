import type * as T from '../types'

export class FW_Middleware {
    constructor() {}

    private static async execute<EventName extends T.FW_ServerEvent>(
        middlewares: T.FW_MiddlewareFunction<EventName>[],
        args: T.FW_ServerArgs<EventName>,
    ): Promise<T.FW_MiddlewareResponseInternal> {
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

    public static async process<EventName extends T.FW_ServerEvent>(
        middlewareOptions: T.FW_MiddlewareOptions<EventName>,
        callback: T.FW_ServerCallback<EventName>,
        args: T.FW_ServerArgs<EventName>,
    ) {
        if (Array.isArray(middlewareOptions)) {
            const middlewaresResponse = await FW_Middleware.execute(
                middlewareOptions,
                args,
            )

            if (middlewaresResponse.success) return await callback(...args)
        } else {
            const middlewaresResponse = await FW_Middleware.execute(
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

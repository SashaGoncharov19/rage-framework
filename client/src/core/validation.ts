import type * as T from '../types'

export class Validation {
    constructor() {}

    public static process<EventName extends T.RageFW_ClientEvent>(
        args: T.RageFW_ClientArgs<EventName>,
        validationOptions?: T.RageFW_ValidationOptions,
    ): boolean {
        if (!validationOptions) return true

        if ('schema' in validationOptions) {
            const validationResponse = validationOptions.schema.safeParse(args)

            if (validationResponse.success) {
                return true
            } else {
                validationOptions.onError(validationResponse.error)
                return false
            }
        } else {
            const validationResponse = validationOptions.safeParse(args)
            return validationResponse.success
        }
    }
}

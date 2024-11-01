import type { z } from 'zod'

export type RageFW_ValidationSchema = z.ZodTuple<any, any> | z.ZodArray<any>
export type RageFW_ValidationSchemaExtended = {
    schema: RageFW_ValidationSchema
    onError: (error: z.ZodError) => unknown
}

export type RageFW_ValidationOptions =
    | RageFW_ValidationSchema
    | RageFW_ValidationSchemaExtended

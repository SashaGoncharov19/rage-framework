declare module 'rage-fw-shared-types' {
    export interface RageFW_ICustomServerEvent {
        customServerEvent(customArgs: string): boolean
        customServerEvent2(...customArgs2: number[]): void
    }

    export interface RageFW_ICustomClientEvent {
        customClientEvent(clientArgs: string): boolean
    }
}

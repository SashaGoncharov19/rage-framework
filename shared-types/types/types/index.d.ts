declare module 'rage-fw-shared-types' {
    export interface RageFW_ICustomServerEvent {
        customServerEvent(test: string, test2: number): void
    }

    export interface RageFW_ICustomClientEvent {
        customClientEvent(test: string, test2: number): void
    }

    export interface RageFW_ICustomCefEvent {
        customCefEvent(test: string, test2: number): void
    }
}

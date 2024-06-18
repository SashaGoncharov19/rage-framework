declare module 'rage-fw-shared-types' {
    export interface RageFW_ICustomServerEvent {
        customServerEvent(arg1: string): number
    }

    export interface RageFW_ICustomClientEvent {
        customClientEvent(arg1: string): number
    }

    export interface RageFW_ICustomCefEvent {
        customCefEvent(arg1: string): number
    }
}

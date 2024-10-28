declare module 'rage-fw-shared-types' {
    export interface RageFW_ICustomServerEvent {}

    export interface RageFW_ICustomClientEvent {
        cefReady(): void
    }

    export interface RageFW_ICustomCefEvent {}
}

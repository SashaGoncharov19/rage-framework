declare module '@entityseven/rage-fw-shared-types' {
    export interface RageFW_ICustomServerEvent {
        customServerEvent(arg1: string, arg2: number): boolean
    }

    export interface RageFW_ICustomClientEvent {
        cefReady(): void
        customClientEvent(arg1: string, arg2: number): boolean
    }

    export interface RageFW_ICustomBrowserEvent {
        customCefEvent(arg1: string, arg2: number): boolean
    }
}

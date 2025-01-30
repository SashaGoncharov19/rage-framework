export {}

declare var global: Record<string, (...args: any[]) => unknown>

declare global {
    interface Window {
        [p: string]: any
    }
}

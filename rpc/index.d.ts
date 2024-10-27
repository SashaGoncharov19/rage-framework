export {}

interface Mp {
    trigger(event: string, data?: any): void
    events: {
        add(event: string, data: any): void
        call(event: string, data: any): void
        callRemote(event: string, data: any): void
        remove(event: string): void
    }
    joaat?: unknown
    game: {
        joaat?: unknown
    }
    console: {
        logInfo: (...args: unknown[]) => void
    }
}

declare global {
    const mp: Mp
    const global: Record<string, (...args: any[]) => unknown>
    interface Window {
        [p: string]: any
    }
}

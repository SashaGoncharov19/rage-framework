declare const mp: any
declare const console: any

declare const setTimeout: (fn: Function, time: number) => number
declare const clearTimeout: (id: number) => void

declare const global: {
    rpcEvents: Record<string, (...args: any[]) => unknown>
}

declare const window: {
    rpcEvents: Record<string, (...args: any[]) => unknown>
}

export class Helper {
    protected debugLogs_: boolean = false
    protected customLogger_:
        | undefined
        | ((method: string, eventName: string, ...args: unknown[]) => unknown) =
        undefined

    constructor() {}

    protected log_(
        method: string,
        eventName: string,
        ...args: unknown[]
    ): void {
        if (this.customLogger_) {
            this.customLogger_(method, eventName, ...args)
        } else if (this.debugLogs_) {
            console.log('[RPC](' + method + ')', eventName + ':', ...args)
        }
    }
}

import { Environment, Errors, RPCState, RpcWrapperConfig, Utils } from './utils'

export class Wrapper {
    protected environment_ = Environment.UNKNOWN
    protected state_: any
    protected console_ =
        this.environment_ === Environment.CLIENT
            ? mp.console.logInfo
            : console.log
    protected debug_ = false
    protected forceBrowserDevMode_ = false

    constructor(
        options: RpcWrapperConfig = {
            forceBrowserDevMode: false,
        },
    ) {
        if (options.forceBrowserDevMode) {
            this.environment_ = Environment.UNKNOWN
            this.state_ = window
        } else {
            this.environment_ = Utils.getEnvironment()
            this.state_ =
                this.environment_ === Environment.BROWSER ? window : global
        }

        this.forceBrowserDevMode_ = !!options.forceBrowserDevMode
    }

    // checks if event is available (registered) in current environment
    protected verifyEvent_(data: string | RPCState): RPCState {
        let rpcData =
            typeof data === 'string' ? Utils.prepareExecution(data) : data

        if (!this.state_[rpcData.eventName]) {
            rpcData.knownError = Errors.EVENT_NOT_REGISTERED
        }

        return rpcData
    }

    protected triggerError_(rpcData: RPCState, error?: any) {
        const errorMessage = [
            `${rpcData.knownError}`,
            `Caller: ${rpcData.calledFrom}`,
            `Receiver: ${this.environment_}`,
            `Event: ${rpcData.eventName}`,
        ]

        if (error) {
            errorMessage.push(`Additional Info: ${error}`)
        }

        throw new Error(errorMessage.join('\n | '))
    }

    protected log(method: string, eventName: string, ...args: unknown[]): void {
        if (this.debug_)
            this.console_('RPC | [' + method + '] ' + eventName + ':', ...args)
    }
}

import { Environment, Errors, RPCState, Utils } from './utils'

export class Wrapper {
    protected environment_ = Utils.getEnvironment()
    protected state_ =
        this.environment_ === Environment.BROWSER ? window : global

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
}

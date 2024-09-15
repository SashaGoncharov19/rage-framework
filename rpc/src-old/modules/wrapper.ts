import { Environment, Errors, RPCState, utils } from '../utils'

export class Wrapper {
    public _utils = utils
    public _environment = utils.getEnvironment()
    public _state = this._environment === Environment.CEF ? window : global

    public _verifyEvent(data: string): RPCState {
        const rpcData = utils.prepareForExecute(data)

        if (!this._state[rpcData.eventName]) {
            rpcData.knownError = Errors.EVENT_NOT_REGISTERED
        }

        return rpcData
    }

    public _triggerError(rpcData: RPCState, error?: any) {
        const errorMessage = [
            `${rpcData.knownError}`,
            `Caller: ${rpcData.calledFrom}`,
            `Receiver: ${this._environment}`,
            `Event: ${rpcData.eventName}`,
        ]

        if (error) {
            errorMessage.push(`Additional Info: ${error}`)
        }

        throw new Error(errorMessage.join(' | '))
    }
}

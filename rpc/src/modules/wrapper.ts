import { Environment, Errors, RPCState, utils } from '../utils'

export class Wrapper {
    protected _utils = utils
    protected _environment = utils.getEnvironment()
    protected _state =
        this._environment === Environment.CEF
            ? window.rpcEvents
            : global.rpcEvents

    protected _verifyEvent(data: string): RPCState {
        const rpcData = utils.prepareForExecute(data)

        if (!this._state[rpcData.eventName]) {
            rpcData.knownError = Errors.EVENT_NOT_REGISTERED
        }

        return rpcData
    }

    protected _triggerError(rpcData: RPCState, error?: any) {
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

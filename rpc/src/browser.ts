import { Wrapper } from './wrapper'
import {
    Environment,
    Events,
    RPCEventType,
    RPCState,
    RpcWrapperConfig,
    Utils,
} from './utils'

export class Browser extends Wrapper {
    constructor(
        options: RpcWrapperConfig = {
            forceBrowserDevMode: false,
        },
    ) {
        super(options)
    }

    public _resolveEmitDestination(dataRaw: string) {
        let state = Utils.prepareExecution(dataRaw)

        switch (state.calledTo) {
            case Environment.BROWSER:
                this.emit(dataRaw)
                break

            default:
                this.emitClient(dataRaw)
                break
        }
    }

    private emitClient(dataRaw: string) {
        mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw)
    }

    private async emit(dataRaw: string) {
        let state = Utils.prepareExecution(dataRaw)
        const responseEventName = Utils.generateResponseEventName(state.uuid)

        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

        const response = await this.state_[state.eventName](
            ...(Array.isArray(state.data) ? state.data : []),
        )
        const responseState: RPCState = {
            uuid: Utils.generateUUID(),
            eventName: state.eventName,
            calledFrom: Environment.SERVER,
            calledTo: state.calledFrom,
            knownError: undefined,
            data: response,
            type: RPCEventType.RESPONSE,
        }
        const responseDataRaw = Utils.prepareTransfer(responseState)

        switch (state.calledFrom) {
            case Environment.BROWSER:
                try {
                    mp.events.call(responseEventName, responseDataRaw)
                } catch (e) {
                    void e
                }
                break
            default:
                try {
                    mp.trigger(responseEventName, responseDataRaw)
                } catch (e) {
                    void e
                }
                break
        }
    }
}

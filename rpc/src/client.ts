import { Wrapper } from './wrapper'
import {
    Environment,
    Errors,
    Events,
    RPCEventType,
    RPCState,
    RpcWrapperConfig,
    Utils,
} from './utils'

/**
 * NOT INTENDED FOR OUT-OF-CONTEXT USE
 */
export class Client extends Wrapper {
    private _browser: any = null

    constructor(
        options: RpcWrapperConfig = {
            forceBrowserDevMode: false,
        },
    ) {
        super(options)
    }

    set browser(browser: any) {
        this._browser = browser
    }

    /**
     * NOT INTENDED FOR OUT-OF-CONTEXT USE
     */
    public _resolveEmitDestination(dataRaw: string) {
        const state = Utils.prepareExecution(dataRaw)

        switch (state.calledTo) {
            case Environment.SERVER:
                this.emitServer(dataRaw)
                break

            case Environment.BROWSER:
                this.emitBrowser(dataRaw)
                break

            case Environment.CLIENT:
                this.emit(state)
                break

            default:
                this.triggerError_(state, Errors.UNKNOWN_ENVIRONMENT)
                break
        }
    }

    // called to client
    private async emit(state: RPCState) {
        this.errorNoBrowser()

        // check availability
        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

        // execute + generate response
        const responseEventName = Utils.generateResponseEventName(state.uuid)
        const response = await this.state_[state.eventName](
            ...(Array.isArray(state.data) ? state.data : []),
        )
        const responseState: RPCState = {
            uuid: Utils.generateUUID(),
            eventName: state.eventName,
            calledFrom: state.calledTo,
            calledTo: state.calledFrom,
            knownError: undefined,
            data: response,
            type: RPCEventType.RESPONSE,
        }

        // send response
        switch (state.calledFrom) {
            case Environment.CLIENT:
                try {
                    mp.events.call(
                        responseEventName,
                        Utils.prepareTransfer(responseState),
                    )
                } catch (e) {
                    void e
                }
                break
            case Environment.SERVER:
                try {
                    mp.events.callRemote(
                        responseEventName,
                        Utils.prepareTransfer(responseState),
                    )
                } catch (e) {
                    void e
                }
                break

            case Environment.BROWSER:
                try {
                    this._browser.call(
                        responseEventName,
                        Utils.prepareTransfer(responseState),
                    )
                } catch (e) {
                    void e
                }
                break
        }
    }

    // called to server
    private emitServer(dataRaw: string) {
        this.errorNoBrowser()

        const state = Utils.prepareExecution(dataRaw)

        // if event is called from browser we will forward response through client via this
        if (state.calledFrom === Environment.BROWSER) {
            const responseEventName = Utils.generateResponseEventName(
                state.uuid,
            )

            const timeout = setTimeout(() => {
                clearTimeout(timeout)
                mp.events.remove(responseEventName)
            }, 10000)

            mp.events.add(responseEventName, (responseDataRaw: string) => {
                this._browser.call(responseEventName, responseDataRaw)

                clearTimeout(timeout)
                mp.events.remove(responseEventName)
            })
        }

        mp.events.callRemote(Events.SERVER_EVENT_LISTENER, dataRaw)
    }

    // called to browser
    private emitBrowser(dataRaw: string) {
        this.errorNoBrowser()

        const state = Utils.prepareExecution(dataRaw)

        // if event is called from server we will forward response through client via this
        if (state.calledFrom === Environment.SERVER) {
            const responseEventName = Utils.generateResponseEventName(
                state.uuid,
            )

            const timeout = setTimeout(() => {
                clearTimeout(timeout)
                mp.events.remove(responseEventName)
            }, 10000)

            mp.events.add(responseEventName, (responseDataRaw: string) => {
                mp.events.callRemote(responseEventName, responseDataRaw)

                clearTimeout(timeout)
                mp.events.remove(responseEventName)
            })
        }

        this._browser.call(Events.LOCAL_EVENT_LISTENER, dataRaw)
    }

    private errorNoBrowser() {
        if (!this._browser) throw new Error(Errors.NO_BROWSER)
    }
}

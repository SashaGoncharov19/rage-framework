import { Wrapper } from './wrapper'
import {
    Environment,
    Events,
    type PlayerMp,
    RPCEventType,
    RPCState,
    RpcWrapperConfig,
    Utils,
} from './utils'

/**
 * NOT INTENDED FOR OUT-OF-CONTEXT USE
 */
export class Server extends Wrapper {
    constructor(
        options: RpcWrapperConfig = {
            forceBrowserDevMode: false,
        },
    ) {
        super(options)

        if (!!options.forceBrowserDevMode) return

        // specific event to save player in context as it is not available on server -> server calls
        mp.events.add(
            Events.SERVER_EVENT_LISTENER,
            async (player: PlayerMp, dataRaw: string) => {
                this.emit(player, dataRaw)
            },
        )
    }

    /**
     * NOT INTENDED FOR OUT-OF-CONTEXT USE
     */
    public _resolveEmitDestination(player: PlayerMp, dataRaw: string) {
        let state = Utils.prepareExecution(dataRaw)

        switch (state.calledTo) {
            case Environment.SERVER:
                this.emit(player, dataRaw)
                break

            default:
                this.emitClient(player as PlayerMp, dataRaw)
                break
        }
    }

    private emitClient(player: PlayerMp, dataRaw: string) {
        player.call(Events.LOCAL_EVENT_LISTENER, [dataRaw])
    }

    // called to server
    private async emit(player: PlayerMp, dataRaw: string) {
        let state = Utils.prepareExecution(dataRaw)
        const responseEventName = Utils.generateResponseEventName(state.uuid)

        // check availability
        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

        // execute + generate response
        const response = await this.state_[state.eventName](
            player,
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

        // send response
        switch (state.calledFrom) {
            case Environment.SERVER:
                try {
                    mp.events.call(
                        responseEventName,
                        Utils.prepareTransfer(responseState),
                    )
                } catch (e) {
                    void e
                }
                break
            default:
                try {
                    player.call(responseEventName, [
                        Utils.prepareTransfer(responseState),
                    ])
                } catch (e) {
                    void e
                }
                break
        }
    }
}

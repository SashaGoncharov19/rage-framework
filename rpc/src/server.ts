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

export class Server extends Wrapper {
    constructor(
        options: RpcWrapperConfig = {
            forceBrowserDevMode: false,
        },
    ) {
        super(options)

        if (!!options.forceBrowserDevMode) return

        mp.events.add(
            Events.SERVER_EVENT_LISTENER,
            async (player: PlayerMp, dataRaw: string) => {
                this.emit(player, dataRaw)
            },
        )
    }

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

    private async emit(player: PlayerMp, dataRaw: string) {
        let state = Utils.prepareExecution(dataRaw)
        const responseEventName = Utils.generateResponseEventName(state.uuid)

        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

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

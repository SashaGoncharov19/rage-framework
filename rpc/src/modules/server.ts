import { Wrapper } from './wrapper'
import { Environment, RPCState } from '../utils'
import { EVENT_LISTENER } from '../events'

class Server extends Wrapper {
    private sendResponseToClient(player: any, data: RPCState) {
        const eventName = this._utils.generateResponseEventName(data.uuid)
        const preparedData = this._utils.prepareForTransfer(data)

        player.call(eventName, [preparedData])
    }

    public async listenEvent(player: any, data: string) {
        const rpcData = this._verifyEvent(data)

        if (rpcData.knownError) {
            this._triggerError(rpcData)
            return
        }

        try {
            const fnResponse = await this._state[rpcData.eventName](
                ...rpcData.data,
            )
            const response = {
                ...rpcData,
                data: fnResponse,
            }

            this.sendResponseToClient(player, response)
        } catch (e) {
            this._triggerError(rpcData, e)
        }
    }

    private handleServerClientReturn(
        uuid: string,
        resolve: (value: unknown) => void,
        reject: (reason?: any) => void,
    ) {
        const responseEvent = this._utils.generateResponseEventName(uuid)
        const timeoutDuration = 1000 * 10

        const timeoutID = setTimeout(() => {
            reject(new Error('Timeout ended'))
            mp.events.remove(responseEvent)
        }, timeoutDuration)

        const handler = (response: string) => {
            const { knownError, data } = this._utils.prepareForExecute(response)

            if (knownError) {
                try {
                    clearTimeout(timeoutID)
                    reject(knownError)
                    return
                } catch (e) {}
            }

            resolve(data)
            mp.events.remove(responseEvent)

            try {
                clearTimeout(timeoutID)
            } catch (e) {}
        }

        mp.events.add(responseEvent, handler)
    }

    public async executeServer<
        Args extends any[] = unknown[],
        Return = unknown,
    >(eventName: string, ...args: Args): Promise<Return | unknown> {
        return new Promise((resolve, reject) => {
            const uuid = this._utils.generateUUID()

            const data: RPCState = {
                uuid,
                eventName,
                calledFrom: this._environment,
                calledTo: Environment.SERVER,
                data: args,
            }

            mp.events.callRemote(
                EVENT_LISTENER,
                this._utils.prepareForTransfer(data),
            )

            this.handleServerClientReturn(uuid, resolve, reject)
        })
    }
}

export const server = new Server()

import { EVENT_LISTENER } from '../events'
import { Wrapper } from './wrapper'
import { RPCState } from '../utils'

class Client extends Wrapper {
    private sendResponseToServer(data: RPCState) {
        const eventName = this._utils.generateResponseEventName(data.uuid)
        const preparedData = this._utils.prepareForTransfer(data)
        mp.events.callRemote(eventName, preparedData)
    }

    public async listenEvent(data: string) {
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

            this.sendResponseToServer(response)
        } catch (e) {
            this._triggerError(rpcData, e)
        }
    }

    private handleClientServerReturn(
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

        const handler = (_: any, response: string) => {
            const { knownError, data } = this._utils.prepareForExecute(response)

            if (knownError)
                try {
                    clearTimeout(timeoutID)
                    reject(knownError)
                    return
                } catch (e) {}

            resolve(data)
            mp.events.remove(responseEvent)

            try {
                clearTimeout(timeoutID)
            } catch (e) {}
        }

        mp.events.add(responseEvent, handler)
    }

    public async executeClient<
        Args extends any[] = unknown[],
        Return = unknown,
    >(
        player: any,
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        return new Promise((resolve, reject) => {
            const uuid = this._utils.generateUUID()

            const data: RPCState = {
                uuid,
                eventName,
                calledFrom: this._environment,
                data: args,
            }

            player.call(EVENT_LISTENER, [this._utils.prepareForTransfer(data)])

            this.handleClientServerReturn(uuid, resolve, reject)
        })
    }
}

export const client = new Client()

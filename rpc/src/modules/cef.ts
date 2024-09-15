import { Wrapper } from './wrapper'
import { Environment, RPCState } from '../utils'
import { CEF_EVENT_LISTENER } from '../events'

class Cef extends Wrapper {
    public async callClient<Args extends any[] = unknown[], Return = unknown>(
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {
        return new Promise((resolve, reject) => {
            const uuid = this._utils.generateUUID()

            const data: RPCState = {
                uuid,
                eventName,
                calledFrom: Environment.CEF,
                calledTo: Environment.CLIENT,
                data: args,
            }

            mp.trigger(CEF_EVENT_LISTENER, this._utils.prepareForTransfer(data))

            this.handleReturn(uuid, resolve, reject)
        })
    }

    public async callServer<Args extends any[] = unknown[], Return = unknown>(
        eventName: string,
        ...args: Args
    ): Promise<Return | unknown> {}

    private async handleReturn(
        uuid: string,
        resolve: (value: unknown) => void,
        reject: (reason?: unknown) => void,
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
}

export const cef = new Cef()

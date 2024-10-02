import { CLIENT_ROUTER_EVENT, EVENT_LISTENER } from '../events'
import { Wrapper } from './wrapper'
import { Environment } from '../utils'

class Client extends Wrapper {
    private browser: any

    constructor() {
        super()

        mp.events.add(CLIENT_ROUTER_EVENT, (data: string) => {
            const parsedData = this._utils.prepareForExecute(data)
            const environment = this._environment

            if (environment === Environment.CLIENT) {
                switch (parsedData.calledTo) {
                    case Environment.SERVER:
                        // route to server listener
                        this.requestToServer(data)
                        break

                    case Environment.CEF:
                        this.requestToBrowser(data)
                        break
                }
            }
        })
    }

    public useBrowser(browser: any) {
        this.browser = browser
    }

    private async createCallbackListener(uuid: string) {
        const eventName = this._utils.generateResponseEventName(uuid)

        const handler = async (data: string) => {
            mp.events.remove(eventName)

            //TODO: transfer to CEF/Server
        }

        mp.events.add(eventName, handler)

        return eventName
    }

    private async requestToServer(data: string) {
        const { uuid } = this._utils.prepareForExecute(data)
        await this.createCallbackListener(uuid)

        mp.events.callRemote(EVENT_LISTENER, data)
    }

    private async requestToBrowser(data: string) {
        const { uuid } = this._utils.prepareForExecute(data)
        await this.createCallbackListener(uuid)

        if (!this.browser) return //TODO: Error browser not initialized

        this.browser.call(EVENT_LISTENER, data)
    }

    // private sendResponseToServer(data: RPCState) {
    //     const eventName = this._utils.generateResponseEventName(data.uuid)
    //     const preparedData = this._utils.prepareForTransfer(data)
    //     mp.events.callRemote(eventName, preparedData)
    // }
    //
    // private sendEventToServer(data: RPCState) {
    //     const eventName = this._utils.generateResponseEventName(data.uuid)
    //     const preparedData = this._utils.prepareForTransfer(data)
    // }
    //
    // public async listenEvent(data: string) {
    //     const rpcData = this._verifyEvent(data)
    //
    //     if (rpcData.knownError) {
    //         this._triggerError(rpcData)
    //         return
    //     }
    //
    //     await this.navigateTo(rpcData.calledTo, rpcData)
    //
    //     // try {
    //     //     const fnResponse = await this._state[rpcData.eventName](
    //     //         ...rpcData.data,
    //     //     )
    //     //     const response = {
    //     //         ...rpcData,
    //     //         data: fnResponse,
    //     //     }
    //     //
    //     //     this.sendResponseToServer(response)
    //     // } catch (e) {
    //     //     this._triggerError(rpcData, e)
    //     // }
    // }
    //
    // private async navigateTo(toEnvironment: Environment, data: RPCState) {
    //     switch (toEnvironment) {
    //         case Environment.SERVER:
    //             this.sendEventToServer()
    //     }
    // }
    //
    // private handleClientServerReturn(
    //     uuid: string,
    //     resolve: (value: unknown) => void,
    //     reject: (reason?: any) => void,
    // ) {
    //     const responseEvent = this._utils.generateResponseEventName(uuid)
    //     const timeoutDuration = 1000 * 10
    //
    //     const timeoutID = setTimeout(() => {
    //         reject(new Error('Timeout ended'))
    //         mp.events.remove(responseEvent)
    //     }, timeoutDuration)
    //
    //     const handler = (_: any, response: string) => {
    //         const { knownError, data } = this._utils.prepareForExecute(response)
    //
    //         if (knownError)
    //             try {
    //                 clearTimeout(timeoutID)
    //                 reject(knownError)
    //                 return
    //             } catch (e) {}
    //
    //         resolve(data)
    //         mp.events.remove(responseEvent)
    //
    //         try {
    //             clearTimeout(timeoutID)
    //         } catch (e) {}
    //     }
    //
    //     mp.events.add(responseEvent, handler)
    // }
    //
    // public async executeClient<
    //     Args extends any[] = unknown[],
    //     Return = unknown,
    // >(
    //     player: any,
    //     eventName: string,
    //     ...args: Args
    // ): Promise<Return | unknown> {
    //     return new Promise((resolve, reject) => {
    //         const uuid = this._utils.generateUUID()
    //
    //         const data: RPCState = {
    //             uuid,
    //             eventName,
    //             calledFrom: this._environment,
    //             calledTo: Environment.CLIENT,
    //             data: args,
    //         }
    //
    //         player.call(EVENT_LISTENER, [this._utils.prepareForTransfer(data)])
    //
    //         this.handleClientServerReturn(uuid, resolve, reject)
    //     })
    // }
}

export const client = new Client()

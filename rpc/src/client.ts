import { utils } from './utils'
import type { RPCData } from './types'

export class Client {
    public async listen(data: string) {
        const parsedData = utils.parseData(data)
        await this.transferTo(parsedData)
    }

    private transferTo(data: RPCData) {
        switch (data.to) {
            case utils.environment.CLIENT:
                return this.executeLocal(data)
            case utils.environment.CEF:
            // todo transfer to cef
            case utils.environment.SERVER:
            // todo transfer to server
        }
    }

    private async executeLocal(data: RPCData) {
        const state =
            utils.getEnvironment() === utils.environment.CEF
                ? window.rpcEvents
                : global.rpcEvents
        const fnResponse = await state[data.eventName](...data.data)

        const response = {
            data: fnResponse,
            ...data,
        }

        this.sendResponseToServer(response)
    }

    private sendResponseToServer(data: RPCData) {
        const eventName = utils.generateResponseEventName(data.uuid)
        const prepareForTransfer = utils.stringifyData(data)

        mp.events.callRemote(eventName, prepareForTransfer)
    }
}

export const client = new Client()

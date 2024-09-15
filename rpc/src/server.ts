import { utils } from './utils'
import type { RPCData } from './types'

export class Server {
    public async listen(player: any, data: string) {
        const parsedData = utils.parseData(data)
        await this.executeLocal(player, parsedData)
    }

    private async executeLocal(player: any, data: RPCData) {
        const state =
            utils.getEnvironment() === utils.environment.CEF
                ? window.rpcEvents
                : global.rpcEvents
        const fnResponse = await state[data.eventName](...data.data)

        const response = {
            data: fnResponse,
            ...data,
        }

        this.sendResponseToClient(player, response)
    }

    private sendResponseToClient(player: any, data: RPCData) {
        const eventName = utils.generateResponseEventName(data.uuid)
        const prepareForTransfer = utils.stringifyData(data)

        player.call(eventName, prepareForTransfer)
    }
}

export const server = new Server()

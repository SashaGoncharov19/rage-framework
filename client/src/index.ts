import rpc from 'rage-rpc'

import type {
    RageFW_ClientEventCallback,
    RageFW_ClientEvent,
    RageFW_ClientServerEvent,
    RageFW_ClientServerEventArguments,
    RageFW_ClientServerEventReturn,
} from './types'

class Client {
    public register<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        callback: RageFW_ClientEventCallback<EventName>,
    ): void {
        rpc.register(eventName, data => {
            return callback(data)
        })
    }
}

class Player {
    public triggerServer<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        args: RageFW_ClientServerEventArguments<EventName>,
    ): Promise<RageFW_ClientServerEventReturn<EventName>> {
        return rpc.callServer(eventName, args)
    }
}

export const fw = {
    event: new Client(),
    player: new Player(),
}

fw.player.triggerServer('customServerEvent', ['wer'])
fw.event.register('customClientEvent', ([arg1]) => true)

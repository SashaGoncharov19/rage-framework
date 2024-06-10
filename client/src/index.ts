import rpc from 'rage-rpc'
import {
    RageFW_ClientEventReturn,
    RageFW_ClientEvent,
    RageFW_ClientEventArguments,
    RageFW_ClientServerCallback,
    RageFW_ClientServerEvent,
} from './types'

class Client {
    public register<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        callback: RageFW_ClientServerCallback<EventName>,
    ): void {
        rpc.register(eventName, callback as rpc.ProcedureListener)
    }
}

class Player {
    public triggerServer<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        ...args: RageFW_ClientEventArguments<EventName>
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.callServer(eventName, ...args)
    }
}

const fw = {
    event: new Client(),
    player: new Player(),
}

export default fw

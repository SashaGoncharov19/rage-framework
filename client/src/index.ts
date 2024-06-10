import rpc from 'rage-rpc'
import {
    RageFW_ClientEventReturn,
    RageFW_ClientEvent,
    RageFW_ClientEventArguments,
} from './types'

class Player {
    public triggerServer<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        ...args: RageFW_ClientEventArguments<EventName>
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.callServer(eventName, ...args)
    }
}

export const rage = {
    player: new Player(),
}

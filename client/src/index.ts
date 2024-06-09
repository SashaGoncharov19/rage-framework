/// <reference types="../../shared/client/index.d.ts" />
import rpc from 'rage-rpc'

class Player implements RageFW_Player {
    public triggerClient<EventName extends RageFW_ClientEvent>(
        player: PlayerMp,
        eventName: EventName,
        ...args: RageFW_ClientEventArguments<EventName>
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.callClient(player, eventName, ...args)
    }
}

export const rage = {
    player: new Player(),
}

const bool = rage.player.triggerClient(
    {} as PlayerMp,
    'customClientEvent',
    'arg1',
    2,
)

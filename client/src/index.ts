import { Client, Logger, Player, rpc } from './core'

export const fw = {
    event: new Client(),
    player: new Player(),
    system: {
        log: new Logger(),
    },
    rpc,
}

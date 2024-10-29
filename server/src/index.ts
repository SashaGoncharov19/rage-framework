import { Logger, Player, Server, rpc } from './core'

export const fw = {
    event: new Server(),
    player: new Player(),
    system: {
        log: new Logger(),
    },
    rpc,
}

fw.system.log.info(
    'Working on Rage Framework. RageFW © Powered by Entity Seven Group',
)

import { Server, Logger, Player } from './core'

export const fw = {
    event: new Server(),
    player: new Player(),
    system: {
        log: new Logger(),
    },
}

fw.system.log.info(
    'Working on Rage Framework. RageFW © Powered by Entity Seven Group',
)

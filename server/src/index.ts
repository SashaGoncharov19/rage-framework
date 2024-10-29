import { Logger, Player, Server, rpc } from './core'

export type { RageFW_MiddlewareFunction } from './types'

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

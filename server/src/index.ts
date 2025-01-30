import { FW_Logger, FW_Player, FW_Server, rpc } from './core'

export type { FW_MiddlewareFunction } from './types'

/**
 * Package used on a server-side of your Rage:MP Server
 *
 * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
 */
export const fw = {
    /** Server-side interactions */
    event: new FW_Server(),
    /** Handles event manipulations that require player to be present in context */
    player: new FW_Player(),
    /** Handles functions used to interact with the client environment */
    system: {
        /** Used to log in a server console */
        log: new FW_Logger(),
    },
    /** ``rage-fw-rpc`` instance used under the hood. It is highly recommended to use this one if you need it instead of creating a new instance */
    rpc,
}

fw.system.log.info(
    'Working on Rage Framework. RageFW © Powered by Entity Seven Group',
)

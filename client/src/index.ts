import { FW_Client, FW_Logger, FW_Player, rpc } from './core'

export type { FW_MiddlewareFunction } from './types'

/**
 * Package used on a client-side of your Rage:MP Server
 *
 * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
 */
export const fw = {
    /** Client-side interactions */
    event: new FW_Client(),
    /** Handles event manipulations that require player to be present in context */
    player: new FW_Player(),
    /** Handles functions used to interact with the client environment */
    system: {
        /** Used to log in a client in-game console */
        log: new FW_Logger(),
    },
    /** ``rage-fw-rpc`` instance used under the hood. It is highly recommended to use this one if you need it instead of creating a new instance */
    rpc,
}

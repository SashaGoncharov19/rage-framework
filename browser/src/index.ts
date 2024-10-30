import { Browser, rpc } from './core'

/**
 * Package used on a browser-side of your Rage:MP Server
 *
 * @see {@link https://git.entityseven.com/entityseven/rage-framework/wiki Wiki}
 */
export const fw = {
    /** Browser-side interactions */
    event: new Browser(),
    /** ``rage-fw-rpc`` instance used under the hood. It is highly recommended to use this one if you need it instead of creating a new instance */
    rpc,
}
;(async () => {
    await fw.event.triggerClient('cefReady')
})()

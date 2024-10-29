import { Browser, rpc } from './core'

export const fw = {
    event: new Browser(),
    rpc,
}
;(async () => {
    await fw.event.triggerClient('cefReady')
})()

import { Browser, Client, Logger, Player } from './core'

export const fw = {
    event: new Client(),
    player: new Player(),
    browser: new Browser(),
    system: {
        log: new Logger(),
    },
}

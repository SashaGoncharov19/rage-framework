import { Player } from './'

export class Browser extends Player {
    public registerBrowser(browser: BrowserMp) {
        this.browser = browser
        return browser
    }
}

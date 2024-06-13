import rpc from 'rage-rpc'

import Logger from './logger'

import {
    RageFW_ClientEventCallback,
    RageFW_ClientEvent,
    RageFW_ClientServerEvent,
    RageFW_ClientServerEventArguments,
    RageFW_ClientServerEventReturn,
    RageFW_ClientEventArguments,
    RageFW_ClientEventReturn,
    _ClientEventHasArgs,
    _ServerEventHasArgs,
    RageFW_CefEvent,
    RageFW_CefArgs,
    RageFW_CefReturn,
} from './types'

import type { RageFW_ICustomClientEvent } from 'rage-fw-shared-types'

class Client {
    public register<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
        callback: RageFW_ClientEventCallback<EventName>,
    ): void {
        rpc.register(eventName, data => {
            return callback(data)
        })
    }

    public unregister<EventName extends RageFW_ClientEvent>(
        eventName: EventName,
    ): void {
        rpc.unregister(eventName)
    }
}

class Player {
    public browser: BrowserMp | undefined

    public trigger<EventName extends keyof RageFW_ICustomClientEvent>(
        eventName: EventName,
        ...args: _ClientEventHasArgs<EventName> extends true
            ? [RageFW_ClientEventArguments<EventName>]
            : []
    ): Promise<RageFW_ClientEventReturn<EventName>> {
        return rpc.call<RageFW_ClientEventReturn<EventName>>(eventName, args)
    }

    public triggerServer<EventName extends RageFW_ClientServerEvent>(
        eventName: EventName,
        ...args: _ServerEventHasArgs<EventName> extends true
            ? [RageFW_ClientServerEventArguments<EventName>]
            : []
    ): Promise<RageFW_ClientServerEventReturn<EventName>> {
        return rpc.callServer(eventName, args)
    }

    public triggerBrowser<EventName extends RageFW_CefEvent>(
        eventName: EventName,
        args: RageFW_CefArgs<EventName>,
    ): Promise<RageFW_CefReturn<EventName>> {
        if (!this.browser)
            throw new Error('You need to initialize browser first!')
        return rpc.callBrowser(this.browser, eventName, args)
    }
}

class Browser extends Player {
    public registerBrowser(browser: BrowserMp) {
        this.browser = browser
        return browser
    }
}

export const fw = {
    event: new Client(),
    player: new Player(),
    browser: new Browser(),
    system: {
        log: new Logger(),
    },
}

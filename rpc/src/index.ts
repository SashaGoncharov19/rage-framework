import { Wrapper } from './wrapper'
import {
    Environment,
    Errors,
    Events,
    nativeClientEvents,
    nativeServerEvents,
    type PlayerMp,
    RpcConfig,
    RPCEventType,
    RPCState,
    Utils,
} from './utils'

import { Server } from './server'
import { Client } from './client'
import { Browser } from './browser'

class Rpc extends Wrapper {
    private _server: Server
    private _client: Client
    private _browser: Browser

    constructor(
        options: RpcConfig = {
            forceBrowserDevMode: false,
            debugLogs: false,
        },
    ) {
        super(options)

        this._server = new Server(options)
        this._client = new Client(options)
        this._browser = new Browser(options)
        this.debug_ = !!options.debugLogs

        if (options.forceBrowserDevMode) return

        if (this.environment_ === Environment.UNKNOWN)
            throw new Error(Errors.UNKNOWN_ENVIRONMENT)

        mp.events.add(
            Events.LOCAL_EVENT_LISTENER,
            async (player: PlayerMp | string, dataRaw: string) => {
                switch (this.environment_) {
                    case Environment.SERVER:
                        this._server._resolveEmitDestination(
                            player as PlayerMp,
                            dataRaw,
                        )
                        break

                    case Environment.CLIENT:
                        dataRaw = player as string
                        this._client._resolveEmitDestination(dataRaw)
                        break

                    case Environment.BROWSER:
                        dataRaw = player as string
                        this._browser._resolveEmitDestination(dataRaw)
                        break

                    default:
                        void { player, dataRaw }
                        break
                }
            },
        )
    }

    set browser(browser: any) {
        this._client.browser = browser
    }

    /**
     * Registers a callback function for a specified event
     *
     * @template CallbackArguments - An array of argument types that the callback function accepts
     * @template CallbackReturn - The type of the value returned by the callback function
     * @template EventName - A string representing the event name or union of names
     *
     * @param {EventName} eventName - The name of the event to register the callback for
     * @param {(...args: CallbackArguments) => CallbackReturn} cb - The callback function that is called when the event is triggered
     *
     * @returns {void}
     *
     * @example
     * register<[PlayerMp]>('playerJoin', (player) => {
     *   console.log(`Connected: ${player.socialClub}`)
     * })
     */
    public register<
        CallbackArguments extends unknown[] = unknown[],
        CallbackReturn extends unknown = unknown,
        EventName extends string = string,
    >(
        eventName: EventName,
        cb: (...args: CallbackArguments) => CallbackReturn,
    ): void {
        this.log('register', eventName, cb)
        if (this.forceBrowserDevMode_) return
        Utils.errorUnknownEnvironment(this.environment_)

        if (
            (this.environment_ === Environment.CLIENT &&
                nativeClientEvents.has(eventName)) ||
            (this.environment_ === Environment.SERVER &&
                nativeServerEvents.has(eventName))
        ) {
            mp.events.add(eventName, cb)
        } else {
            this.state_[eventName] = cb
        }
    }

    /**
     * Unregisters callback function for a specified event
     *
     * @template EventName - A string representing the event name or union of names
     *
     * @param {EventName} eventName - The name of the event to register the callback for
     *
     * @returns {void}
     *
     * @example
     * unregister('playerJoin')
     */
    public unregister<EventName extends string = string>(
        eventName: EventName,
    ): void {
        this.log('unregister', eventName)
        if (this.forceBrowserDevMode_) return
        Utils.errorUnknownEnvironment(this.environment_)

        delete this.state_[eventName]
    }

    /**
     * Calls a client-side event from server or browser
     *
     * @template Arguments - An array of argument types to be passed to the client event
     * @template EventName - A string representing the client event name or union of names
     * @template Return - The type of the value returned by the client event
     *
     * @param {EventName} eventName - The name of the client event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the client event
     * @returns {Promise<Return>} A promise resolving to the return value of the client event
     *
     * @example
     * // Calls an event on client without specifying a player
     * callClient<[], string, object>('onDataRequest').then(response => {
     *   console.log(`Received: ${response}`) //             ^ object
     * })
     */
    public async callClient<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return>
    /**
     * Calls a client-side event from server or browser
     *
     * @template Arguments - An array of argument types to be passed to the client event
     * @template EventName - A string representing the client event name or union of names
     * @template Return - The type of the value returned by the client event
     *
     * @param {PlayerMp} player - The player for whom the client event is called
     * @param {EventName} eventName - The name of the client event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the client event
     * @returns {Promise<Return>} A promise resolving to the return value of the client event
     *
     * @example
     * // Calls an event on client for a specific player
     * callClient<[string, number], string, boolean>(player, 'onPlayerAction', ['jump', 2]).then(result => {
     *   console.log(`Action success: ${result}`) //                                              ^ boolean
     * })
     */
    public async callClient<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(player: PlayerMp, eventName: EventName, args?: Arguments): Promise<Return>
    public async callClient(
        playerOrEventName: PlayerMp | string,
        eventNameOrArgs?: string | unknown[],
        args?: unknown[],
    ) {
        _is1StParamPlayer(playerOrEventName)
            ? this.log(
                  'callClient',
                  eventNameOrArgs as string,
                  playerOrEventName,
                  eventNameOrArgs,
                  args,
              )
            : this.log(
                  'callClient',
                  playerOrEventName as string,
                  eventNameOrArgs,
              )
        if (this.forceBrowserDevMode_) return
        Utils.errorUnknownEnvironment(this.environment_)

        function _is1StParamPlayer(x: unknown): x is PlayerMp {
            return typeof x === 'object'
        }

        function _is2NdParamEventName(x: unknown): x is string {
            return typeof x === 'string'
        }

        if (this.environment_ === Environment.CLIENT) {
            // client
            return await this.call(
                playerOrEventName as string,
                args as unknown[],
            )
        }

        // server
        if (
            this.environment_ === Environment.SERVER &&
            _is1StParamPlayer(playerOrEventName) &&
            _is2NdParamEventName(eventNameOrArgs)
        ) {
            const state: RPCState = {
                uuid: Utils.generateUUID(),
                eventName: eventNameOrArgs,
                calledTo: Environment.CLIENT,
                calledFrom: this.environment_,
                knownError: undefined,
                data: args as unknown[],
                type: RPCEventType.EVENT,
            }

            const dataRaw = Utils.prepareTransfer(state)

            playerOrEventName.call(Events.LOCAL_EVENT_LISTENER, [dataRaw])
            return (await this.responseHandler(state.uuid)).data
        }

        // browser
        if (
            this.environment_ === Environment.BROWSER &&
            !_is1StParamPlayer(playerOrEventName) &&
            !_is2NdParamEventName(eventNameOrArgs)
        ) {
            const state: RPCState = {
                uuid: Utils.generateUUID(),
                eventName: playerOrEventName,
                calledTo: Environment.CLIENT,
                calledFrom: this.environment_,
                knownError: undefined,
                data: eventNameOrArgs,
                type: RPCEventType.EVENT,
            }

            const dataRaw = Utils.prepareTransfer(state)

            mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw)
            return (await this.responseHandler(state.uuid)).data
        }
    }

    /**
     * Calls a server-side event from browser or client
     *
     * @template Arguments - An array of argument types to be passed to the server event
     * @template EventName - A string representing the server event name or union of names
     * @template Return - The type of the value returned by the server event
     *
     * @param {EventName} eventName - The name of the server event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the server event
     * @returns {Promise<Return>} A promise resolving to the return value of the server event
     *
     * @example
     * // Calls an event on server
     * callServer<[], string, object>('onDataRequest').then(response => {
     *   console.log(`Received: ${response}`) //             ^ object
     * })
     */
    public async callServer<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return> {
        this.log('callServer', eventName, args)
        if (this.forceBrowserDevMode_)
            return undefined as unknown as Promise<Return>
        Utils.errorUnknownEnvironment(this.environment_)

        const state: RPCState = {
            uuid: Utils.generateUUID(),
            eventName,
            calledTo: Environment.SERVER,
            calledFrom: this.environment_,
            knownError: undefined,
            data: args,
            type: RPCEventType.EVENT,
        }

        const dataRaw = Utils.prepareTransfer(state)

        switch (this.environment_) {
            case Environment.SERVER:
                return this.callSelf(state)

            case Environment.CLIENT:
                mp.events.callRemote(Events.LOCAL_EVENT_LISTENER, dataRaw)
                break

            case Environment.BROWSER:
                mp.trigger(Events.LOCAL_EVENT_LISTENER, dataRaw)
                break
        }

        return (await this.responseHandler(state.uuid)).data
    }

    /**
     * Calls a browser-side event from server or client
     *
     * @template Arguments - An array of argument types to be passed to the browser event
     * @template EventName - A string representing the browser event name or union of names
     * @template Return - The type of the value returned by the browser event
     *
     * @param {EventName} eventName - The name of the browser event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the browser event
     * @returns {Promise<Return>} A promise resolving to the return value of the browser event
     *
     * @example
     * // Calls an event on browser without specifying a player
     * callBrowser<[], string, object>('onDataRequest').then(response => {
     *   console.log(`Received: ${response}`) //             ^ object
     * })
     */
    public async callBrowser<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return>
    /**
     * Calls a browser-side event from server or client
     *
     * @template Arguments - An array of argument types to be passed to the browser event
     * @template EventName - A string representing the browser event name or union of names
     * @template Return - The type of the value returned by the browser event
     *
     * @param {PlayerMp} player - The player for whom the browser event is called
     * @param {EventName} eventName - The name of the browser event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the browser event
     * @returns {Promise<Return>} A promise resolving to the return value of the browser event
     *
     * @example
     * // Calls an event on a browser for a specific player
     * callBrowser<[string, number], string, boolean>(player, 'onPlayerAction', ['jump', 2]).then(result => {
     *   console.log(`Action success: ${result}`) //                                              ^ boolean
     * })
     */
    public async callBrowser<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(player: PlayerMp, eventName: EventName, args?: Arguments): Promise<Return>
    public async callBrowser(
        playerOrEventName: PlayerMp | string,
        eventNameOrArgs?: string | unknown[],
        args?: unknown[],
    ) {
        _is1StParamPlayer(playerOrEventName)
            ? this.log(
                  'DEV callClient',
                  eventNameOrArgs as string,
                  playerOrEventName,
                  eventNameOrArgs,
                  args,
              )
            : this.log(
                  'DEV callClient',
                  playerOrEventName as string,
                  eventNameOrArgs,
              )
        if (this.forceBrowserDevMode_) return
        Utils.errorUnknownEnvironment(this.environment_)

        function _is1StParamPlayer(x: unknown): x is PlayerMp {
            return typeof x === 'object'
        }

        function _is2NdParamEventName(x: unknown): x is string {
            return typeof x === 'string'
        }

        const state: RPCState = {
            uuid: Utils.generateUUID(),
            eventName: !_is1StParamPlayer(playerOrEventName)
                ? playerOrEventName
                : _is2NdParamEventName(eventNameOrArgs)
                  ? eventNameOrArgs
                  : '',
            calledTo: Environment.BROWSER,
            calledFrom: this.environment_,
            knownError: undefined,
            data: _is1StParamPlayer(playerOrEventName) ? args : eventNameOrArgs,
            type: RPCEventType.EVENT,
        }

        const dataRaw = Utils.prepareTransfer(state)

        switch (this.environment_) {
            case Environment.BROWSER:
                return this.callSelf(state)

            case Environment.CLIENT:
                mp.events.callRemote(Events.LOCAL_EVENT_LISTENER, dataRaw)
                break

            case Environment.SERVER:
                ;(playerOrEventName as PlayerMp).call(
                    Events.LOCAL_EVENT_LISTENER,
                    [dataRaw],
                )
                break
        }

        return (await this.responseHandler(state.uuid)).data
    }

    /**
     * Calls an event in current environment
     *
     * @template Arguments - An array of argument types to be passed to the event
     * @template EventName - A string representing the event name or union of names
     * @template Return - The type of the value returned by the event
     *
     * @param {EventName} eventName - The name of the event to be called
     * @param {Arguments} [args] - Optional arguments to pass to the event
     * @returns {Promise<Return>} A promise resolving to the return value of the event
     *
     * @example
     * // Calls an event in current environment
     * call<[], string, number>('getSomething').then(response => {
     *   console.log(`Received: ${response}`) //      ^ number
     * })
     */
    public async call<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return> {
        this.log('call', eventName, args)
        if (this.forceBrowserDevMode_)
            return undefined as unknown as Promise<Return>
        Utils.errorUnknownEnvironment(this.environment_)

        let state: RPCState = {
            uuid: Utils.generateUUID(),
            eventName,
            calledTo: this.environment_,
            calledFrom: this.environment_,
            knownError: undefined,
            data: args,
            type: RPCEventType.EVENT,
        }

        return await this.callSelf<Return>(state)
    }

    /**
     * redirects an event in cases of it calling its own environment
     */
    private async callSelf<Return extends unknown = unknown>(
        state: RPCState,
    ): Promise<Return> {
        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

        return await this.state_[state.eventName](...state.data)
    }

    /**
     * returns cross-environment response
     */
    private async responseHandler(uuid: string): Promise<RPCState> {
        const responseEventName = Utils.generateResponseEventName(uuid)

        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                clearTimeout(timeout)
                mp.events.remove(responseEventName)
                reject(Errors.EVENT_RESPONSE_TIMEOUT)
            }, 10000)

            mp.events.add(
                responseEventName,
                (player: PlayerMp | string, dataRaw: string) => {
                    switch (this.environment_) {
                        case Environment.SERVER:
                            resolve(Utils.prepareExecution(dataRaw))

                            clearTimeout(timeout)
                            mp.events.remove(responseEventName)

                            break

                        case Environment.CLIENT:
                            dataRaw = player as string
                            resolve(Utils.prepareExecution(dataRaw))

                            clearTimeout(timeout)
                            mp.events.remove(responseEventName)

                            break

                        case Environment.BROWSER:
                            dataRaw = player as string
                            resolve(Utils.prepareExecution(dataRaw))

                            clearTimeout(timeout)
                            mp.events.remove(responseEventName)

                            break

                        default:
                            void { player, dataRaw }
                            break
                    }
                },
            )
        })
    }
}

export { Rpc }

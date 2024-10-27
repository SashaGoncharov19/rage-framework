import { Wrapper } from './wrapper'
import {
    Environment,
    Errors,
    Events,
    nativeClientEvents,
    nativeServerEvents,
    RPCEventType,
    RPCState,
    Utils,
    type PlayerMp,
} from './utils'

import { server } from './server'
import { client } from './client'
import { browser } from './browser'

class Rpc extends Wrapper {
    constructor() {
        super()

        if (this.environment_ === Environment.UNKNOWN)
            throw new Error(Errors.UNKNOWN_ENVIRONMENT)

        mp.events.add(
            Events.LOCAL_EVENT_LISTENER,
            async (player: PlayerMp | string, dataRaw: string) => {
                switch (this.environment_) {
                    case Environment.SERVER:
                        server._resolveEmitDestination(
                            player as PlayerMp,
                            dataRaw,
                        )
                        break

                    case Environment.CLIENT:
                        dataRaw = player as string
                        client._resolveEmitDestination(dataRaw)
                        break

                    case Environment.BROWSER:
                        dataRaw = player as string
                        browser._resolveEmitDestination(dataRaw)
                        break

                    default:
                        void { player, dataRaw }
                        break
                }
            },
        )
    }

    public register<
        CallbackArguments extends unknown[] = unknown[],
        CallbackReturn extends unknown = unknown,
        EventName extends string = string,
    >(
        eventName: EventName,
        cb: (...args: CallbackArguments) => CallbackReturn,
    ): void {
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

    public unregister<EventName extends string = string>(
        eventName: EventName,
    ): void {
        Utils.errorUnknownEnvironment(this.environment_)

        delete this.state_[eventName]
    }

    public async callClient<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return>
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
        Utils.errorUnknownEnvironment(this.environment_)

        function _is1StParamPlayer(x: unknown): x is PlayerMp {
            return typeof x === 'object'
        }
        function _is2NdParamEventName(x: unknown): x is string {
            return typeof x === 'string'
        }

        // client
        if (this.environment_ === Environment.CLIENT) {
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

    public async callServer<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return> {
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

    public async callBrowser<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return>
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

    public async call<
        Arguments extends unknown[] = unknown[],
        EventName extends string = string,
        Return extends unknown = unknown,
    >(eventName: EventName, args?: Arguments): Promise<Return> {
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

        return this.callSelf<Return>(state)
    }

    private callSelf<Return extends unknown = unknown>(
        state: RPCState,
    ): Return {
        state = this.verifyEvent_(state)
        if (state.knownError) {
            this.triggerError_(state, state.knownError)
        }

        return this.state_[state.eventName](...state.data)
    }

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

const rpc = new Rpc()
export { rpc, client }
